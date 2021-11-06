import React from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';

import TitleText from './titleText';
import SubtitleText from './subtitleText';

const ServerError = () => {
	return (
		<>
			<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
				<View style={styles.center}>
					<Image source={require('../../assets/error.png')} style={styles.image} />
					<TitleText text=" Algo está mal..." />
					<SubtitleText text="Algo esta fallando de nuestro lado. No te preocupes pronto se arreglará, lo sentimos bastante..." />
				</View>
			</ScrollView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
	},
	center: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		width: 240,
		height: 240,
	},
});

export default ServerError;
