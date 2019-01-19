import React, { Component } from 'react';
import Placeholder from 'rn-placeholder';
import { FlatList, TouchableOpacity, Image, CameraRoll, View } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import ImageView from 'react-native-image-view';
import { Spinner, Text, Button, Icon } from 'native-base';
import Copy from 'src/assets/Copy';
import { NavigationPropTypes } from 'src/util/PropTypes';
import Monitoring, { Event } from 'src/util/Monitoring';
import Constants from 'src/util/Constants';
import NonIdealState from 'src/components/common/NonIdealState';
import AppScreen from 'src/components/app/AppScreen';
import styles, { numColumns, equalWidth } from './style';

const PAGE_SIZE = numColumns * 6;

const placeholderData = [...Array(numColumns * 10).keys()].map(i => ({ uri: String(i) }));

class CameraRollList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: undefined,
      hasNextPage: false,
      endCursor: undefined,
      previewImage: null,
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
    this.props.navigation.replace(AppScreen.Camera);
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
    this.setState({ previewImage: null });
  };

  openPreview = image => {
    this.setState({ previewImage: image });
  };

  keyExtractor = image => image.uri;

  renderRowItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        this.openPreview(item);
      }}
    >
      <Image style={styles.image} source={{ uri: item.uri }} resizeMode="cover" />
    </TouchableOpacity>
  );

  renderRowItemQuick = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        this.props.navigation.navigate(AppScreen.AddPhoto, { image: item });
      }}
    >
      <Image style={styles.image} source={{ uri: item.uri }} resizeMode="cover" />
    </TouchableOpacity>
  );

  renderPlaceholderRowItem = () => (
    <View style={styles.placeholderContainer}>
      <Placeholder.Media size={equalWidth} style={styles.image} animate="fade" />
    </View>
  );

  render() {
    const { photos, hasNextPage, previewImage } = this.state;
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
    return photos.length ? (
      <React.Fragment>
        <FlatList
          data={photos}
          numColumns={numColumns}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderRowItem}
          ListFooterComponent={<View style={styles.footerContainer}>{hasNextPage && <Spinner size="small" />}</View>}
          style={styles.list}
          onEndReachedThreshold={0.5}
          onEndReached={this.loadMoreImages}
        />
        <ImageView
          animationType="fade"
          images={[{ source: previewImage }]}
          imageIndex={0}
          isVisible={!!previewImage}
          controls={{close: null}}
          onClose={this.closePreview}
          renderFooter={item => (
            <View style={styles.previewFooter}>
              <Button transparent onPress={this.closePreview}>
                <Icon type="FontAwesome" name="times" style={styles.closePreview} />
              </Button>
              <Button
                bordered
                light
                onPress={() => {
                  ImageResizer.createResizedImage(
                    item.source.uri,
                    Constants.imageUploadMaxWidth,
                    Constants.imageUploadMaxHeight,
                    'JPEG',
                    100,
                    0
                  )
                    .then(resized => {
                      this.closePreview();
                      Monitoring.event(Event.CameraRollImageSelected);
                      this.props.navigation.navigate(AppScreen.AddPhoto, { image: resized });
                    })
                    .catch(err => {
                      Monitoring.exception(err, { problem: 'Could not resize photo' });
                    });
                }}
              >
                <Text>{Copy.useThisPhotoButtonText}</Text>
              </Button>
            </View>
          )}
        />
      </React.Fragment>
    ) : (
      <NonIdealState
        title={Copy.nonIdealState.cameraRollEmpty.title}
        message={Copy.nonIdealState.cameraRollEmpty.message}
      >
        <Button style={styles.emptyButton} primary onPress={this.goToCamera}>
          <Text>{Copy.takeAPhotoCta}</Text>
        </Button>
      </NonIdealState>
    );
  }
}

CameraRollList.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

export default CameraRollList;
