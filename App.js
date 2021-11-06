import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, Text, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';

import { fonts, useFontsArg } from './assets/fonts';
import { LoginNavigator } from './src/navigation';

export default function App() {
	const [fontsLoaded] = useFonts(useFontsArg);

	if (!fontsLoaded) return <ActivityIndicator size="large" />;

	return (
		<View style={{ flex: 1, justifyContent: 'center' }}>
			<StatusBar barStyle="dark-content" />

			<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
				<LoginNavigator />
			</SafeAreaView>
		</View>
	);
}
