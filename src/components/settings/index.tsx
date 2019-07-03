import React, { Component } from "react";
import { View, Text } from "react-native";

import { SCREEN_HEIGHT, SETTINGS_WIDTH } from "lib/constants";

class Settings extends Component {
  render() {
    return (
      <View style={{ height: SCREEN_HEIGHT, width: SETTINGS_WIDTH, paddingTop: 50 }}>
        <Text>Search</Text>
        <Text>Logout</Text>
      </View>
    );
  }
}

export default Settings;
