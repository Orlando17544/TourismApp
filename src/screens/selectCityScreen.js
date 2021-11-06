import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Dimensions, Image, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { fonts } from '../../assets/fonts';

import CITIES from '../../data/CITIES';
import SkeletonLoaderCards from '../components/skeletonLoaderCards';

const { width, height } = Dimensions.get('window');

export function SelectCityScreen({ navigation }) {
	const [data, setData] = useState(CITIES);
	const [query, setQuery] = useState('');

	const handleSearch = (text) => {
		var filteredCities = CITIES.filter((city) => city.title.toLowerCase().includes(text.toLowerCase()));
		setData(filteredCities);
		setQuery(text);
	};

	const renderItem = ({ item }) => (
		<TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'Destacados' })}>
			<View style={styles.cardView}>
				<Image
					source={{ uri: item.image }}
					style={styles.image}
					defaultSource={require('../../assets/image-missing.png')}
				/>
				<View style={styles.textView}>
					<View style={[styles.image, styles.layer]} />
					<Text style={styles.title}>{item.title}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#fff" barStyle="black-content" />
			<View style={styles.searchBarContainer}>
				<TextInput
					style={styles.searchBarTextInput}
					autoCapitalize="none"
					autoCorrect={false}
					value={query}
					onChangeText={(queryText) => handleSearch(queryText)}
					placeholder="Buscar"
				/>
			</View>
			<FlatList
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
	searchBarContainer: {
		alignSelf: 'stretch',
		paddingHorizontal: 6,
		paddingVertical: 5,
		backgroundColor: '#00000000',
	},
	searchBarTextInput: {
		fontFamily: fonts.Raleway_400Regular,
		fontSize: 15,
		backgroundColor: '#ffffff',
		paddingHorizontal: 16,
		paddingVertical: 6,
		alignSelf: 'stretch',
		borderRadius: 5,
	},
	container: {
		flex: 1,
	},
	title: {
		fontFamily: fonts.Raleway_700Bold,
		fontSize: 32,
		paddingBottom: 10,
		color: '#fff',
	},
	cardView: {
		flex: 1,
		width: width - 20,
		height: height / 2.5,
		backgroundColor: 'white',
		margin: 10,
		borderRadius: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0.5, height: 0.5 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 5,
		backgroundColor: '#000',
		justifyContent: 'flex-end',
	},
	textView: {
		position: 'absolute',
		margin: 10,
	},
	image: {
		width: width - 20,
		height: height / 2.5,
		borderRadius: 4,
		opacity: 0.6,
	},
});
