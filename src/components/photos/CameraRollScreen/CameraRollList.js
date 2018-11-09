import React, { Component } from 'react';
import Placeholder from 'rn-placeholder';
import { FlatList, TouchableOpacity, Image, CameraRoll, View } from 'react-native';
import Lightbox from 'react-native-lightbox';
import { Spinner, Text, Icon, Button } from 'native-base';
import { NavigationPropTypes } from 'src/util/PropTypes';
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
        console.error('Could not load photos', err);
      });
  };

  keyExtractor = image => image.uri;

  renderRowItem = ({ item }) => (
    <Lightbox
      activeProps={{ resizeMode: 'contain', style: styles.lightboxImage }}
      renderHeader={close => (
        <View style={styles.lightboxHeader}>
          <Button onPress={close} transparent>
            <Icon type="FontAwesome" name="times" style={styles.closeButton} />
          </Button>
          <Button
            bordered
            light
            onPress={() => {
              close();
              this.props.navigation.navigate(AppScreen.AddPhoto, { image: item });
            }}
          >
            <Text>Use this photo</Text>
          </Button>
        </View>
      )}
    >
      <Image style={styles.image} source={{ uri: item.uri }} resizeMode="cover" />
    </Lightbox>
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
    const { photos, hasNextPage } = this.state;
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
      <FlatList
        data={photos}
        numColumns={numColumns}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderRowItemQuick}
        ListFooterComponent={<View style={styles.footerContainer}>{hasNextPage && <Spinner size="small" />}</View>}
        style={styles.list}
        onEndReachedThreshold={0.5}
        onEndReached={this.loadMoreImages}
      />
    ) : (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Camera Roll is empty</Text>
        <Button style={styles.emptyButton} primary onPress={this.goToCamera}>
          <Text>Take a photo</Text>
        </Button>
      </View>
    );
  }
}

CameraRollList.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

export default CameraRollList;
