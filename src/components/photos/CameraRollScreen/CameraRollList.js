import React, { Component } from 'react';
import Placeholder from 'rn-placeholder';
import { FlatList, CameraRoll, View } from 'react-native';
import { Spinner } from 'native-base';
import { NavigationPropTypes } from 'src/util/PropTypes';
import Monitoring from 'src/util/Monitoring';
import AppScreen from 'src/components/app/AppScreen';
import CameraRollListItem, { CAMERA_ITEM } from './CameraRollListItem';
import ImagePreview from './ImagePreview';
import styles, { imageStyle, numColumns, equalWidth } from './style';

const PAGE_SIZE = numColumns * 6;

const placeholderData = [...Array(numColumns * 10).keys()].map(i => ({ uri: String(i) }));

class CameraRollList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: undefined,
      hasNextPage: false,
      endCursor: undefined,
      previewImageIndex: null,
    };
  }

  componentWillMount() {
    this.loadMoreImages();
  }

  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  goToCamera = () => {
    this.props.navigation.navigate(AppScreen.Camera);
  };

  loadMoreImages = () => {
    const { endCursor, hasNextPage, photos } = this.state;

    if (!hasNextPage && photos) {
      return;
    }

    CameraRoll.getPhotos({
      first: PAGE_SIZE,
      after: endCursor,
      assetType: 'Photos',
    })
      .then(data => {
        const images = data.edges.map(asset => asset.node.image);
        if (this._ismounted) {
          this.setState({
            photos: (photos || []).concat(images),
            endCursor: data.page_info.end_cursor,
            hasNextPage: data.page_info.has_next_page,
          });
        }
      })
      .catch(err => {
        Monitoring.exception(err, { problem: 'Could not load photos', after: endCursor });
      });
  };

  closePreview = () => {
    this.setState({ previewImageIndex: null });
  };

  openPreview = index => {
    this.setState({ previewImageIndex: index });
  };

  keyExtractor = image => image.uri;

  renderPlaceholderRowItem = () => (
    <View style={styles.placeholderContainer}>
      <Placeholder.Media size={equalWidth} style={imageStyle} animate="fade" />
    </View>
  );

  render() {
    const { navigation } = this.props;
    const { photos, hasNextPage, previewImageIndex } = this.state;
    const photoItems = [CAMERA_ITEM].concat(photos || []);
    if (!photos) {
      return (
        <FlatList
          data={placeholderData}
          numColumns={numColumns}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderPlaceholderRowItem}
          style={styles.list}
        />
      );
    }
    return (
      <React.Fragment>
        <FlatList
          data={photoItems}
          numColumns={numColumns}
          keyExtractor={this.keyExtractor}
          renderItem={props => <CameraRollListItem {...props} navigation={navigation} openPreview={this.openPreview} />}
          ListFooterComponent={<View style={styles.footerContainer}>{hasNextPage && <Spinner size="small" />}</View>}
          style={styles.list}
          onEndReachedThreshold={0.5}
          onEndReached={this.loadMoreImages}
        />
        <ImagePreview
          photoItems={photoItems}
          previewImageIndex={previewImageIndex}
          closePreview={this.closePreview}
          navigation={navigation}
        />
      </React.Fragment>
    );
  }
}

CameraRollList.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

export default CameraRollList;
