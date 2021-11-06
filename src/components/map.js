import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const height = Dimensions.get('window').height;

const Map = (props) => {
	return (
		<MapView
			ref={props.map}
			provider={PROVIDER_GOOGLE}
			style={props.styleMap}
			loadingEnabled={true}
			showsUserLocation={true}
			region={props.regionMap}
		>
			{props.markers}
		</MapView>
	);
};

export default Map;
