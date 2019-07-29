import React, { Component } from "react";
import { View, TouchableOpacity, ViewStyle, findNodeHandle } from "react-native";
import { connect } from "react-redux";

import { ReduxState } from "state";
import { setFocus, Focused } from "state/app";
import { selectFocused } from "state/selectors";

export type Image = {
  id: string;
  title: string;
  color: string;
};

interface ProfileImageProps extends Image {
  style?: ViewStyle;
  width?: number;
  height?: number;
}

interface ProfileImageReduxProps {
  setFocus: (focused: Focused) => void;
  isFocused: boolean;
}

class ProfileImage extends Component<ProfileImageProps & ProfileImageReduxProps> {
  item: TouchableOpacity | null = null;

  shouldComponentUpdate(nextProps: ProfileImageProps & ProfileImageReduxProps) {
    if (nextProps.isFocused !== this.props.isFocused) {
      return true;
    } else {
      return false;
    }
  }

  handleOnPress = () => {
    const { id, color, setFocus } = this.props;

    if (this.item)
      this.item.measureInWindow((startX, startY) => {
        setFocus({ id, startX, startY, image: color, visible: true });
      });
  };

  render() {
    const { isFocused, color, style = {}, width = 50, height = 50 } = this.props;
    if (!isFocused)
      return (
        <TouchableOpacity
          style={style}
          ref={view => (this.item = view)}
          onPress={this.handleOnPress}
        >
          <View style={{ width, height, backgroundColor: color }} />
        </TouchableOpacity>
      );
    else return <View style={[style, { width, height }]} />;
  }
}

const mapStateToProps = (state: ReduxState, props: ProfileImageProps) => ({
  isFocused: selectFocused(state).id === props.id
});

const mapDispatchToProps = {
  setFocus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileImage);
