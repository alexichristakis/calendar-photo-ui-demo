import React, { PureComponent } from "react";
import { Animated, Easing, View, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import Interactable from "react-native-interactable";

import { ReduxState } from "state";
import { focusOff, Focused } from "state/app";
import { selectFocused } from "state/selectors";
import { Colors } from "lib/styles";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "lib/constants";

interface TransitionerProps {}
interface TransitionerReduxProps extends Focused {
  focusOff: () => void;
}

interface TransitionerState {
  open: boolean;
  transitioning: boolean;
}

const ANIMATION_DURATION = 225;
const SNAP_POINTS = [{ x: 0, y: 0, damping: 0.5, tension: 500 }];

class Transitioner extends PureComponent<
  TransitionerProps & TransitionerReduxProps,
  TransitionerState
> {
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

  componentDidUpdate(
    prevProps: TransitionerProps & TransitionerReduxProps,
    prevState: TransitionerState
  ) {
    const { transitioning, open } = this.state;
    const { visible } = this.props;
    if (visible && !open && !transitioning) {
      requestAnimationFrame(() => this.open());
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
        easing: Easing.out(Easing.quad)
      }).start(() => this.setState({ transitioning: false, open: true }));
    });
  };

  close = () => {
    const { focusOff } = this.props;
    const { x, y } = this._panAmount;

    const currentProgress = x / SCREEN_WIDTH + y / SCREEN_HEIGHT;

    this.setState({ transitioning: true, open: false }, () => {
      this.transitionAmount.setValue(1 - currentProgress);
      Animated.timing(this.transitionAmount, {
        useNativeDriver: true,
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.quad)
      }).start(() => {
        focusOff();
        this.setState({ transitioning: false });
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

  renderChildren = () => {
    const { visible, image } = this.props;
    const { transitioning, open } = this.state;

    const FocusedElement = (
      <View
        style={{
          backgroundColor: image,
          width: SCREEN_WIDTH - 10,
          height: SCREEN_WIDTH - 10
        }}
      />
    );

    if (visible && (transitioning || open)) return FocusedElement;
    else return null;
  };

  render() {
    const { transitioning, open } = this.state;
    const { visible, startX, startY } = this.props;

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
            outputRange: [-1 * (SCREEN_HEIGHT / 2) + startY + 25, 0]
          })
        },
        {
          translateX: this.transitionAmount.interpolate({
            inputRange: [0, 1],
            outputRange: [startX - SCREEN_WIDTH / 2 + 25, 0]
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
        {visible && (
          <Animated.View
            pointerEvents={open ? "auto" : "none"}
            style={[animatedBackground, styles.background]}
          >
            <TouchableOpacity activeOpacity={1} style={styles.flex} onPress={this.close} />
          </Animated.View>
        )}
        <Interactable.View
          animatedNativeDriver
          dragEnabled={open}
          snapPoints={SNAP_POINTS}
          onDrag={this.handleOnDrag}
          animatedValueX={this.pan.x}
          animatedValueY={this.pan.y}
        >
          <Animated.View style={animatedTranslate}>
            <Animated.View style={animatedScale}>{this.renderChildren()}</Animated.View>
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

const mapStateToProps = (state: ReduxState) => ({ ...selectFocused(state) });

const mapDispatchToProps = { focusOff };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transitioner);
