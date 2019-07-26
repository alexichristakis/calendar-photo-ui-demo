import React, { PureComponent, Ref } from "react";
import { View, TouchableOpacity, ViewStyle, findNodeHandle } from "react-native";
import { connect } from "react-redux";

import { ReduxState } from "state";
import { setFocus, Focused } from "state/app";
import { selectFocused } from "state/selectors";

interface ProfileImageProps {
  id: string;
  title: string;
  style?: ViewStyle;
  color: string;
  width: number;
  height: number;
}

interface ProfileImageReduxProps {
  setFocus: (focused: Focused) => void;
  isFocused: boolean;
}

class ProfileImage extends PureComponent<ProfileImageProps & ProfileImageReduxProps> {
  item: TouchableOpacity | null = null;

  handleOnPress = () => {
    const { id, color, setFocus } = this.props;

    if (this.item)
      this.item.measureInWindow((x, y) => {
        setFocus({ id, image: color, startX: x, startY: y, visible: true });
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
