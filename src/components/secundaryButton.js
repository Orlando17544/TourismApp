import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { fonts } from '../../assets/fonts';

const SecundaryButton = ({ buttonTitle, ...rest }) => {
	return (
		<TouchableOpacity style={styles.forgotButton} {...rest}>
			<Text style={styles.navButtonText}>{buttonTitle}</Text>
		</TouchableOpacity>
	);
};

export default SecundaryButton;

const styles = StyleSheet.create({
	forgotButton: {
		marginVertical: 35,
	},
	navButtonText: {
		fontFamily: fonts.Raleway_700Bold,
		fontSize: 18,
		opacity: 0.6,
		color: '#093671',
	},
});
