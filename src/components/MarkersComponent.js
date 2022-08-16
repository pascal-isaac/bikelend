import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps';

const MarkersComponent = (props) => {
    const { latitude, longitude, nom } = props
    return (
<Marker coordinate={{
          latitude: latitude,
          longitude: longitude,
        }} >
          <Callout><Text>{nom}</Text></Callout>
        </Marker>
    )
}

export default MarkersComponent


