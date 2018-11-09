import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import styles from './style';

const DSModal = ({ children, header, ...props }) => (
  <Modal {...props}>
    <View style={styles.outerWrapper}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{header}</Text>
          <Button iconRight light style={styles.closeButton} small transparent onPress={props.onRequestClose}>
            <Icon style={styles.closeButtonIcon} type="FontAwesome" name="times" />
          </Button>
        </View>
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  </Modal>
);

DSModal.propTypes = {};

export default DSModal;
