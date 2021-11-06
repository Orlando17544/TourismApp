import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, TextInput } from 'react-native';
import { FontAwesome, FontAwesome5 } from 'react-native-vector-icons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

import { fonts } from '../../assets/fonts';
import { BASIC_URL } from '../../env/BASIC_URL';
import { API_URL } from '../../env/API_URL';
import ServerError from '../components/errorScreen';
import SkeletonLoaderCards from '../components/skeletonLoaderCards';
import { multiply } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

let initialState = {
	longitude: 25,
	latitude: 30,
};

const Featured = ({ item, onPress, range }) => {
	// Check the status of the destination
	let hours = new Date().getHours().toString();
	let min = new Date().getMinutes().toString();
	let currentTime = hours.concat(':', min);
	let closeAt = item.item.horaCierre;
	let isClosed;

	if (closeAt === null) {
		isClosed = <Text style={styles.itemDescText}>SIN INFO.</Text>;
	} else if (currentTime >= closeAt) {
		isClosed = <Text style={styles.itemDescText}>CERRADO</Text>;
	} else {
		isClosed = <Text style={styles.itemDescText}>ABIERTO</Text>;
	}

	//Only render featured destinations within the range
	if (item.item.distancia <= range) {
		return (
			<TouchableOpacity style={styles.container} onPress={onPress}>
				<View style={styles.cardView}>
					<Image
						style={styles.image}
						source={{ uri: `${BASIC_URL}` + item.item.Destino.Fotos[0].ruta }}
						defaultSource={require('../../assets/image-missing.png')}
					/>

					<View style={styles.textView}>
						<Text style={styles.itemTitle}>{item.item.Destino.nombre}</Text>

						{/* Card description */}
						<View style={styles.itemDesc}>
							<FontAwesome5 style={styles.itemDesc} name="door-open" size={14} />
							{isClosed}

							<FontAwesome5 style={styles.itemDesc} name="dollar-sign" size={14} />
							<Text style={styles.itemDescText}> {item.item.precio}</Text>

							<FontAwesome style={styles.itemDesc} name="star" size={18} />
							{item.item.ranking == null ? (
								<Text style={styles.itemDescText} numberOfLines={0} ellipsizeMode="tail">
									{' '}
									SIN DATOS...
								</Text>
							) : (
								<Text style={styles.itemDescText}> {item.item.ranking}</Text>
							)}
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	} else {
		return <View />;
	}
};

export function FeaturedScreen({ navigation }) {
	const [refresh, setRefresh] = useState(false);
	const [featured, setFeatured] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [range, setRange] = useState(10000);
	const [currentPosition, setCurrentPosition] = useState(initialState);

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
		async function getDestinations() {
			try {
				let response = await axios.get(
					`${API_URL}/datadestiny/ranking?lat=` +
						currentPosition.latitude +
						`&long=` +
						currentPosition.longitude
				);
				setFeatured(response.data);
				// console.log(response.data);
				setLoading(false);
			} catch (error) {
				console.error('SECCIÓN DESTACADOS: ' + error);
				setError(true);
			}
		}
		getDestinations();
	}, []);

	const refreshPlaces = () => {
		setRefresh(true);

		axios
			.get(
				`${API_URL}/datadestiny/ranking?lat=` + currentPosition.latitude + `&long=` + currentPosition.longitude
			)
			.then((response) => {
				console.log('Featured refreshed');
				setFeatured(response.data);
				setRefresh(false);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#fff" barStyle="black-content" />

			{error ? (
				<ServerError />
			) : loading ? (
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						alignContent: 'center',
					}}
				>
					<SkeletonLoaderCards />
				</View>
			) : (
				<View style={styles.container}>
					<View
						style={{
							alignContent: 'center',
							alignItems: 'center',
							marginHorizontal: 10,
							marginTop: 10,
						}}
					>
						<View style={styles.searchBox}>
							<TextInput
								placeholder="Cambiar rango de busqueda..."
								placeholderTextColor="#757575"
								autoCapitalize="none"
								onChangeText={setRange}
								value={range}
								keyboardType="numeric"
								style={{ fontFamily: fonts.Raleway_400Regular }}
							/>
							<View style={styles.buttonsSearchBox}>
								<TouchableOpacity onPress={() => setRange(range)}>
									<FontAwesome name="search" size={20} color="#000000" />
								</TouchableOpacity>
							</View>
						</View>

						<View
							style={{
								justifyContent: 'center',
								alignContent: 'center',
								alignItems: 'center',
								alignSelf: 'center',
							}}
						>
							<Text style={{ fontFamily: fonts.Raleway_400Regular_Italic, marginBottom: 10 }}>
								Los destinos más destacados se encuentran en un radio de 10KM de ti...
							</Text>
						</View>
					</View>

					<FlatList
						data={featured}
						showsVerticalScrollIndicator={false}
						refreshing={refresh}
						onRefresh={refreshPlaces}
						renderItem={(object) => {
							return (
								<Featured
									range={range}
									item={object}
									onPress={() => {
										navigation.navigate('TouristDestinationScreen', {
											placeID: object.item.Destino.id,
										});
									}}
									style={{ margin: 10 }}
								/>
							);
						}}
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	title: {
		fontFamily: fonts.Raleway_700Bold,
		fontSize: 32,
		color: '#fff',
	},
	info: {
		marginBottom: 15,
	},
	itemDesc: {
		fontFamily: fonts.Raleway_400Regular,
		color: '#fff',
		fontSize: 16,
		opacity: 0.7,
		flexDirection: 'row',
		paddingTop: 5,
		paddingBottom: 5,
	},
	itemDescText: {
		fontFamily: fonts.Raleway_400Regular,
		color: '#fff',
		fontSize: 16,
		opacity: 0.7,
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingTop: 5,
		paddingRight: 10,
		paddingLeft: 2,
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
		fontFamily: fonts.Raleway_400Regular,
		position: 'absolute',
		margin: 10,
	},
	image: {
		width: width - 20,
		height: height / 2.5,
		borderRadius: 4,
		opacity: 0.6,
	},
	itemTitle: {
		fontFamily: fonts.Raleway_700Bold,
		color: 'white',
		fontSize: 24,
		shadowColor: '#000',
		shadowOffset: { width: 0.8, height: 0.8 },
		shadowOpacity: 0.6,
		shadowRadius: 3,
		marginBottom: 5,
		elevation: 5,
	},
	itemDescription: {
		fontFamily: fonts.Raleway_400Regular,
		color: 'white',
		fontSize: 18,
		shadowColor: '#000',
		shadowOffset: { width: 0.8, height: 0.8 },
		shadowOpacity: 0.6,
		shadowRadius: 3,
		elevation: 5,
	},
	searchBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#ffffff',
		width: '100%',
		alignSelf: 'center',
		borderRadius: 5,
		padding: 10,
		marginBottom: 5,
		elevation: 5,
	},
	buttonsSearchBox: {
		flexDirection: 'row',
	},
});
