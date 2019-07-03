import React, { Component } from "react";
import { View, Text, FlatList } from "react-native";

import { SCREEN_HEIGHT, SCREEN_WIDTH, BUFFER_WIDTH } from "lib/constants";
import { randomColor } from "lib/utils";

import SAMPLE_DATA from "./test.json";

class Feed extends Component {
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

  render() {
    return (
      <View
        style={{
          width: SCREEN_WIDTH - BUFFER_WIDTH,
          height: SCREEN_HEIGHT,
          paddingTop: 50
        }}
      >
        <Text>this is the feed page</Text>
        <FlatList data={SAMPLE_DATA} renderItem={this.renderImage} />
      </View>
    );
  }
}

export default Feed;
