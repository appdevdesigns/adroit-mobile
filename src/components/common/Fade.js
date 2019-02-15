import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';

// Ref: https://goshakkk.name/react-native-animated-appearance-disappearance/

class Fade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  componentWillMount() {
    this._visibility = new Animated.Value(this.props.visible ? 1 : 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({ visible: true });
    }
    Animated.timing(this._visibility, {
      toValue: nextProps.visible ? 1 : 0,
      duration: nextProps.duration,
    }).start(() => {
      this.setState({ visible: nextProps.visible });
    });
  }

  render() {
    const { visible, style, keepInDom, children, ...rest } = this.props;

    const containerStyle = {
      opacity: this._visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          scale: this._visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [1.1, 1],
          }),
        },
      ],
    };

    const combinedStyle = [containerStyle, style];
    return (
      <Animated.View style={this.state.visible ? combinedStyle : containerStyle} {...rest}>
        {this.state.visible || keepInDom ? children : null}
      </Animated.View>
    );
  }
}

Fade.propTypes = {
  visible: PropTypes.bool,
  keepInDom: PropTypes.bool,
  duration: PropTypes.number,
};

Fade.defaultProps = {
  visible: true,
  keepInDom: true,
  duration: 300,
};

export default Fade;
