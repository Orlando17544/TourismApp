import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { fonts } from '../../assets/fonts';

const TitleText = ({ text, ...rest }) => {
	return <Text style={styles.titleText}>{text}</Text>;
};

export default TitleText;

const styles = StyleSheet.create({
	titleText: {
		fontFamily: fonts.Raleway_700Bold,
		fontSize: 28,
		marginBottom: 20,
		color: '#112d4d',
	},
});
