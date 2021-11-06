import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { fonts } from '../../assets/fonts';

const SubtitleText = ({ text, ...rest }) => {
	return <Text style={styles.subtitleText}>{text}</Text>;
};

export default SubtitleText;

const styles = StyleSheet.create({
	subtitleText: {
		fontFamily: fonts.Raleway_400Regular,
		fontSize: 16,
		marginBottom: 20,
		color: '#666',
	},
});
