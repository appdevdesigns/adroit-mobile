import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground, Image } from 'react-native';
import { Text, Button } from 'native-base';
import Copy from 'src/assets/Copy';
import Modal from 'src/components/common/Modal';
import baseStyles from 'src/assets/style';
import { IsSmallScreen } from 'src/assets/theme';
import styles from './style';

const logoImage = require('src/assets/img/AdroitLogoNew.png');
const bgImage = require('src/assets/img/collage.jpg');

const IntroModal = ({ visible, onConfirm, onCancel }) => (
  <Modal visible={visible} animationType="fade" transparent hideHeader onRequestClose={onCancel}>
    <View>
      <ImageBackground style={styles.bgImage} source={bgImage}>
        <View style={styles.topContainer}>
          <Text style={styles.title1}>{Copy.introModalTitle1}</Text>
          <Image source={logoImage} style={styles.logo} />
        </View>
      </ImageBackground>
      <View>
        <Text style={baseStyles.paragraph}>{Copy.introModalMain.p1}</Text>
        <Text style={baseStyles.paragraph}>{Copy.introModalMain.p2}</Text>
        <Text style={baseStyles.paragraph}>{Copy.introModalMain.p3}</Text>
      </View>
    </View>
    <View style={styles.footer}>
      <Button style={styles.cancelButton} small={IsSmallScreen} transparent onPress={onCancel}>
        <Text style={styles.buttonText}>{Copy.introModalNo}</Text>
      </Button>
      <Button style={styles.confirmButton} small={IsSmallScreen} primary onPress={onConfirm}>
        <Text style={styles.buttonText}>{Copy.introModalYes}</Text>
      </Button>
    </View>
  </Modal>
);

IntroModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default IntroModal;
