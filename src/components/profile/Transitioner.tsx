import React, { PureComponent } from "react";
import { Animated, View, TouchableOpacity, StyleSheet } from "react-native";

import { SCREEN_HEIGHT, SCREEN_WIDTH, SETTINGS_WIDTH } from "lib/constants";

class Transitioner extends PureComponent {
  state = {
    transitioning: false
  };

  transitionAmount = new Animated.Value(0);

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (!prevState.transitioning && nextProps.)
  // }

  componentDidUpdate(prevProps, prevState) {
    const { children } = this.props;
    if (children) {
      this.open();
    }
  }

  open = () => {
    Animated.timing(this.transitionAmount, {
      useNativeDriver: true,
      toValue: 1,
      duration: 200
    }).start();
  };

  close = () => {
    Animated.timing(this.transitionAmount, {
      useNativeDriver: true,
      toValue: 0,
      duration: 200
    }).start();
  };

  render() {
    const {
      children,
      start: { pageX, pageY }
    } = this.props;

    console.log(pageX, pageY, SCREEN_HEIGHT);

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
            outputRange: [-1 * (SCREEN_HEIGHT / 2) + pageY + 25, 0]
          })
        },
        {
          translateX: this.transitionAmount.interpolate({
            inputRange: [0, 1],
            outputRange: [pageX - SCREEN_WIDTH / 2 + 25, 0]
          })
        }
      ]
    };

    return (
      <View style={styles.container} pointerEvents={"none"}>
        <Animated.View>
          <TouchableOpacity onPress={this.close} />
        </Animated.View>
        <Animated.View style={animatedTranslate}>
          <Animated.View style={animatedStyle}>{children}</Animated.View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: SETTINGS_WIDTH,
    width: SCREEN_WIDTH,
    bottom: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Transitioner;
