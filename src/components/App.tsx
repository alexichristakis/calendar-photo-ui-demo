import React, { Component } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import Interactable from "react-native-interactable";

import { ReduxState } from "state";
import { Focused } from "state/app";
import { selectFocused } from "state/selectors";
import { SCREEN_WIDTH, SCREEN_HEIGHT, NAVIGATOR_SNAP_POINTS } from "lib/constants";

import Profile from "./profile";
import Feed from "./feed";
import Settings from "./settings";
import Transitioner from "./Transitioner";

interface Props {
  focused: Focused;
}
class App extends Component<Props> {
  navigatorPosition = new Animated.Value(NAVIGATOR_SNAP_POINTS[2].x);

  render() {
    const { focused } = this.props;
    const { visible, startX, startY } = focused;

    const FocusedElement = (
      <View
        style={{
          backgroundColor: focused.image,
          width: SCREEN_WIDTH - 10,
          height: SCREEN_WIDTH - 10
        }}
      />
    );

    return (
      <>
        <Interactable.View
          horizontalOnly
          animatedNativeDriver
          initialPosition={NAVIGATOR_SNAP_POINTS[2]}
          snapPoints={NAVIGATOR_SNAP_POINTS}
          style={styles.interactable}
          animatedValueX={this.navigatorPosition}
        >
          <Settings />
          <Profile xOffset={this.navigatorPosition} />
          <Feed />
        </Interactable.View>
        <Transitioner visible={visible} x={startX} y={startY} element={FocusedElement} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  interactable: {
    flexDirection: "row",
    width: 3 * SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  }
});

const mapStateToProps = (state: ReduxState) => ({
  focused: selectFocused(state)
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
