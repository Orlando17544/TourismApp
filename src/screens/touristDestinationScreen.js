import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, Text, ScrollView, AsyncStorage, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, FontAwesome5, Ionicons } from 'react-native-vector-icons';
import * as Linking from 'expo-linking';
import axios from 'axios';

import { API_URL } from '../../env/API_URL';
import PrimaryButton from '../components/primaryButton';
import StarsRating from '../components/starsRating';
import CarouselImages from '../components/carousel';
import ServerError from '../components/errorScreen';
import SkeletonLoaderCarousel from '../components/skeletonLoaderCarousel';
import { fonts } from '../../assets/fonts';

const WHATSAPP_MESSAGE = 'Me gustaría una reservación por favor!';

const screenWidth = Dimensions.get('window').width;

export function TouristDestinationScreen({ route, navigation }) {
	// Catch params from FeaturedScreen or PlacesScren
	const { placeID } = route.params;

	const [destination, setDestination] = useState({
		id: '',
		nombre: '',
		descripcion: '',
		idSubcategoria: '',
		statusDelete: '',
		Subcategorium: {
			id: '',
			nombre: '',
			descripcion: '',
			status: '',
			categoriaId: '',
			categoria: {
				id: '',
				nombre: '',
				descripcion: '',
				status: '',
				urlImg: '',
			},
		},
		DatosDestino: {
			id: '',
			precio: '',
			ranking: '',
			horarios: '',
			contactoWhatsap: '',
			contactoDirecto: '',
			DurlWebPropia: '',
			urlDestino3D: '',
			destinoId: '',
			direccion: '',
			lat: '',
			long: '',
			info: '',
			isClosed: '',
		},
	});
	const [token, setToken] = useState();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [stars, setStars] = React.useState(0);

	useEffect(() => {
		const retrieveToken = async () => {
			try {
				const token = await AsyncStorage.getItem('userToken');
				if (token !== null) {
					setToken(token);
				}
			} catch (error) {
				console.log(error);
			}
		};

		retrieveToken();

		let cleanedState = true;

		navigation = { navigation };

		async function getInfo() {
			try {
				let response = await axios.get(`${API_URL}/destiny/find?id=` + placeID);

				if (cleanedState) {
					setDestination(response.data.data);
					console.log(response.data.data);
				}

				setLoading(false);
			} catch (error) {
				console.log('ERROR DESTINO TURISTICO: ' + error);
				setError(true);
			}
		}
		getInfo();
	}, []);

	// Check the status of the destination
	let hours = new Date().getHours().toString();
	let min = new Date().getMinutes().toString();
	let currentTime = hours.concat(':', min);
	let closeAt = destination.DatosDestino.horaCierre;
	let isClosed;

	if (closeAt === null) {
		isClosed = (
			<Text style={{ color: '#8f8f8f', fontSize: 18, fontFamily: fonts.Raleway_400Regular }}>SIN INFO.</Text>
		);
	} else if (currentTime >= closeAt) {
		isClosed = (
			<Text style={{ color: '#8f8f8f', fontSize: 18, fontFamily: fonts.Raleway_400Regular }}>CERRADO</Text>
		);
	} else {
		isClosed = (
			<Text style={{ color: '#8f8f8f', fontSize: 18, fontFamily: fonts.Raleway_400Regular }}>ABIERTO</Text>
		);
	}

	// Check if the destionation take a time off
	let checkDaysOff = destination.DatosDestino.horaDescanso;
	let renderDays;
	checkDaysOff == null
		? (renderDays = <Text style={{ color: '#8f8f8f', fontSize: 18 }}>El lugar esta abierto todo el día</Text>)
		: (renderDays = (
				<Text style={styles.infoText}>
					El destino turistico cierra temporalmente a las {destination.DatosDestino.horaDescanso}
				</Text>
		  ));

	// Check if the Destination is a open area to disable the Horarios info
	let isOpenArea = false;
	if (destination.Subcategorium.nombre === 'Monumentos') isOpenArea = true;

	// Check if the Destination has a price section to display it
	let checkCategory = destination.Subcategorium.categoria.nombre;
	let renderPrizes;

	navigation.setOptions({ title: destination.nombre });

	if (checkCategory === 'Gastronomia') {
		renderPrizes = (
			<View style={styles.infoContainer}>
				<View style={styles.textSeparator}>
					<Text style={styles.textPrincipal}>Precios</Text>
				</View>

				{destination.DatosDestino.infoPrecios == null ? (
					<Text style={styles.infoText}>
						El destino turistico actualmente no cuenta con información de precios a proporcionar...
					</Text>
				) : (
					<Text style={styles.infoText}>{destination.DatosDestino.infoPrecios}</Text>
				)}
			</View>
		);
	} else {
		renderPrizes = null;
	}

	const rate = async () => {
		let rating = parseInt(stars);

		axios
			.post(
				`${API_URL}/ranking`,
				{ destinoId: placeID, ranking: rating },
				{ headers: { Authorization: `Bearer ${token}` } }
			)
			.then((response) => {
				console.log(response.data);
				Alert.alert('Ranking creado', 'Gracias por su calificaión, espero y vuelva pronto!');
			})
			.catch(function (error) {
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);
			});
	};

	return (
		<View>
			<StatusBar backgroundColor="#fff" barStyle="black-content" />

			{error ? (
				<View>
					<ServerError />
				</View>
			) : loading ? (
				<View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
					<SkeletonLoaderCarousel />
				</View>
			) : (
				<ScrollView>
					<>
						<CarouselImages
							titleCarousel={destination.nombre}
							titleCarouselStyle={styles.titleCarousel}
							itemCarousel={styles.itemCarousel}
							imageContainerCarousel={styles.imageContainerCarousel}
							imageCarousel={styles.imageCarousel}
							imagesCarousel={destination.Fotos}
						/>
					</>
					<View style={styles.container}>
						{/* Destination status */}
						<View style={styles.status}>
							<View style={styles.statusContainer}>
								<FontAwesome5 name="door-open" size={16} style={{ color: '#0288d1' }} />
								{isClosed}
							</View>

							{isOpenArea ? null : (
								<View style={styles.statusContainer}>
									<FontAwesome5 name="money-bill-wave" size={16} style={{ color: '#0288d1' }} />
									<Text style={styles.infoText}> {destination.DatosDestino.precio}</Text>
								</View>
							)}

							<View style={styles.statusContainer}>
								<MaterialIcons
									style={styles.itemDesc}
									name="star"
									size={16}
									style={{ color: '#FF5F00' }}
								/>
								<MaterialIcons
									style={styles.itemDesc}
									name="star"
									size={16}
									style={{ color: '#FF5F00' }}
								/>
								<MaterialIcons
									style={styles.itemDesc}
									name="star"
									size={16}
									style={{ color: '#FF5F00' }}
								/>
								<MaterialIcons
									style={styles.itemDesc}
									name="star"
									size={16}
									style={{ color: '#FF5F00' }}
								/>
								<MaterialIcons
									style={styles.itemDesc}
									name="star"
									size={16}
									style={{ color: '#FF5F00' }}
								/>
								{destination.DatosDestino.ranking == null ? (
									<Ionicons name="help" size={28} style={styles.infoText} />
								) : (
									<Text style={styles.infoText}> {destination.DatosDestino.ranking}</Text>
								)}
							</View>
						</View>

						{/* Rating container */}
						<View style={styles.ratingContainer}>
							<View style={{ alignItems: 'stretch', width: screenWidth / 2, padding: 5 }}>
								<View style={styles.starsContainer}>
									<StarsRating stars={stars} setStars={setStars} color={'#FF5F00'} size={25} />
								</View>
							</View>

							<PrimaryButton
								buttonTitle="Calificar"
								style={{
									backgroundColor: '#FF5F00',
									width: screenWidth / 2,
									padding: 10,
									alignItems: 'center',
									borderRadius: 5,
									marginRight: 10,
								}}
								onPress={() => {
									rate();
								}}
							/>
						</View>

						{/* Destination info */}
						<View style={styles.destinationContainer}>
							{/* Info container */}
							<View style={styles.infoContainer}>
								<View style={styles.textSeparator}>
									<Text style={styles.textPrincipal}>Información</Text>
								</View>

								{destination.DatosDestino.info == null ? (
									<Text style={styles.infoText}>
										El destino turistico actualmente no cuenta con información a la cual
										proporcionar...
									</Text>
								) : (
									<Text style={styles.infoText}>{destination.DatosDestino.info}</Text>
								)}
							</View>

							{/* Horarios container */}
							{isOpenArea ? (
								<View style={styles.infoContainer}>
									<View style={styles.textSeparator}>
										<Text style={styles.textPrincipal}>Horarios</Text>
									</View>

									<Text style={styles.textSecondary}>El lugar esta abierto las 24 horas.</Text>
								</View>
							) : (
								<View style={styles.infoContainer}>
									<View style={styles.textSeparator}>
										<Text style={styles.textPrincipal}>Horarios</Text>
									</View>

									<Text style={styles.textSecondary}>Lunes a Viernes:</Text>
									<Text style={styles.infoText}>
										{destination.DatosDestino.horaInicio} a {destination.DatosDestino.horaCierre}
									</Text>

									<Text style={styles.textSecondary}>Sábado a Domingo:</Text>
									<Text style={styles.infoText}>
										{destination.DatosDestino.horaInicio} a {destination.DatosDestino.horaCierre}
									</Text>

									{/* Check if the destination has a free day */}
									<View style={{ paddingTop: 20 }} />
									<Text style={styles.textSecondary}>Descanso(s)</Text>
									<Text style={styles.infoText}>{renderDays}</Text>
								</View>
							)}

							{/* Prices container */}
							{renderPrizes}

							{/* Services container */}
							{isOpenArea ? null : (
								<View style={styles.infoContainer}>
									<View style={styles.textSeparator}>
										<Text style={styles.textPrincipal}>Servicios</Text>
									</View>

									<Text style={styles.infoText}>{destination.descripcion}</Text>
								</View>
							)}

							{/* Contact container */}
							<View style={styles.infoContainer}>
								<View style={styles.textSeparator}>
									<Text style={styles.textPrincipal}>Contacto</Text>
								</View>

								{destination.DatosDestino.contactoWhatsap === null ? (
									<View />
								) : (
									<>
										<PrimaryButton
											buttonTitle="Enviar mensaje de WhatsApp"
											style={{
												backgroundColor: '#74c441',
												marginTop: 10,
												width: '100%',
												height: 800 / 15,
												padding: 8,
												alignItems: 'center',
												justifyContent: 'center',
												borderRadius: 3,
											}}
											onPress={() =>
												Linking.openURL(
													'whatsapp://send?text=' +
														WHATSAPP_MESSAGE +
														'&phone=52' +
														destination.DatosDestino.contactoWhatsap
												)
											}
										/>
									</>
								)}
								{destination.DatosDestino.contactoDirecto === null ? (
									<View />
								) : (
									<>
										<PrimaryButton
											buttonTitle="Llamar"
											onPress={() =>
												Linking.openURL('tel:+52' + destination.DatosDestino.contactoDirecto)
											}
										/>
									</>
								)}
								{destination.DatosDestino.urlWebPropia === null ? (
									<View />
								) : (
									<>
										<PrimaryButton
											buttonTitle="Visitar Sitio Web"
											onPress={() => Linking.openURL(destination.DatosDestino.urlWebPropia)}
										/>
									</>
								)}
								{destination.DatosDestino.urlDestino3D === null ? (
									<View />
								) : (
									<>
										<PrimaryButton
											buttonTitle="Tour en línea"
											onPress={() => Linking.openURL(destination.DatosDestino.urlDestino3D)}
										/>
									</>
								)}
							</View>
						</View>
					</View>
				</ScrollView>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	itemCarousel: {
		width: screenWidth,
		height: screenWidth * 0.72,
	},
	imageCarousel: {
		resizeMode: 'cover',
		width: screenWidth,
		height: screenWidth * 0.72,
	},
	imageContainerCarousel: {
		flex: 1,
		marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
		backgroundColor: 'white',
	},
	titleCarousel: {
		fontFamily: fonts.Raleway_700Bold,
		position: 'absolute',
		marginTop: screenWidth * 0.48,
		marginLeft: 5,
		color: '#ffffff',
		fontSize: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0.8, height: 0.8 },
		shadowOpacity: 0.6,
		shadowRadius: 3,
		textShadowColor: 'black',
		textShadowOffset: { width: -1, height: 0 },
		textShadowRadius: 10,
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignSelf: 'center',
	},
	image: {
		resizeMode: 'stretch',
		width: screenWidth,
		height: screenWidth * 0.5,
	},
	textPrincipal: {
		fontFamily: fonts.Raleway_700Bold,
		fontSize: 28,
		color: '#005b9f',
	},
	textSecondary: {
		fontFamily: fonts.Raleway_400Regular,
		fontSize: 22,
		fontWeight: '500',
		color: '#0288d1',
	},
	textSeparator: {
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
		borderTopColor: '#ccc',
		borderTopWidth: 1,
		paddingBottom: 12,
		paddingTop: 12,
		marginBottom: 20,
	},
	status: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
		marginBottom: 10,
		marginHorizontal: 10,
	},
	statusContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		marginTop: 10,
		marginBottom: 10,
	},
	destinationContainer: {
		marginBottom: 10,
		padding: 10,
	},
	infoContainer: {
		paddingBottom: 20,
	},
	infoText: {
		fontFamily: fonts.Raleway_400Regular,
		color: '#8f8f8f',
		fontSize: 18,
		lineHeight: 30,
	},
	buttonContainer: {
		backgroundColor: '#2c76cc',
		padding: 10,
		borderRadius: 3,
		alignItems: 'center',
		alignSelf: 'stretch',
	},
	starsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignSelf: 'stretch',
	},
});
