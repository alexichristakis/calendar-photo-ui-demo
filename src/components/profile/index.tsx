import React, { Component } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  FlatList,
  SectionList,
  TouchableOpacity
} from "react-native";

import { SCREEN_HEIGHT, SCREEN_WIDTH, BUFFER_WIDTH, NAVIGATOR_SNAP_POINTS } from "lib/constants";
import { Colors, TextStyles } from "lib/styles";

import ProfileImage from "./ProfileImage";
import Transitioner from "../Transitioner";

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
  renderSectionHeader = ({ section: { title, data } }) => (
    <View key={title} style={styles.sectionHeaderContainer}>
      <Text style={TextStyles.white}>{title}</Text>
      <Text style={TextStyles.white}>{`${data.length} elements`}</Text>
    </View>
  );

  renderMonth = ({ section, index }) => {
    if (!index)
      return (
        <FlatList
          key={`month-${index}`}
          style={styles.monthContainer}
          numColumns={5}
          data={section.data}
          renderItem={this.renderImage}
        />
      );
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
            outputRange: [-20, 0, 20]
          })
        }
      ]
    };

    return (
      <View style={styles.container}>
        <Animated.View style={swipeThrottle}>
          <Text>Alexi Christakis</Text>
          <SectionList
            renderItem={this.renderMonth}
            renderSectionHeader={this.renderSectionHeader}
            sections={SAMPLE_DATA}
          />
        </Animated.View>
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
