import React, { Component } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";

import { SCREEN_HEIGHT, SCREEN_WIDTH, BUFFER_WIDTH, NAVIGATOR_SNAP_POINTS } from "lib/constants";
import { Colors, TextStyles } from "lib/styles";

import ProfileImage from "./ProfileImage";

import { sections as SAMPLE_DATA } from "./test";

interface ProfileState {
  focused: { color: string };
  startTransition: {
    pageX: number;
    pageY: number;
  };
}

interface ProfileProps {
  xOffset: Animated.Value;
}

class Profile extends Component<ProfileProps, ProfileState> {
  yOffset = new Animated.Value(0);

  handleOnScroll = Animated.event([{ nativeEvent: { contentOffset: { y: this.yOffset } } }], {
    useNativeDriver: true
  });

  parallax = (amount: number) => ({
    transform: [
      {
        translateY: this.yOffset.interpolate({
          inputRange: [-100, 0],
          outputRange: [-50 / (amount + 1), 0],
          extrapolateRight: "clamp"
        })
      }
    ]
  });

  renderListHeader = () => {
    return (
      <Animated.View style={this.parallax(2 / 3 - 1)}>
        <Text>Alexi Christakis</Text>
      </Animated.View>
    );
  };

  renderSectionHeader = ({ section: { sectionIndex, title, data } }) => {
    return (
      <Animated.View
        key={title}
        style={[this.parallax(sectionIndex), styles.sectionHeaderContainer]}
      >
        <Text style={TextStyles.white}>{title}</Text>
        <Text style={TextStyles.white}>{`${data.length} moments`}</Text>
      </Animated.View>
    );
  };

  renderMonth = ({ section: { data, sectionIndex }, index }) => {
    if (!index) {
      return (
        <Animated.FlatList
          key={`month-${index}`}
          style={[this.parallax(sectionIndex), styles.monthContainer]}
          numColumns={5}
          data={data}
          renderItem={this.renderImage}
        />
      );
    }
    return null;
  };

  renderImage = ({ item, index }) => (
    <ProfileImage
      {...item}
      onPress={({ pageX, pageY }) =>
        this.setState({ focused: item, startTransition: { pageX, pageY } })
      }
    />
  );

  render() {
    const { xOffset } = this.props;

    const swipeThrottle = {
      transform: [
        {
          translateX: xOffset.interpolate({
            inputRange: NAVIGATOR_SNAP_POINTS.map(({ x }) => x).reverse(),
            outputRange: [-25, 0, 25]
          })
        }
      ]
    };

    return (
      <View style={styles.container}>
        <Animated.SectionList
          style={swipeThrottle}
          onScroll={this.handleOnScroll}
          scrollEventThrottle={16}
          ListHeaderComponent={this.renderListHeader}
          renderItem={this.renderMonth}
          renderSectionHeader={this.renderSectionHeader}
          sections={SAMPLE_DATA}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - BUFFER_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: Colors.blue,
    paddingTop: 50,
    paddingLeft: 20
  },
  monthContainer: {
    marginBottom: 30
  },
  sectionHeaderContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.blue,
    paddingVertical: 10,
    paddingRight: 30
  }
});

export default Profile;
