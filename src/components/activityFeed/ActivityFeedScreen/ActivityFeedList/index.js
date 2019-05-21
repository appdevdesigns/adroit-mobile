import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { FlatList, View } from 'react-native';
import ActivityImagesStore from 'src/store/ActivityImagesStore';
import { CopilotView, CopilotStepPhotoList } from 'src/util/copilot';
import Copy from 'src/assets/Copy';
import NonIdealState from 'src/components/common/NonIdealState';
import styles from './style';
import ActivityFeedPlaceholder from './Placeholder';
import ActivityFeedListItem from './ActivityFeedListItem';

@inject('activityImages')
@observer
class ActivityFeedList extends React.Component {
  render() {
    const {
      onEditImage,
      activityImages: { isInitialized, myActivityImages, fetchCount, getMyActivityImages },
    } = this.props;
    if (!isInitialized || !myActivityImages) {
      return <ActivityFeedPlaceholder />;
    }
    return (
      <View style={styles.content}>
        <CopilotStepPhotoList>
          <CopilotView>
            <FlatList
              keyExtractor={item => String(item.id)}
              refreshing={fetchCount > 0}
              onRefresh={getMyActivityImages}
              ListEmptyComponent={
                <NonIdealState
                  title={Copy.nonIdealState.emptyActivityList.title}
                  message={Copy.nonIdealState.emptyActivityList.message}
                />
              }
              data={myActivityImages}
              renderItem={({ item }) => (
                <ActivityFeedListItem
                  key={item.id}
                  item={item}
                  onPress={() => {
                    onEditImage(item);
                  }}
                />
              )}
            />
          </CopilotView>
        </CopilotStepPhotoList>
      </View>
    );
  }
}

ActivityFeedList.propTypes = {
  onEditImage: PropTypes.func.isRequired,
};

ActivityFeedList.wrappedComponent.propTypes = {
  activityImages: PropTypes.instanceOf(ActivityImagesStore).isRequired,
};

export default ActivityFeedList;
