import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';
import { Text, Button, CheckBox, Spinner, Label, ListItem, Body, Icon } from 'native-base';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import { PostStatus } from 'src/store/ResourceStore';
import Modal from 'src/components/common/Modal';
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

  toggleCaptionChecked = e => {
    this.setState(prevState => ({ captionChecked: !prevState.captionChecked }));
    e.preventDefault();
  };

  toggleTaggedChecked = e => {
    this.setState(prevState => ({ taggedChecked: !prevState.taggedChecked }));
    e.preventDefault();
  };

  cancel = () => {
    this.props.onCancel();
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
    const { visible, caption, taggedPeople, activityImages } = this.props;
    const { captionChecked, taggedChecked } = this.state;
    const { uploadStatus } = activityImages;
    const isUploading = uploadStatus === PostStatus.sending;
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={this.cancel}
        onDismiss={this.reset}
        header="Review your submission"
      >
        <View>
          <ListItem style={styles.item} onPress={this.toggleCaptionChecked}>
            <CheckBox
              style={styles.checkbox}
              checked={captionChecked}
              onPress={this.toggleCaptionChecked}
              disabled={isUploading}
            />
            <Body style={styles.itemBody}>
              <Label style={styles.label}>My caption describes how I am helping local Thais</Label>
              <ScrollView style={styles.scrollContainer}>
                <Text style={styles.context}>
                  &quot;
                  {caption || ''}
                  &quot;
                </Text>
              </ScrollView>
            </Body>
          </ListItem>
          <ListItem style={styles.item} onPress={this.toggleTaggedChecked}>
            <CheckBox
              style={styles.checkbox}
              checked={taggedChecked}
              onPress={this.toggleTaggedChecked}
              disabled={isUploading}
            />
            <Body style={styles.itemBody}>
              <Label style={styles.label}>I have tagged everyone on my team who is in this photo</Label>
              <ScrollView style={styles.scrollContainer}>
                <Text style={styles.context}>{taggedPeople || ''}</Text>
              </ScrollView>
            </Body>
          </ListItem>
        </View>
        <View style={styles.footer}>
          <Button style={styles.cancelButton} light block onPress={this.cancel} disabled={isUploading}>
            <Icon type="FontAwesome" name="undo" />
            <Text style={styles.buttonText}>Go back</Text>
          </Button>
          <Button
            style={styles.confirmButton}
            primary
            block
            onPress={this.confirm}
            disabled={!captionChecked || !taggedChecked}
          >
            {isUploading ? (
              <Spinner size="small" style={baseStyles.buttonSpinner} color="#fff" />
            ) : (
              <Icon type="FontAwesome" name="upload" />
            )}
            <Text style={styles.buttonText}>Upload</Text>
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
