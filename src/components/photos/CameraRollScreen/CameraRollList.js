import React, { Component } from 'react';
import Placeholder from 'rn-placeholder';
import { FlatList, TouchableOpacity, Image, CameraRoll, View, Modal } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Spinner, Text, Button, Icon, Header, Left, Right } from 'native-base';
import Copy from 'src/assets/Copy';
import baseStyles from 'src/assets/style';
import { NavigationPropTypes } from 'src/util/PropTypes';
import Monitoring, { Event } from 'src/util/Monitoring';
import Constants from 'src/util/Constants';
import AppScreen from 'src/components/app/AppScreen';
import styles, { numColumns, equalWidth } from './style';

const PAGE_SIZE = numColumns * 6;

const CAMERA_ITEM = {
  uri: 'CAMERA',
};

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

  renderRowItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        if (item === CAMERA_ITEM) {
          this.goToCamera();
        } else {
          this.openPreview(index);
        }
      }}
    >
      {item === CAMERA_ITEM ? (
        <View style={[styles.image, styles.iconWrapper]}>
          <Icon type="FontAwesome" name="camera" style={styles.cameraIcon} />
        </View>
      ) : (
        <Image style={styles.image} source={{ uri: item.uri }} resizeMode="cover" />
      )}
    </TouchableOpacity>
  );

  renderPlaceholderRowItem = () => (
    <View style={styles.placeholderContainer}>
      <Placeholder.Media size={equalWidth} style={styles.image} animate="fade" />
    </View>
  );

  render() {
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
          renderItem={this.renderRowItem}
          ListFooterComponent={<View style={styles.footerContainer}>{hasNextPage && <Spinner size="small" />}</View>}
          style={styles.list}
          onEndReachedThreshold={0.5}
          onEndReached={this.loadMoreImages}
        />
        <Modal visible={previewImageIndex !== null} transparent onRequestClose={this.closePreview}>
          <ImageViewer
            imageUrls={[{ props: { source: photoItems[previewImageIndex] } }]}
            index={0}
            saveToLocalByLongPress={false}
            onCancel={this.closePreview}
            enableSwipeDown
            onSwipeDown={this.closePreview}
            renderIndicator={() => null}
            renderHeader={() => (
              <View style={[baseStyles.manualHeader, styles.previewHeader]}>
                <Left>
                  <Button transparent onPress={this.closePreview}>
                    <Icon type="FontAwesome" name="chevron-left" style={styles.closePreview} />
                  </Button>
                </Left>
                <Right>
                  <Button
                    bordered
                    light
                    onPress={() => {
                      ImageResizer.createResizedImage(
                        photoItems[previewImageIndex].uri,
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
                </Right>
              </View>
            )}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

CameraRollList.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

export default CameraRollList;
