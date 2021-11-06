import React, { useState, useEffect } from 'react';
import { View, Image, Dimensions, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

import { fonts } from '../../assets/fonts';
import ServerError from '../components/errorScreen';
import { BASIC_URL } from '../../env/BASIC_URL';
import { API_URL } from '../../env/API_URL';
import SkeletonLoaderCarousel from '../components/skeletonLoaderCarousel';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const New = ({ item, navigation }) => {
	let photo = `${BASIC_URL}` + item.urlimagen;
	let datePublished = item.createdAt;
	let dateNew = new Date(datePublished);
	let newInfo;

	if (item.info === null) {
		newInfo = 'Error al cargar la información de la noticia...';
	} else {
		newInfo = item.info;
	}

	return (
		<View>
			<View style={{ height: 250, backgroundColor: '#ccc', position: 'relative' }}>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'flex-start',
						position: 'absolute',
						top: 40,
						width: '100%',
						paddingHorizontal: 25,
						zIndex: 2,
					}}
				>
					<MaterialIcons
						name="arrow-back-ios"
						color="#fff"
						size={18}
						style={{
							textShadowColor: '#0000004d',
							textShadowOffset: { width: 0, height: 2 },
							textShadowRadius: 3,
						}}
					/>
				</TouchableOpacity>

				<Image
					source={{ uri: photo }}
					style={styles.imageNew}
					defaultSource={require('../../assets/image-missing.png')}
				/>
			</View>

			{/*New info*/}
			<View
				style={{
					padding: 24,
					borderTopEndRadius: 30,
					borderTopStartRadius: 30,
					backgroundColor: '#fff',
					marginTop: -20,
					height: screenHeight,
				}}
			>
				<Text style={{ fontSize: 22, fontFamily: fonts.Raleway_700Bold }}>{item.nombre}</Text>

				<View>
					<View style={{ marginBottom: 12 }}>
						<Text style={{ fontSize: 16, fontFamily: fonts.Raleway_400Regular_Italic, opacity: 0.4 }}>
							{dateNew.toDateString()} — {item.categoria}
						</Text>
					</View>

					<View>
						<Text
							style={{
								fontFamily: fonts.Raleway_400Regular,
								fontSize: 12,
								opacity: 0.7,
								marginBottom: 8,
							}}
						>
							{newInfo}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

export function DetailedNewScreen({ route, navigation }) {
	// Get params from newsScreen
	const { newID } = route.params;

	const [infoNew, setInfoNew] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			async function getNews() {
				try {
					let response = await axios.get(`${API_URL}/news/${newID}`);

					if (response.status !== 200) {
						throw new Error('HTTP error! status: ' + response.status);
					}

					setInfoNew([response.data]);
					setLoading(false);
				} catch (error) {
					console.log(error);
					setError(true);
				}
			}
			getNews();
		}, 1800);
	}, []);

	const renderDestination = ({ item }) => {
		return <New item={item} navigation={navigation} />;
	};

	return (
		<View>
			<StatusBar backgroundColor="#0000001A" barStyle="black-content" />

			{error ? (
				<ServerError />
			) : loading ? (
				<View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
					<SkeletonLoaderCarousel />
				</View>
			) : (
				<FlatList data={infoNew} renderItem={renderDestination} showsVerticalScrollIndicator={false} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	imageNew: {
		width: screenWidth,
		height: screenWidth * 0.8,
		resizeMode: 'cover',
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignSelf: 'center',
	},
	image: {
		resizeMode: 'cover',
		width: screenWidth,
		height: screenWidth * 0.5,
	},
	infoContainer: {
		paddingBottom: 20,
	},
	infoText: {
		color: '#8f8f8f',
		fontSize: 18,
		lineHeight: 30,
	},
});
