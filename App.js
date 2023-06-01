import React from "react";
import { View, Text } from "react-native";
import MapScreen from "./components/VenueMap";

const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <MapScreen />
    </View>
  );
};

export default App;
