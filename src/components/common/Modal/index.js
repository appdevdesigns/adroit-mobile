import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import styles from './style';

const DSModal = ({ children, header, hideHeader, contentStyle, ...props }) => (
  <Modal {...props}>
    <View style={styles.outerWrapper}>
      <View style={styles.wrapper}>
        {!hideHeader && (
          <View style={styles.header}>
            <Text style={styles.headerText}>{header}</Text>
            <Button iconRight light style={styles.closeButton} small transparent onPress={props.onRequestClose}>
              <Icon style={styles.closeButtonIcon} type="FontAwesome" name="times" />
            </Button>
          </View>
        )}
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </View>
  </Modal>
);

DSModal.propTypes = {
  header: PropTypes.string,
  onRequestClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  hideHeader: PropTypes.bool,
  contentStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.shape()]),
};

DSModal.defaultProps = {
  children: undefined,
  header: '',
  hideHeader: false,
  contentStyle: {},
};

export default DSModal;
