import React, { PureComponent } from "react";
import { Animated, Easing, View, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import Interactable from "react-native-interactable";

import { ReduxState } from "state";
import { focusOff } from "state/app";
import { Colors } from "lib/styles";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "lib/constants";

interface TransitionerProps {
  x: number;
  y: number;
  visible: boolean;
  element: React.ReactNode;
  focusOff: () => {};
}

const ANIMATION_DURATION = 250;

class Transitioner extends PureComponent<TransitionerProps> {
  state = {
    open: false,
    transitioning: false
  };

  transitionAmount = new Animated.Value(0);
  pan = new Animated.ValueXY({ x: 0, y: 0 });
  _panAmount = { x: 0, y: 0 };
  panListener = "";

  componentDidMount() {
    this.panListener = this.pan.addListener(this.handleInteractablePan);
  }

  componentWillUnmount() {
    this.pan.removeListener(this.panListener);
  }

  componentDidUpdate(prevProps, prevState) {
    const { transitioning, open } = this.state;
    const { visible } = this.props;
    if (visible && !open && !transitioning) {
      this.open();
    }
  }

  handleInteractablePan = ({ x, y }: { x: number; y: number }) => {
    this._panAmount = { x: Math.abs(x), y: Math.abs(y) };
  };

  handleOnDrag = ({ nativeEvent: { state, x, y } }: Interactable.IDragEvent) => {
    if (state == "end") {
      if (Math.abs(x) > 30 || Math.abs(y) > 30) {
        this.close();
      }
    }
  };

  open = () => {
    this.setState({ transitioning: true }, () => {
      Animated.timing(this.transitionAmount, {
        useNativeDriver: true,
        toValue: 1,
        duration: ANIMATION_DURATION,
        easing: Easing.ease
      }).start(() => this.setState({ transitioning: false, open: true }));
    });

    // this.interactable.snapTo({ index: 1 });
  };

  close = () => {
    const { focusOff } = this.props;
    const { x, y } = this._panAmount;

    const currentProgress = x / SCREEN_WIDTH + y / SCREEN_HEIGHT;

    this.setState({ transitioning: true }, () => {
      this.transitionAmount.setValue(1 - currentProgress);
      Animated.timing(this.transitionAmount, {
        useNativeDriver: true,
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.ease)
      }).start(() => {
        focusOff();
        this.setState({ transitioning: false, open: false });
      });
    });
  };

  handleOnSnap = ({ nativeEvent: { index } }: Interactable.ISnapEvent) => {
    console.log("snapping:", index);
    // const { focusOff } = this.props;
    // if (!index) {
    //   focusOff();
    // }
  };

  render() {
    const { transitioning, open } = this.state;
    const { visible, element, x, y } = this.props;

    const animatedScale = {
      transform: [
        {
          scale: transitioning
            ? this.transitionAmount.interpolate({
                inputRange: [0, 1],
                outputRange: [50 / (SCREEN_WIDTH - 20), 1],
                extrapolate: "clamp"
              })
            : Animated.add(
                Animated.divide(this.pan.x, SCREEN_WIDTH),
                Animated.divide(this.pan.y, SCREEN_HEIGHT)
              ).interpolate({
                inputRange: [0, 1],
                outputRange: [1, 50 / (SCREEN_WIDTH - 20)],
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
            outputRange: [-1 * (SCREEN_HEIGHT / 2) + y + 25, 0]
          })
        },
        {
          translateX: this.transitionAmount.interpolate({
            inputRange: [0, 1],
            outputRange: [x - SCREEN_WIDTH / 2 + 25, 0]
          })
        }
      ]
    };

    const animatedBackground = {
      opacity:
        transitioning || !open
          ? this.transitionAmount.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.8],
              extrapolate: "clamp"
            })
          : Animated.add(
              Animated.divide(this.pan.x, SCREEN_WIDTH),
              Animated.divide(this.pan.y, SCREEN_HEIGHT)
            ).interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 0],
              extrapolate: "clamp"
            })
    };

    return (
      <View style={styles.container} pointerEvents={visible ? "box-none" : "none"}>
        <Animated.View style={[animatedBackground, styles.background]}>
          <TouchableOpacity activeOpacity={1} style={styles.flex} onPress={this.close} />
        </Animated.View>
        <Interactable.View
          animatedNativeDriver
          dragEnabled={open}
          snapPoints={[{ x: 0, y: 0, damping: 0.5, tension: 500 }]}
          onDrag={this.handleOnDrag}
          animatedValueX={this.pan.x}
          animatedValueY={this.pan.y}
        >
          <Animated.View style={animatedTranslate}>
            <Animated.View style={animatedScale}>{visible ? element : null}</Animated.View>
          </Animated.View>
        </Interactable.View>
      </View>
    );
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

const mapStateToProps = (state: ReduxState) => ({});

const mapDispatchToProps = { focusOff };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transitioner);
