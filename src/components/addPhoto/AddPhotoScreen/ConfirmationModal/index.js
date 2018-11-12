import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import { Text, Button, CheckBox, Spinner, Label, ListItem, Body, Icon } from 'native-base';
import Modal from 'src/components/common/Modal';
import styles from './style';

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
    this.reset();
  };

  confirm = () => {
    this.props.onConfirm();
    this.reset();
  };

  reset = () => {
    this.setState({
      captionChecked: false,
      taggedChecked: false,
    });
  };

  render() {
    const { visible, caption, taggedPeople, isUploading } = this.props;
    const { captionChecked, taggedChecked } = this.state;
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={this.cancel}
        header="Review your submission"
      >
        <View>
          <ListItem style={styles.item} onPress={this.toggleCaptionChecked}>
            <CheckBox style={styles.checkbox} checked={captionChecked} onPress={this.toggleCaptionChecked} />
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
            <CheckBox style={styles.checkbox} checked={taggedChecked} onPress={this.toggleTaggedChecked} />
            <Body style={styles.itemBody}>
              <Label style={styles.label}>I have tagged everyone on my team who is in this photo</Label>
              <ScrollView style={styles.scrollContainer}>
                <Text style={styles.context}>{taggedPeople || ''}</Text>
              </ScrollView>
            </Body>
          </ListItem>
        </View>
        <View style={styles.footer}>
          <Button style={styles.cancelButton} light block onPress={this.cancel}>
            <Icon type="FontAwesome" name="undo" />
            <Text style={styles.buttonText}>Go back</Text>
          </Button>
          <Button
            style={styles.confirmButton}
            primary
            block
            onPress={this.confirm}
            disabled={isUploading || !captionChecked || !taggedChecked}
          >
            {isUploading ? <Spinner size="small" /> : <Icon type="FontAwesome" name="upload" />}
            <Text style={!isUploading ? styles.buttonText : undefined}>Upload</Text>
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
  isUploading: PropTypes.bool.isRequired,
};

ConfirmationModal.defaultProps = {};

export default ConfirmationModal;
