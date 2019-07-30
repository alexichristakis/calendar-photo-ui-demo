import React, { Component } from "react";
import { Animated, View, Text, FlatList } from "react-native";

import { SCREEN_HEIGHT, SCREEN_WIDTH, BUFFER_WIDTH } from "lib/constants";
import { randomColor } from "lib/utils";

import SAMPLE_DATA from "./test";

interface FeedProps {
  xOffset: Animated.Value;
}

class Feed extends Component<FeedProps> {
  yOffset = new Animated.Value(0);

  handleOnScroll = Animated.event([{ nativeEvent: { contentOffset: { y: this.yOffset } } }], {
    useNativeDriver: true
  });

  renderImage = ({ item, index }) => (
    <View
      key={`feed-image-${index}`}
      style={{ width: SCREEN_WIDTH - BUFFER_WIDTH, marginBottom: 20 }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text>{item.name}</Text>
        <Text>{item.time}</Text>
      </View>
      <View
        style={{
          width: SCREEN_WIDTH - BUFFER_WIDTH,
          height: SCREEN_WIDTH - BUFFER_WIDTH,
          backgroundColor: randomColor()
        }}
      />
    </View>
  );

  renderScrollIndicator = () => {
    const { xOffset } = this.props;

    return <Animated.View />;
  };

  render() {
    return (
      <View
        style={{
          width: SCREEN_WIDTH - BUFFER_WIDTH,
          height: SCREEN_HEIGHT,
          paddingTop: 50
        }}
      >
        {this.renderScrollIndicator()}
        <Animated.FlatList
          showsVerticalScrollIndicator={false}
          onScroll={this.handleOnScroll}
          scrollEventThrottle={16}
          data={SAMPLE_DATA}
          renderItem={this.renderImage}
        />
      </View>
    );
  }
}

export default Feed;
