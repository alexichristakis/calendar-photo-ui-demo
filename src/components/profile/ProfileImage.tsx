import React, { PureComponent, Ref } from "react";
import { Animated, View, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import { ReduxStateType } from "state";
import { setFocus } from "state/app";

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
    const { color, setFocus } = this.props;

    if (this.item)
      this.item.measure((x, y, width, height, pageX, pageY) => {
        setFocus({ image: color, startX: pageX, startY: pageY, visible: true });
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

const mapStateToProps = (state: ReduxStateType) => ({});

const mapDispatchToProps = {
  setFocus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileImage);
