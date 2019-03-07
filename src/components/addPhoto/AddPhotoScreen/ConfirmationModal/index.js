import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, Button, Spinner, Icon } from 'native-base';
import Copy from 'src/assets/Copy';
import { PostStatus } from 'src/store/ResourceStore';
import Modal from 'src/components/common/Modal';
import Theme, { IsSmallScreen } from 'src/assets/theme';
import baseStyles from 'src/assets/style';
import ConfirmationItem from './ConfirmationItem';
import styles from './style';

class ConfirmationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      captionChecked: false,
      taggedChecked: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.props.visible) {
      this.reset();
    }
  }

  toggleChecked = item => e => {
    if (this.props.uploadStatus === PostStatus.sending) {
      return;
    }
    this.setState(prevState => ({ [`${item}Checked`]: !prevState[`${item}Checked`] }));
    e.preventDefault();
  };

  confirm = () => {
    if (this.props.uploadStatus === PostStatus.pending) {
      this.props.onConfirm();
    }
  };

  reset = () => {
    this.setState({
      captionChecked: false,
      taggedChecked: false,
    });
  };

  render() {
    const { visible, caption, taggedPeople, uploadStatus, onCancel } = this.props;
    const { captionChecked, taggedChecked } = this.state;
    const isUploading = uploadStatus === PostStatus.sending;
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={onCancel}
        onDismiss={this.reset}
        header={Copy.confirmationModalTitle}
      >
        <ConfirmationItem
          checked={captionChecked}
          toggleChecked={this.toggleChecked('caption')}
          isUploading={isUploading}
          label={Copy.confirmCaptionLabel}
          content={`"${caption}"`}
        />
        <ConfirmationItem
          checked={taggedChecked}
          toggleChecked={this.toggleChecked('tagged')}
          isUploading={isUploading}
          label={Copy.confirmTaggedLabel}
          content={taggedPeople}
        />
        <View style={styles.footer}>
          <Button
            style={styles.cancelButton}
            small={IsSmallScreen}
            light
            block
            onPress={onCancel}
            disabled={isUploading}
          >
            <Icon type="FontAwesome" name="undo" />
            <Text style={styles.buttonText}>{Copy.confirmationBackButtonText}</Text>
          </Button>
          <Button
            style={styles.confirmButton}
            primary
            small={IsSmallScreen}
            block
            onPress={this.confirm}
            disabled={!captionChecked || !taggedChecked}
          >
            {isUploading ? (
              <Spinner size="small" style={baseStyles.buttonSpinner} color={Theme.btnPrimaryColor} />
            ) : (
              <Icon type="FontAwesome" name="upload" />
            )}
            <Text style={styles.buttonText}>{Copy.confirmationUploadButtonText}</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}

ConfirmationModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  caption: PropTypes.string.isRequired,
  taggedPeople: PropTypes.string.isRequired,
  uploadStatus: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmationModal;
