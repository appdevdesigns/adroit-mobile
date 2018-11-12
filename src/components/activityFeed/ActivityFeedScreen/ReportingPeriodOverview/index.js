import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { View, ImageBackground } from 'react-native';
import { Text, Icon } from 'native-base';
import styles from './style';

const imgDaysElapsed = require('src/assets/img/bg_bar_days_elapsed.png');
const imgDaysBackground = require('src/assets/img/bg_bar_days_right.png');
const imgApproved = require('src/assets/img/bg_bar_approved.png');
const imgNew = require('src/assets/img/bg_bar_new.png');

const ReportingPeriodOverview = ({ reportingPeriod, totalApproved, totalNew }) => {
  const status = reportingPeriod.getStatus(totalApproved);
  return (
    <View style={styles.wrapper}>
      <View style={styles.top}>
        <View style={[styles.topItem, styles.topItemBordered]}>
          <LinearGradient colors={['#23ad9d', '#1cd7cf']} style={styles.topIndicator} />
          <Text style={styles.topText}>{totalApproved} approved</Text>
        </View>
        <View style={[styles.topItem, styles.topItemBordered]}>
          <LinearGradient colors={['#393939', '#535353']} style={styles.topIndicator} />
          <Text style={styles.topText}>{totalNew} new</Text>
        </View>
        <View style={[styles.topItem, styles.topItemBordered, styles.timeRemaining]}>
          <Icon style={styles.topIcon} type="FontAwesome" name="clock-o" />
          <Text style={styles.topText}>{reportingPeriod.daysLeft} days left</Text>
        </View>
        <View style={[styles.topItem, styles.status, { backgroundColor: status.color }]}>
          <FontAwesome5 style={styles.topIcon} name={status.icon} light />
          <Text style={styles.topText}>{status.label}</Text>
        </View>
      </View>
      <ImageBackground source={imgDaysBackground} resizeMode="cover" style={styles.progressWrapper}>
        <ImageBackground
          source={imgDaysElapsed}
          resizeMode="cover"
          style={[styles.progress, styles.progressDate, { width: `${reportingPeriod.percentageComplete}%` }]}
        />
        <ImageBackground
          source={imgNew}
          resizeMode="cover"
          style={[
            styles.progress,
            styles.imagesProgress,
            styles.newImages,
            { width: `${((totalApproved + totalNew) * 100) / reportingPeriod.targetImageCount}%` },
          ]}
        />
        <ImageBackground
          source={imgApproved}
          resizeMode="cover"
          style={[
            styles.progress,
            styles.imagesProgress,
            styles.approvedImages,
            { width: `${(totalApproved * 100) / reportingPeriod.targetImageCount}%` },
          ]}
        />
      </ImageBackground>
    </View>
  );
};

ReportingPeriodOverview.propTypes = {
  reportingPeriod: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  }).isRequired,
  totalApproved: PropTypes.number,
  totalNew: PropTypes.number,
};

ReportingPeriodOverview.defaultProps = {
  totalApproved: 0,
  totalNew: 0,
};

export default ReportingPeriodOverview;
