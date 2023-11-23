import { StyleSheet, Text, View,useWindowDimensions } from 'react-native'
import React from 'react'
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";


const Test = ({navigate,route}) => {
    const [viewport, setViewport] = React.useState({
        latitude: 16.048660316245975,
        longitude: 108.21574442088604,
    });
    const [mapRegion,setMapRegion] = React.useState({
        latitude: 16.048660316245975,
        longitude: 108.21574442088604,
        latitudeDelta: 0.21688808266279125,
        longitudeDelta: 0.15441477298736572,
    })
    return (
        <View style={styles.page}>
            <MapView  
                region={mapRegion}
                style={{ flex: 1 }}>
                <Marker coordinate={{ latitude: 52.4, longitude: 18.7 }} />
            </MapView>
        </View>
    )
}

export default Test

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    container: {
    height: 300,
    width: 300,
    },
    map: {
    flex: 1
    }
})