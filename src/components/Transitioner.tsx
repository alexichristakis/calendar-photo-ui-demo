import React, { PureComponent } from "react";
import { Animated, Easing, View, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import Interactable from "react-native-interactable";

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

const ANIMATION_DURATION = 1500;

class Transitioner extends PureComponent<TransitionerProps> {
  transitionAmount = new Animated.Value(0);
  reactiveX = new Animated.Value(0);
  reactiveY = new Animated.Value(0);

  componentDidMount() {
    this.reactiveX.addListener(this.handleInteractablePan);
    // this.reactiveY.addListener(this.handleInteractablePan);
  }

  componentWillUnmount() {
    // this.reactiveX.removeAllListeners();
    // this.reactiveY.removeAllListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    const { visible } = this.props;
    if (visible) {
      this.open();
    }
  }

  handleInteractablePan = ({ value }: { value: number }) => {
    console.log(value);
    if (Math.abs(value) > 100) {
      this.close();
    }
  };

  open = () => {
    // Animated.timing(this.transitionAmount, {
    //   useNativeDriver: true,
    //   toValue: 1,
    //   duration: ANIMATION_DURATION,
    //   easing: Easing.ease
    // }).start();
    this.interactable.snapTo({ index: 1 });
  };

  close = () => {
    const { focusOff } = this.props;
    this.interactable.snapTo({ index: 0 });
    // this.reactiveX.setValue(0);
    // this.reactiveY.setValue(0);
    // Animated.timing(this.transitionAmount, {
    //   useNativeDriver: true,
    //   toValue: 0,
    //   duration: ANIMATION_DURATION,
    //   easing: Easing.out(Easing.ease)
    // }).start(() => focusOff());
  };

  handleOnSnap = ({ nativeEvent: { index } }: Interactable.ISnapEvent) => {
    const { focusOff } = this.props;
    if (!index) {
      focusOff();
    }
  };

  render() {
    const { visible, element, x, y } = this.props;

    const animatedScale = {
      transform: [
        {
          scale: Animated.add(
            Animated.divide(this.reactiveX, SCREEN_WIDTH),
            Animated.divide(this.reactiveY, SCREEN_HEIGHT)
          ).interpolate({
            inputRange: [0, 1, 2],
            outputRange: [50 / (SCREEN_WIDTH - 20), 1, 50 / (SCREEN_WIDTH - 20)],
            extrapolate: "clamp"
          })
          // scale: Animated.add(
          //   this.transitionAmount,
          //   Animated.add(
          //     Animated.divide(this.reactiveX, SCREEN_WIDTH),
          //     Animated.divide(this.reactiveY, SCREEN_HEIGHT)
          //   )
          // ).interpolate({
          //   inputRange: [0, 1, 2],
          //   outputRange: [50 / (SCREEN_WIDTH - 20), 1, 50 / (SCREEN_WIDTH - 20)],
          //   extrapolate: "clamp"
          // })
        }
      ]
    };

    const animatedTranslate = {
      transform: [
        {
          translateY: Animated.add(
            this.transitionAmount,
            Animated.divide(this.reactiveY, SCREEN_HEIGHT)
          ).interpolate({
            inputRange: [0, 1],
            outputRange: [-1 * (SCREEN_HEIGHT / 2) + y + 30, 0]
          })
        },
        {
          translateX: Animated.add(
            this.transitionAmount,
            Animated.divide(this.reactiveX, SCREEN_WIDTH)
          ).interpolate({
            inputRange: [0, 1],
            outputRange: [x - SCREEN_WIDTH / 2 + 30, 0]
          })
        }
      ]
    };

    const animatedBackground = {
      opacity: Animated.add(
        this.transitionAmount,
        Animated.add(
          Animated.divide(this.reactiveX, SCREEN_WIDTH),
          Animated.divide(this.reactiveY, SCREEN_HEIGHT)
        )
      ).interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 0.8, 0]
      })
    };

    const reactive = {
      // transform: [
      //   {
      //     translateX: this.reactiveX.interpolate({
      //       inputRange: [-100, 0, 100],
      //       outputRange: [100, 0, -100]
      //     })
      //   },
      //   {
      //     translateY: this.reactiveY.interpolate({
      //       inputRange: [-100, 0, 100],
      //       outputRange: [100, 0, -100]
      //     })
      //   }
      // ]
    };

    // if (visible)
    return (
      <View style={styles.container} pointerEvents={visible ? "box-none" : "none"}>
        <Animated.View style={[animatedBackground, styles.background]}>
          <TouchableOpacity style={styles.flex} onPress={this.close} />
        </Animated.View>
        <Interactable.View
          animatedNativeDriver
          ref={interactable => (this.interactable = interactable)}
          snapPoints={[{ x, y }, { x: 0, y: 0 }]}
          onSnap={this.handleOnSnap}
          initialPosition={{ x, y }}
          style={[animatedTranslate, reactive]}
          animatedValueX={this.reactiveX}
          animatedValueY={this.reactiveY}
        >
          {/* <Animated.View style={animatedTranslate}> */}
          <Animated.View style={animatedScale}>{element}</Animated.View>
          {/* </Animated.View> */}
        </Interactable.View>
      </View>
    );
    // else return null;
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
