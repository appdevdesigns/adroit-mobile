import React from 'react';
import { View } from 'react-native';
import { walkthroughable, CopilotStep } from '@okgrow/react-native-copilot';
import Copy from 'src/assets/Copy';

export const CopilotView = walkthroughable(View);

export const CopilotStepApprovedSummary = ({ children }) => (
  <CopilotStep name="approvedSummary" text={Copy.copilot.approvedSummary} order={1}>
    {children}
  </CopilotStep>
);

export const CopilotStepNewSummary = ({ children }) => (
  <CopilotStep name="newSummary" text={Copy.copilot.newSummary} order={2}>
    {children}
  </CopilotStep>
);

export const CopilotStepDaysLeft = ({ children }) => (
  <CopilotStep name="daysLeft" text={Copy.copilot.daysLeft} order={3}>
    {children}
  </CopilotStep>
);

export const CopilotStepOverallState = ({ children }) => (
  <CopilotStep name="overallState" text={Copy.copilot.overallState} order={4}>
    {children}
  </CopilotStep>
);

export const CopilotStepProgressBars = ({ children }) => (
  <CopilotStep name="progressBars" text={Copy.copilot.progressBars} order={5}>
    {children}
  </CopilotStep>
);

export const CopilotStepPhotoList = ({ children }) => (
  <CopilotStep name="photoList" text={Copy.copilot.photoList} order={6}>
    {children}
  </CopilotStep>
);

export const CopilotStepAddPhoto = ({ children }) => (
  <CopilotStep name="addPhoto" text={Copy.copilot.addPhoto} order={7}>
    {children}
  </CopilotStep>
);
