import React, { useEffect, useState } from 'react';
import {
	Dimensions,
	StyleSheet,
	Text,
	View,
	Animated,
	Image,
	TextInput,
	TouchableOpacity,
	SafeAreaView,
	KeyboardAvoidingView,
	Modal,
	AsyncStorage,
} from 'react-native';
import { Marker } from 'react-native-maps';
import { FontAwesome5, Octicons, MaterialIcons } from 'react-native-vector-icons';
import ContentLoader, { Rect } from 'react-content-loader/native';
import * as Location from 'expo-location';
import axios from 'axios';

import Map from '../components/map';
import StarsRating from '../components/starsRating';
import PrimaryButton from '../components/primaryButton';
import { BASIC_URL } from '../../env/BASIC_URL';
import { API_URL } from '../../env/API_URL';
import { fonts } from '../../assets/fonts';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = screenWidth * 0.8;
const CARD_HEIGHT = screenHeight * 0.25;
const SPACING_FOR_CARD_INSET = screenWidth * 0.1 - 10;

let initialState = {
	longitude: 25,
	latitude: 30,
	latitudeDelta: 0.035,
	longitudeDelta: 0.035,
};

Location.installWebGeolocationPolyfill();
Location.requestPermissionsAsync();
Location.requestBackgroundPermissionsAsync();

export function MapScreen({ navigation }) {
	const [currentPosition, setCurrentPosition] = useState(initialState);

	// Get current position of the pers
	useEffect(() => {
		navigator.geolocation.watchPosition(
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
		retrieveToken();
	}, []);

	const [queryText, setQueryText] = useState('');
	const [activatedSuggestions, setActivatedSuggestions] = useState(false);
	const [deactivateSuggestions, setDeactivateSuggestions] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [range, setRange] = useState(10000);
	const [markers, setMarkers] = useState([]);
	const [searchBar, setSearchBar] = useState('');
	const [filteredSuggestion, setFilteredSuggestion] = useState({ nombre: '', id: '' });
	const [userToken, setUserToken] = useState('');
	const [config, setConfig] = useState('');

	//mapIndex es el índice de destino turístico seleccionado en el mapa
	let mapIndex = 0;
	let mapAnimation = new Animated.Value(0);

	useEffect(() => {
		mapAnimation.addListener(({ value }) => {
			//index es el índice de destino turístico seleccionado en las tarjetas
			let index = Math.floor(value / (CARD_WIDTH + 20)); //Se divide lo avanzado en el eje de las x's entre el ancho de la tarjeta más 20

			//Como se están recibiendo muchos valores value, clearTimeout sirve para detener la ejecución de setTimeout.
			//Esto ocasiona que el último valor value sea el único que sea procesado.
			clearTimeout(regionTimeout);

			//setTimeout ejecuta la función después del periodo de tiempo indicado, en este caso después de 10 milisegundos.
			const regionTimeout = setTimeout(() => {
				if (mapIndex !== index) {
					if (index < 0) {
						index = 0;
					}
					mapIndex = index;
					let latlng = {
						latitude: Number(markers[index].DatosDestino.lat),
						longitude: Number(markers[index].DatosDestino.long),
					};
					map.current.animateToRegion(
						{
							...latlng,
							latitudeDelta: initialState.latitudeDelta,
							longitudeDelta: initialState.longitudeDelta,
						},
						350
					);
				}
			}, 10);
		});
	});

	async function retrieveToken() {
		try {
			const token = await AsyncStorage.getItem('userToken');

			if (token !== null) {
				setUserToken(token);
			}

			setConfig({ headers: { Authorization: `Bearer ${userToken}` } });

			getMarkers();
		} catch (error) {
			console.log(error);
		}
	}

	//Esto es la animación para agrandar el marker seleccionado.
	const interpolations = markers.map((marker, index) => {
		const inputRange = [(index - 1) * CARD_WIDTH, index * CARD_WIDTH, (index + 1) * CARD_WIDTH];

		const scale = mapAnimation.interpolate({
			inputRange,
			outputRange: [1, 1.5, 1],
			extrapolate: 'clamp',
		});

		return { scale };
	});

	//Esto es para mover el scroll hacia el marker que el usuario seleccionó al presionarlo.
	const onMarkerPress = (mapEventData) => {
		const markerID = mapEventData._targetInst.return.key;

		let x = markerID * CARD_WIDTH + markerID * 20;

		scrollView.current.scrollTo({ x: x, y: 0, animated: true });
	};

	function handleSuggestions(text) {
		if (activatedSuggestions) {
			clearTimeout(deactivateSuggestions);
			setDeactivateSuggestions(
				setTimeout(function () {
					setActivatedSuggestions(false);
				}, 5000)
			);
		} else {
			setActivatedSuggestions(true);
			setDeactivateSuggestions(
				setTimeout(function () {
					setActivatedSuggestions(false);
				}, 5000)
			);
		}
		setQueryText(text);
	}

	function getSuggestions() {
		if (queryText.length === 0) {
			return null;
		}
		async function filterSuggestions() {
			try {
				let response = await axios.get(`${API_URL}/destiny/find?nombre=` + queryText, config);

				if (response.status !== 200) {
					throw new Error('HTTP error! status: ' + response.status);
				}

				setFilteredSuggestion(response.data.data);
			} catch (error) {
				console.log(error);
			}
		}
		filterSuggestions();
		if (filteredSuggestion.nombre) {
			return (
				<View style={styles.suggestionsContainer}>
					<TouchableOpacity
						key={filteredSuggestion.id}
						style={{ padding: 5 }}
						onPress={() => {
							setSearchBar(filteredSuggestion.nombre);
							setActivatedSuggestions(false);
						}}
					>
						<Text>{filteredSuggestion.nombre}</Text>
					</TouchableOpacity>
				</View>
			);
		} else {
			return null;
		}
	}

	async function getMarkers() {
		try {
			let response = await axios.get(
				`${API_URL}/destiny/rank?lat=` +
					currentPosition.latitude +
					`&long=` +
					currentPosition.longitude +
					`&range=` +
					range,
				config
			);

			if (response.status !== 200) {
				throw new Error('HTTP error! status: ' + response.status);
			}

			console.log(response.data);

			setMarkers(response.data);
		} catch (error) {
			console.log(error);
		}
	}

	const map = React.useRef(null);
	const scrollView = React.useRef(null);

	return currentPosition.latitude ? (
		<KeyboardAvoidingView behavior={'height'} style={{ flex: 1 }} enabled={false}>
			<SafeAreaView forceInset={{ top: 'always' }}>
				<Map
					map={map}
					styleMap={styles.map}
					regionMap={currentPosition}
					markers={markers.map((marker, index) => {
						const scaleStyle = {
							transform: [
								{
									scale: interpolations[index].scale,
								},
							],
						};
						let locationMarker = {
							latitude: Number(marker.DatosDestino.lat),
							longitude: Number(marker.DatosDestino.long),
						};
						return (
							<Marker key={marker.id} coordinate={locationMarker} onPress={(e) => onMarkerPress(e)}>
								<Animated.View style={[styles.markerWrap]}>
									<Animated.Image
										source={require('../../assets/map-icon.png')}
										style={[styles.marker, scaleStyle]}
										resizeMode="cover"
									/>
								</Animated.View>
							</Marker>
						);
					})}
				/>
			</SafeAreaView>
			<View style={styles.searchBox}>
				<TextInput
					placeholder="Buscar..."
					placeholderTextColor="#757575"
					autoCapitalize="none"
					onChangeText={(text) => {
						handleSuggestions(text);
						setSearchBar(text);
					}}
					value={searchBar}
					style={{ fontFamily: fonts.Raleway_400Regular }}
				/>
				<View style={styles.buttonsSearchBox}>
					<TouchableOpacity style={{ marginRight: 5 }} onPress={() => getMarkers()}>
						<MaterialIcons name="update" size={20} color="#000000" />
					</TouchableOpacity>
					<TouchableOpacity style={{ marginRight: 5 }} onPress={() => setModalVisible(true)}>
						<Octicons name="settings" size={20} color="#000000" />
					</TouchableOpacity>
					<TouchableOpacity>
						<FontAwesome5
							name="search"
							size={20}
							color="#000000"
							onPress={() =>
								navigation.navigate('TouristDestinationScreen', { placeID: filteredSuggestion.id })
							}
						/>
					</TouchableOpacity>
				</View>
			</View>
			<Modal
				transparent={true}
				animationType="slide"
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View
					style={{
						marginTop: screenHeight * 0.35,
						backgroundColor: 'white',
						borderRadius: 5,
						padding: 35,
						marginHorizontal: 20,
						shadowColor: '#000',
						shadowRadius: 5,
						shadowOpacity: 0.3,
						shadowOffset: { x: 2, y: -2 },
						elevation: 5,
					}}
				>
					<TextInput
						placeholder="Rango en metros"
						placeholderTextColor="#757575"
						onChangeText={(text) => {
							setRange(text);
						}}
						value={range}
						keyboardType="numeric"
						style={{
							fontFamily: fonts.Raleway_400Regular,
							borderColor: '#ccc',
							borderRadius: 3,
							borderWidth: 1,
							flexDirection: 'row',
							alignItems: 'center',
							backgroundColor: '#fff',
							height: 45,
							padding: 10,
							fontSize: 16,
							color: '#333',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					/>
					<PrimaryButton buttonTitle="Establecer rango" onPress={() => setModalVisible(!modalVisible)} />
				</View>
			</Modal>
			{activatedSuggestions ? getSuggestions(queryText) : null}
			<Animated.ScrollView
				ref={scrollView}
				horizontal={true}
				pagingEnabled={true}
				showsHorizontalScrollIndicator={false}
				snapToInterval={CARD_WIDTH + 20}
				snapToAlignment={'start'}
				decelerationRate={'fast'}
				style={styles.scrollView}
				contentContainerStyle={{
					paddingHorizontal: SPACING_FOR_CARD_INSET,
				}}
				onScroll={Animated.event(
					[
						{
							nativeEvent: {
								contentOffset: {
									x: mapAnimation,
								},
							},
						},
					],
					{ useNativeDriver: true }
				)}
			>
				{markers.map((marker, index) => (
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('TouristDestinationScreen', { placeID: marker.id });
						}}
					>
						<View style={styles.card} key={marker.id}>
							<Image
								source={{ uri: `${BASIC_URL}` + marker.Fotos[0].ruta }}
								style={styles.cardImage}
								resizeMode="cover"
								defaultSource={require('../../assets/image-missing.png')}
							/>
							<View style={styles.textContent}>
								<Text numberOfLines={1} style={styles.cardtitle}>
									{marker.nombre}
								</Text>
								<View style={styles.starsContainer}>
									<StarsRating
										stars={marker.DatosDestino.ranking}
										setStars={() => {}}
										color={'#f0961e'}
										size={20}
									/>
								</View>
								<Text numberOfLines={1} style={styles.cardDescription}>
									{marker.descripcion}
								</Text>
							</View>
						</View>
					</TouchableOpacity>
				))}
			</Animated.ScrollView>
		</KeyboardAvoidingView>
	) : (
		<ContentLoader>
			<Rect x={0} y={0} rx="2" ry="2" width={screenWidth} height={screenHeight} />
		</ContentLoader>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#ecf0f1',
	},
	searchBox: {
		position: 'absolute',
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#ffffff',
		width: '90%',
		alignSelf: 'center',
		borderRadius: 5,
		padding: 10,
		elevation: 10,
	},
	buttonsSearchBox: {
		flexDirection: 'row',
		marginTop: 2,
	},
	suggestionsContainer: {
		position: 'absolute',
		marginTop: 60,
		backgroundColor: '#ffffff',
		width: '90%',
		alignSelf: 'center',
		borderRadius: 5,
		padding: 10,
		elevation: 10,
	},
	showSettingsDestinationsContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		alignSelf: 'center',
	},
	fieldRange: {
		fontFamily: fonts.Raleway_400Regular,
		borderWidth: 5,
		fontSize: 12,
		alignSelf: 'center',
	},
	scrollView: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		paddingVertical: 10,
	},
	card: {
		elevation: 2,
		backgroundColor: '#ffffff',
		borderTopLeftRadius: 5,
		borderTopRightRadius: 5,
		marginHorizontal: 10,
		shadowColor: '#000',
		shadowRadius: 5,
		shadowOpacity: 0.3,
		shadowOffset: { x: 2, y: -2 },
		height: CARD_HEIGHT,
		width: CARD_WIDTH,
		overflow: 'hidden',
	},
	cardImage: {
		width: CARD_WIDTH,
		height: '50%',
	},
	textContent: {
		fontFamily: fonts.Raleway_400Regular,
		flex: 2,
		padding: 10,
	},
	cardtitle: {
		fontFamily: fonts.Raleway_700Bold,
		fontSize: 14,
	},
	starsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	cardDescription: {
		fontFamily: fonts.Raleway_400Regular,
		fontSize: 12,
		color: '#444',
	},
	markerWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 50,
		height: 50,
	},
	marker: {
		width: 20,
		height: 20,
	},
	map: {
		height: '100%',
	},
});
