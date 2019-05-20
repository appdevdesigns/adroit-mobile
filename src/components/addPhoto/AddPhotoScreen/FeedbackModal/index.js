import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, Button, Icon } from 'native-base';
import Copy from 'src/assets/Copy';
import baseStyles from 'src/assets/style';
import Modal from 'src/components/common/Modal';
import styles from './style';

const fields = ['Photo', 'Caption', 'Date', 'Location', 'Team', 'Activity', 'Tagged People'];

const FeedbackItem = ({ text }) => (
  <View style={styles.toFixItem}>
    <Text style={styles.toFixText}>&bull;&nbsp;</Text>
    <Text style={styles.toFixText}>{text}</Text>
  </View>
);

const FeedbackModal = ({ feedback, ...restProps }) => (
  <Modal {...restProps} animationType="fade" transparent header={Copy.photoFeedback.title}>
    {!!feedback && (
      <View>
        <Text style={styles.withBottomMargin}>
          {feedback.deniedBy ? (
            <Text style={baseStyles.bold}>{feedback.deniedBy.display_name}</Text>
          ) : (
            <Text>{Copy.photoFeedback.reviewerPlaceholder}</Text>
          )}
          {Copy.photoFeedback.intro}
        </Text>
        {!!feedback.customMessage && <FeedbackItem text={feedback.customMessage} />}
        {!!feedback.fixPhoto && <FeedbackItem text={Copy.photoFeedback.fixPhoto} />}
        {!!feedback.fixCaption && <FeedbackItem text={Copy.photoFeedback.fixCaption} />}
        {!!feedback.fixDate && <FeedbackItem text={Copy.photoFeedback.fixDate} />}
        {!!feedback.fixLocation && <FeedbackItem text={Copy.photoFeedback.fixLocation} />}
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
