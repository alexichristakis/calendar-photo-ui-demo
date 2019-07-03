import React, { Component } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Interactable from "react-native-interactable";

import { ReduxStateType } from "state";
import configureStore from "state/store";
import { selectFocused } from "state/selectors";
import { SCREEN_WIDTH, SCREEN_HEIGHT, NAVIGATOR_SNAP_POINTS } from "lib/constants";

import Profile from "./profile";
import Feed from "./feed";
import Settings from "./settings";

const { store, persistor } = configureStore();

interface Props {}
class App extends Component<Props> {
  navigatorPosition = new Animated.Value(NAVIGATOR_SNAP_POINTS[2].x);

  render() {
    const { focused } = this.props;
    const { pageX, pageY } = focused;
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
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
            <Transitioner start={{ pageX, pageY }}>
              <ProfileImage {...focused} width={SCREEN_WIDTH - 20} height={SCREEN_WIDTH - 20} />
            </Transitioner>
          </Interactable.View>
        </PersistGate>
      </Provider>
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

const mapStateToProps = (state: ReduxStateType) => ({
  focused: selectFocused(state)
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
