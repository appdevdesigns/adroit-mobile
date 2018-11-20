import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import { View, ImageBackground } from 'react-native';
import { Text, Icon } from 'native-base';
import Copy from 'src/assets/Copy';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import {
  CopilotView,
  CopilotStepApprovedSummary,
  CopilotStepNewSummary,
  CopilotStepDaysLeft,
  CopilotStepOverallState,
  CopilotStepProgressBars,
} from 'src/util/copilot';
import styles, { Gradients } from './style';

const imgDaysElapsed = require('src/assets/img/bg_bar_days_elapsed.png');
const imgDaysBackground = require('src/assets/img/bg_bar_days_right.png');
const imgApproved = require('src/assets/img/bg_bar_approved.png');
const imgNew = require('src/assets/img/bg_bar_new.png');

@inject('activityImages')
@observer
class ReportingPeriodOverview extends React.Component {
  render() {
    const {
      activityImages: { currentReportingPeriod, totalReadyOrApproved, totalNew },
    } = this.props;
    const status = currentReportingPeriod.getStatus(totalReadyOrApproved);
    return (
      <View style={styles.wrapper}>
        <View style={styles.top}>
          <CopilotStepApprovedSummary>
            <CopilotView style={[styles.topItem, styles.topItemBordered]}>
              <LinearGradient colors={Gradients.approved} style={styles.topIndicator} />
              <Text style={styles.topText}>{Copy.approvedSummary(totalReadyOrApproved)}</Text>
            </CopilotView>
          </CopilotStepApprovedSummary>
          <CopilotStepNewSummary>
            <CopilotView style={[styles.topItem, styles.topItemBordered]}>
              <LinearGradient colors={Gradients.new} style={styles.topIndicator} />
              <Text style={styles.topText}>{Copy.newSummary(totalNew)}</Text>
            </CopilotView>
          </CopilotStepNewSummary>
          <CopilotStepDaysLeft>
            <CopilotView>
              <ImageBackground source={imgDaysBackground} style={[styles.topItem, styles.topItemBordered]}>
                <Icon style={styles.topIcon} type="FontAwesome" name="clock-o" />
                <Text style={styles.topText}>{Copy.daysLeft(currentReportingPeriod.daysLeft)}</Text>
              </ImageBackground>
            </CopilotView>
          </CopilotStepDaysLeft>
          <CopilotStepOverallState>
            <CopilotView style={[styles.topItem, styles.status, { backgroundColor: status.color }]}>
              <FontAwesome5 style={styles.topIcon} name={status.icon} light />
              <Text style={styles.topText}>{status.label}</Text>
            </CopilotView>
          </CopilotStepOverallState>
        </View>
        <CopilotStepProgressBars>
          <CopilotView style={styles.progressWrapper}>
            <ImageBackground source={imgDaysBackground} resizeMode="cover" style={styles.progressWrapper}>
              <ImageBackground
                source={imgDaysElapsed}
                resizeMode="cover"
                style={[
                  styles.progress,
                  styles.progressDate,
                  { width: `${currentReportingPeriod.percentageComplete}%` },
                ]}
              />
              <ImageBackground
                source={imgNew}
                resizeMode="cover"
                style={[
                  styles.progress,
                  styles.imagesProgress,
                  styles.newImages,
                  { width: `${((totalReadyOrApproved + totalNew) * 100) / currentReportingPeriod.targetImageCount}%` },
                ]}
              />
              <ImageBackground
                source={imgApproved}
                resizeMode="cover"
                style={[
                  styles.progress,
                  styles.imagesProgress,
                  styles.approvedImages,
                  { width: `${(totalReadyOrApproved * 100) / currentReportingPeriod.targetImageCount}%` },
                ]}
              />
            </ImageBackground>
          </CopilotView>
        </CopilotStepProgressBars>
      </View>
    );
  }
}

ReportingPeriodOverview.wrappedComponent.propTypes = {
  activityImages: PropTypes.instanceOf(ActivityImagesStore).isRequired,
};

export default ReportingPeriodOverview;
