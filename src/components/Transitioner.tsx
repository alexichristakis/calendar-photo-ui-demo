import React, { PureComponent } from "react";
import { Animated, Easing, View, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";

import { ReduxStateType } from "state";
import { focusOff } from "state/app";
import { Colors } from "lib/styles";
import { SCREEN_HEIGHT, SCREEN_WIDTH, SETTINGS_WIDTH } from "lib/constants";

interface TransitionerProps {
  x: number;
  y: number;
  visible: boolean;
  element: React.ReactNode;
  focusOff: () => {};
}

const ANIMATION_DURATION = 150;

class Transitioner extends PureComponent<TransitionerProps> {
  state = {
    transitioning: false,
    open: false
  };

  transitionAmount = new Animated.Value(0);

  componentDidUpdate(prevProps, prevState) {
    const { visible } = this.props;
    if (visible) {
      this.open();
    }
  }

  open = () => {
    Animated.timing(this.transitionAmount, {
      useNativeDriver: true,
      toValue: 1,
      duration: ANIMATION_DURATION,
      easing: Easing.ease
    }).start();
  };

  close = () => {
    const { focusOff } = this.props;

    Animated.timing(this.transitionAmount, {
      useNativeDriver: true,
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.ease)
    }).start(() => focusOff());
  };

  render() {
    const { visible, element, x, y } = this.props;

    const animatedStyle = {
      transform: [
        {
          scale: this.transitionAmount.interpolate({
            inputRange: [0, 1],
            outputRange: [50 / (SCREEN_WIDTH - 20), 1],
            extrapolate: "clamp"
          })
        }
      ]
    };

    const animatedTranslate = {
      transform: [
        {
          translateY: this.transitionAmount.interpolate({
            inputRange: [0, 1],
            outputRange: [-1 * (SCREEN_HEIGHT / 2) + y + 30, 0]
          })
        },
        {
          translateX: this.transitionAmount.interpolate({
            inputRange: [0, 1],
            outputRange: [x - SCREEN_WIDTH / 2 + 30, 0]
          })
        }
      ]
    };

    const animatedBackground = {
      opacity: this.transitionAmount.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.8]
      })
    };

    if (visible)
      return (
        <View style={styles.container} pointerEvents={"box-none"}>
          <Animated.View style={[animatedBackground, styles.background]}>
            <TouchableOpacity style={styles.flex} onPress={this.close} />
          </Animated.View>
          <Animated.View style={animatedTranslate}>
            <Animated.View style={animatedStyle}>{element}</Animated.View>
          </Animated.View>
        </View>
      );
    else return null;
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    position: "absolute",
    left: 0,
    width: SCREEN_WIDTH,
    bottom: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.darkGray
  }
});

const mapStateToProps = (state: ReduxStateType) => ({});

const mapDispatchToProps = { focusOff };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transitioner);
