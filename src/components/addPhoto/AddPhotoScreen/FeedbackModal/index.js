import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, Button, Icon } from 'native-base';
import Copy from 'src/assets/Copy';
import baseStyles from 'src/assets/style';
import Modal from 'src/components/common/Modal';
import styles from './style';

const fields = ['Photo', 'Caption', 'Date', 'Location', 'Team', 'Activity', 'Tagged People'];

const FeedbackModal = ({ feedback, ...restProps }) => (
  <Modal {...restProps} animationType="fade" transparent header={Copy.photoFeedback.title}>
    {!!feedback && (
      <View>
        <Text style={styles.withBottomMargin}>
          <Text style={baseStyles.bold}>{feedback.deniedBy.display_name}</Text>
          {Copy.photoFeedback.intro}
        </Text>
        {!!feedback.customMessage && (
          <Text style={[styles.withBottomMargin, styles.customMessage]}>&quot;{feedback.customMessage}&quot;</Text>
        )}
        <Text style={styles.withBottomMargin}>{Copy.photoFeedback.toFix}</Text>
        {fields
          .filter(f => feedback[`fix${f.replace(' ', '')}`])
          .map(f => (
            <View key={f} style={styles.toFixItem}>
              <Icon style={[styles.toFixText, styles.toFixIcon]} type="FontAwesome" name="exclamation-circle" />
              <Text style={styles.toFixText}>{f}</Text>
            </View>
          ))}
        <Button style={styles.confirmButton} iconLeft small primary onPress={restProps.onRequestClose}>
          <Icon type="FontAwesome" name="check-circle" />
          <Text style={styles.buttonText}>{Copy.photoFeedback.button}</Text>
        </Button>
      </View>
    )}
  </Modal>
);

FeedbackModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  feedback: PropTypes.shape({
    fixPhoto: PropTypes.bool,
    fixCaption: PropTypes.bool,
    fixLocation: PropTypes.bool,
    fixDate: PropTypes.bool,
    fixTeam: PropTypes.bool,
    fixActivity: PropTypes.bool,
    fixTaggedPeople: PropTypes.bool,
    customMessage: PropTypes.string,
    deniedBy: PropTypes.shape({
      IDPerson: PropTypes.number,
      display_name: PropTypes.string,
    }),
  }),
};

FeedbackModal.defaultProps = {
  feedback: undefined,
};

export default FeedbackModal;
