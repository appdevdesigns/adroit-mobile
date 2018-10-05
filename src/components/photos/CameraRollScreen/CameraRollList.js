import React, { Component } from 'react';
import { FlatList, TouchableOpacity, Image, CameraRoll } from 'react-native';
import { Spinner, Text } from 'native-base';
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

  renderRowItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('Pressed image in camera roll');
          this.props.navigation.navigate(AppScreen.AddPhoto, { image: item.node.image });
        }}
      >
        <Image style={styles.image} source={{ uri: item.node.image.uri }} resizeMode="cover" />
      </TouchableOpacity>
    );
  };

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
