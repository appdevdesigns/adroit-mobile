import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Text, Button, CheckBox, Spinner, Label, Icon } from 'native-base';
import Copy from 'src/assets/Copy';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import { PostStatus } from 'src/store/ResourceStore';
import Modal from 'src/components/common/Modal';
import Theme, { IsSmallScreen } from 'src/assets/theme';
import baseStyles from 'src/assets/style';
import styles from './style';

@inject('activityImages')
@observer
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
    if (this.props.activityImages.uploadStatus === PostStatus.sending) {
      return;
    }
    this.setState(prevState => ({ [`${item}Checked`]: !prevState[`${item}Checked`] }));
    e.preventDefault();
  };

  confirm = () => {
    if (this.props.activityImages.uploadStatus === PostStatus.pending) {
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
    const {
      visible,
      caption,
      taggedPeople,
      activityImages: { uploadStatus },
      onCancel,
    } = this.props;
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
        <View style={styles.item} >
          <CheckBox
            style={styles.checkbox}
            checked={captionChecked}
            onPress={this.toggleChecked('caption')}
            disabled={isUploading}
          />
          <View style={styles.itemBody}>
            <TouchableOpacity onPress={this.toggleChecked('caption')}>
              <Text style={styles.label}>{Copy.confirmCaptionLabel}</Text>
            </TouchableOpacity>
            <ScrollView style={styles.scrollContainer}>
              <Text style={styles.context}>{`"${caption}"`}</Text>
            </ScrollView>
          </View>
        </View>
        <View style={styles.item}>
          <CheckBox
            style={styles.checkbox}
            checked={taggedChecked}
            onPress={this.toggleChecked('tagged')}
            disabled={isUploading}
          />
          <View style={styles.itemBody}>
            <TouchableOpacity onPress={this.toggleChecked('tagged')}>
              <Text style={styles.label}>{Copy.confirmTaggedLabel}</Text>
            </TouchableOpacity>
            <ScrollView style={styles.scrollContainer}>
              <Text style={styles.context}>{taggedPeople}</Text>
            </ScrollView>
          </View>
        </View>
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
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

ConfirmationModal.defaultProps = {};

ConfirmationModal.wrappedComponent.propTypes = {
  activityImages: PropTypes.instanceOf(ActivityImagesStore).isRequired,
};

export default ConfirmationModal;
