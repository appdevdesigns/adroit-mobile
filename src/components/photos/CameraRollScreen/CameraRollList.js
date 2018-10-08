import React, { Component } from 'react';
import { FlatList, TouchableOpacity, Image, CameraRoll, View } from 'react-native';
import Lightbox from 'react-native-lightbox';
import { Spinner, Text, Icon, Button } from 'native-base';
import { NavigationPropTypes } from 'src/util/PropTypes';
import AppScreen from 'src/components/app/AppScreen';
import styles, { numColumns } from './style';

class CameraRollList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: undefined,
    };
  }

  componentWillMount() {
    this.loadPhotos();
  }

  loadPhotos = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then(r => {
        this.setState({ photos: r.edges });
      })
      .catch(err => {
        console.error('Could not load photos', err);
      });
  };

  keyExtractor = item => item.node.image.uri;

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
              this.props.navigation.navigate(AppScreen.AddPhoto, { image: item.node.image });
            }}
          >
            <Text>Use this photo</Text>
          </Button>
        </View>
      )}
    >
      <Image style={styles.image} source={{ uri: item.node.image.uri }} resizeMode="cover" />
    </Lightbox>
  );

  render() {
    const { photos } = this.state;
    if (!photos) {
      return <Spinner style={styles.spinner} />;
    }
    return photos.length ? (
      <FlatList
        data={photos}
        numColumns={numColumns}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderRowItem}
        style={styles.list}
      />
    ) : (
      <Text style={styles.empty}>Camera Roll is empty</Text>
    );
  }
}

CameraRollList.propTypes = {
  navigation: NavigationPropTypes.isRequired,
};

export default CameraRollList;
