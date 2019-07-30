import React, { Component } from "react";
import { Animated, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { connect } from "react-redux";
import Interactable, { IInteractableView, IInteractable } from "react-native-interactable";
import { BlurView } from "@react-native-community/blur";

import { ReduxState } from "state";
import { SCREEN_WIDTH, SCREEN_HEIGHT, NAVIGATOR_SNAP_POINTS, SETTINGS_WIDTH } from "lib/constants";

import Profile from "./profile";
import Feed from "./feed";
import Settings from "./settings";
import Transitioner from "./Transitioner";

enum Pages {
  settings,
  profile,
  feed
}

interface Props {}
class App extends Component<Props> {
  state = {
    page: Pages.feed
  };

  // @ts-ignore
  navigator: Interactable.View | null = null;

  navigatorPosition = new Animated.Value(NAVIGATOR_SNAP_POINTS[2].x);

  handleOnSnapStart = ({ nativeEvent: { index } }: Interactable.ISnapEvent) => {
    this.setState({ page: index });
  };

  render() {
    const { page } = this.state;

    const animatedOpacity = {
      opacity: this.navigatorPosition.interpolate({
        inputRange: NAVIGATOR_SNAP_POINTS.map(({ x }) => x).reverse(),
        outputRange: [0, 0, 1]
      })
    };

    return (
      <>
        <Interactable.View
          ref={view => (this.navigator = view)}
          horizontalOnly
          animatedNativeDriver
          initialPosition={NAVIGATOR_SNAP_POINTS[2]}
          snapPoints={NAVIGATOR_SNAP_POINTS}
          onSnapStart={this.handleOnSnapStart}
          style={styles.interactable}
          animatedValueX={this.navigatorPosition}
        >
          <Settings />
          <Profile xOffset={this.navigatorPosition} />
          <Feed xOffset={this.navigatorPosition} />
          <Animated.View
            style={[styles.blur, animatedOpacity]}
            pointerEvents={page === Pages.settings ? "auto" : "none"}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.flex}
              onPress={() => this.navigator.snapTo({ index: 1 })}
            >
              <BlurView blurType={"dark"} style={styles.flex} />
            </TouchableOpacity>
          </Animated.View>
        </Interactable.View>
        <Transitioner />
      </>
    );
  }
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  blur: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    left: SETTINGS_WIDTH
  },
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
