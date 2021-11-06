import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { fonts } from '../../assets/fonts';

const PrimaryButton = ({ buttonTitle, ...rest }) => {
	return (
		<TouchableOpacity style={styles.buttonContainer} {...rest}>
			<Text style={styles.buttonText}>{buttonTitle}</Text>
		</TouchableOpacity>
	);
};

export default PrimaryButton;

const styles = StyleSheet.create({
	buttonContainer: {
		marginTop: 10,
		width: '100%',
		height: 800 / 15,
		backgroundColor: '#093671',
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 3,
	},
	buttonText: {
		fontFamily: fonts.Raleway_700Bold,
		fontSize: 20,
		color: '#ffffff',
	},
});
