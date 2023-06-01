import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";
import { TouchableHighlight } from "react-native-gesture-handler";

const VenueMap = () => {
  const [mapRegion, setMapRegion] = useState([]);
  const mapRef = useRef(null);
  const API_URL =
    "https://cx6bmbl1e3.execute-api.us-east-2.amazonaws.com/venues";

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setMapRegion(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching venue data:", error);
      });
  }, []);

  const getRegion = (lat, lon, zoomIndex = 1) => {
    return {
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.0922 * (1 / zoomIndex),
      longitudeDelta: 0.0421 * (1 / zoomIndex),
    };
  };

  const handleVenuePress = (index) => {
    const newRegion = getRegion(mapRegion[index].lat, mapRegion[index].lon, 10);
    mapRef.current.animateToRegion(newRegion, 3000);
  };

  return (
    <View style={styles.container}>
      {mapRegion.length > 0 && (
        <MapView
          style={styles.map}
          region={getRegion(mapRegion[0].lat, mapRegion[0].lon)}
          ref={mapRef}
        >
          {mapRegion.map((venue) => (
            <Marker
              key={venue.id}
              coordinate={{
                latitude: venue.lat,
                longitude: venue.lon,
              }}
              title={venue.name}
              description={venue.address}
            />
          ))}
        </MapView>
      )}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardContainer}
      >
        {mapRegion.map((venue, index) => (
          <TouchableHighlight style={styles.touchableHighlightStyle}>
            <View
              style={styles.card}
              key={`Venue_${index}`}
              onStartShouldSetResponder={() => {
                handleVenuePress(index);
              }}
            >
              <>
                <Text style={styles.cardTitle}>{venue.name}</Text>
                <Text style={styles.cardDescription}>{venue.address}</Text>
              </>
            </View>
          </TouchableHighlight>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  map: {
    flex: 6,
  },
  touchableHighlightStyle: {
    width: "100%",
  },
  cardContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 35,
  },
  card: {
    width: 400,

    height: 90,
    alignItems: "center",
    justifyContent: "center",

    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default VenueMap;
