import * as React from 'react';
import { View, Image, Dimensions, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export function SplashScreen() {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<StatusBar backgroundColor="#fff" barStyle="black-content" />
			<Image source={require('../../assets/splash.png')} style={{ width: screenWidth, height: screenHeight }} />
			<ActivityIndicator size="large" />
		</View>
	);
}
