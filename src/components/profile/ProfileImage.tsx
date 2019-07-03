import React, { PureComponent, Ref } from "react";
import { Animated, View, Text, TouchableOpacity } from "react-native";

interface ProfileImageProps {
  title: string;
  color: string;
  width: number;
  height: number;
  onPress: ({ pageX, pageY }: { pageX: number; pageY: number }) => {};
}

class ProfileImage extends PureComponent<ProfileImageProps> {
  item: Ref<TouchableOpacity> = React.createRef();

  componentDidUpdate(prevState, prevProps) {}

  handleOnPress = () => {
    const { onPress } = this.props;

    if (this.item)
      this.item.measure((x, y, width, height, pageX, pageY) => {
        onPress({ pageX, pageY });
      });
  };

  render() {
    const { color, width = 50, height = 50 } = this.props;
    return (
      <TouchableOpacity ref={view => (this.item = view)} onPress={this.handleOnPress}>
        <Animated.View style={{ width, height, backgroundColor: color, margin: 5 }} />
      </TouchableOpacity>
    );
  }
}

export default ProfileImage;
