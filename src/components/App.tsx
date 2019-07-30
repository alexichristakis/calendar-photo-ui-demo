import React, { Component } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import Interactable, { IInteractableView, IInteractable } from "react-native-interactable";

import { ReduxState } from "state";
import { SCREEN_WIDTH, SCREEN_HEIGHT, NAVIGATOR_SNAP_POINTS } from "lib/constants";

import Profile from "./profile";
import Feed from "./feed";
import Settings from "./settings";
import Transitioner from "./Transitioner";

interface Props {}
class App extends Component<Props> {
  // @ts-ignore
  navigator: Interactable.View | null = null;

  navigatorPosition = new Animated.Value(NAVIGATOR_SNAP_POINTS[2].x);

  render() {
    return (
      <>
        <Interactable.View
          ref={view => (this.navigator = view)}
          horizontalOnly
          animatedNativeDriver
          initialPosition={NAVIGATOR_SNAP_POINTS[2]}
          snapPoints={NAVIGATOR_SNAP_POINTS}
          style={styles.interactable}
          animatedValueX={this.navigatorPosition}
        >
          <Settings />
          <Profile xOffset={this.navigatorPosition} />
          <Feed xOffset={this.navigatorPosition} />
        </Interactable.View>
        <Transitioner />
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

const mapStateToProps = (state: ReduxState) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
