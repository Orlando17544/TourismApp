import React, { useState, useEffect } from 'react';
import { Card, CardAction, CardButton, CardImage } from 'react-native-cards';
import { View, StyleSheet, Text, FlatList, AsyncStorage } from 'react-native';
import { FontAwesome, Ionicons } from 'react-native-vector-icons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

import { API_URL } from '../../env/API_URL';
import { BASIC_URL } from '../../env/BASIC_URL';
import ServerError from '../components/errorScreen';
import { fonts } from '../../assets/fonts';

import SkeletonLoaderCards from '../components/skeletonLoaderCards';

let initialState = {
	longitude: 25,
	latitude: 30,
};

const Place = ({ item, navigation, range }) => {
	//Check if the places are within the range of 10km to show them in the flatlist
	if (item.item.distancia <= range) {
		return (
			<Card>
				<CardImage
					source={{ uri: `${BASIC_URL}` + item.item.Destino.Fotos[0].ruta }}
					title={item.item.Destino.nombre}
				/>

				<View style={styles.cardContainer}>
					<Text style={styles.description} numberOfLines={4} ellipsizeMode="tail">
						{item.item.Destino.descripcion}
					</Text>
					<View style={styles.iconContainer}>
						<Ionicons name="location-sharp" size={20} color="#b71c1c" />
						<Text style={styles.textRating}>{item.item.direccion}</Text>
					</View>
					<View style={[styles.iconContainer, { marginBottom: 5 }]}>
						<FontAwesome name="star" size={20} color="#faaf19" />
						{item.item.ranking == null ? (
							<Text style={styles.textRating}>Se el primero en calificar este lugar!</Text>
						) : (
							<Text style={styles.textRating}>{item.item.ranking} estrellas</Text>
						)}
					</View>
				</View>

				<CardAction separator={true} inColumn={false}>
					<CardButton
						onPress={() => {
							navigation.navigate('TouristDestinationScreen', {
								placeID: item.item.id,
							});
						}}
						title="Explorar"
						color="#ffffff"
						style={styles.buttonContainer}
					/>
				</CardAction>
			</Card>
		);
	} else {
		return <View />;
	}
};

export function PlacesScreen({ route, navigation }) {
	const [userToken, setUserToken] = useState('');
	const [refresh, setRefresh] = useState(false);
	const [places, setPlaces] = useState([]);
	const [loading, setLoading] = useState(true);
	// Consider that searchs only in the range of 10km
	const [range, setRange] = useState(10000);
	const [currentPosition, setCurrentPosition] = useState(initialState);
	const [error, setError] = useState(false);

	const { subcategoryName, subcategoryId } = route.params;

	navigation.setOptions({ title: subcategoryName });

	const header = `Bearer ${userToken}`;

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { longitude, latitude } = position.coords;

				setCurrentPosition({
					...currentPosition,
					latitude,
					longitude,
				});
			},
			(error) => alert(error.message),
			{ timeout: 20000, maximumAge: 1000 }
		);
	}, []);

	useEffect(() => {
		const retrieveToken = async () => {
			try {
				const token = await AsyncStorage.getItem('userToken');
				if (token !== null) {
					setUserToken(token);
				}
			} catch (error) {
				console.log(error);
			}
		};

		retrieveToken();

		console.log(
			`${API_URL}/datadestiny/ranking?subId=` +
				subcategoryId +
				`&lat=` +
				currentPosition.latitude +
				`&long=` +
				currentPosition.longitude
		);

		axios
			.get(
				`${API_URL}/datadestiny/ranking?subId=` +
					subcategoryId +
					`&lat=` +
					currentPosition.latitude +
					`&long=` +
					currentPosition.longitude,
				{ headers: { Authorization: header } }
			)
			.then((response) => {
				setPlaces(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.log('ERROR DESTINOS TURISTICOS: ' + error);
				setError(true);
			});
	}, []);

	const refreshPlaces = () => {
		setRefresh(true);

		axios
			.get(
				`${API_URL}/datadestiny/ranking?subId=` +
					subcategoryId +
					`&lat=` +
					currentPosition.latitude +
					`&long=` +
					currentPosition.longitude,
				{ headers: { Authorization: header } }
			)
			.then((response) => {
				console.log('Refreshed!');
				setPlaces(response.data);
				setRefresh(false);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<View>
			<StatusBar backgroundColor="#fff" barStyle="black-content" />
			{error ? (
				<ServerError />
			) : loading ? (
				<View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
					<SkeletonLoaderCards />
				</View>
			) : (
				<FlatList
					data={places}
					showsVerticalScrollIndicator={false}
					refreshing={refresh}
					onRefresh={refreshPlaces}
					renderItem={(object) => {
						return <Place item={object} navigation={navigation} range={range} />;
					}}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	cardContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		marginHorizontal: 10,
	},
	description: {
		fontFamily: fonts.Raleway_400Regular,
		marginTop: 5,
		fontSize: 16,
	},
	iconContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop: 5,
	},
	textRating: {
		fontFamily: fonts.Raleway_400Regular,
		marginLeft: 5,
	},
	buttonContainer: {
		fontFamily: fonts.Raleway_700Bold,
		backgroundColor: '#093671',
		padding: 10,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 3,
	},
	buttonText: {
		fontFamily: fonts.Raleway_700Bold,
		fontSize: 18,
		color: '#ffffff',
	},
});
