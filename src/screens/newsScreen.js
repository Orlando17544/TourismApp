import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

import { API_URL } from '../../env/API_URL';
import { BASIC_URL } from '../../env/BASIC_URL';
import ServerError from '../components/errorScreen';
import { fonts } from '../../assets/fonts';

import SkeletonLoaderCards from '../components/skeletonLoaderCards';

const NewCard = ({ item, onPress }) => {
	let datePublished = item.createdAt;
	let dateNew = new Date(datePublished);
	let newInfo;

	if (item.info === null) {
		newInfo = 'Error al cargar la información de la noticia...';
	} else {
		newInfo = item.info;
	}

	return (
		<TouchableOpacity onPress={onPress}>
			<View style={styles.cardsWrapper}>
				<View style={styles.card}>
					<View style={styles.cardImgWrapper}>
						<View style={styles.imageCard}>
							<Image
								style={styles.cardImg}
								resizeMode="cover"
								source={{ uri: `${BASIC_URL}` + item.urlimagen }}
								defaultSource={require('../../assets/image-missing.png')}
							/>
						</View>
					</View>

					<View style={styles.cardInfo}>
						<Text style={styles.cardTitle} numberOfLines={3} ellipsizeMode="tail">
							{item.nombre}
						</Text>

						<View>
							<Text style={styles.newInfo}>
								{dateNew.toDateString()} - {item.categoria}
							</Text>
						</View>

						<Text style={styles.newDescription} numberOfLines={5} ellipsizeMode="tail">
							{newInfo}
						</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export function NewsScreen({ navigation }) {
	const [news, setNews] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		async function getNews() {
			try {
				let response = await axios.get(`${API_URL}/news`);

				setNews(response.data);
				setLoading(false);
			} catch (error) {
				console.log(error);
				setError(true);
			}
		}
		getNews();
	}, []);

	const refreshNews = () => {
		setRefresh(true);

		axios
			.get(`${API_URL}/news`)
			.then(function (res) {
				console.log('Refreshed!');
				setNews(res.data);
				setRefresh(false);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const renderNew = ({ item }) => {
		return (
			<NewCard
				item={item}
				onPress={() => {
					navigation.navigate('DetailedNewScreen', {
						newID: item.id,
					});
				}}
			/>
		);
	};

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor="#fff" barStyle="black-content" />

			{error ? (
				<ServerError />
			) : loading ? (
				<View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
					<SkeletonLoaderCards />
				</View>
			) : (
				<FlatList
					data={news.sort(function (a, b) {
						return new Date(b.createdAt) - new Date(a.createdAt);
					})}
					renderItem={renderNew}
					showsVerticalScrollIndicator={false}
					refreshing={refresh}
					onRefresh={refreshNews}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	cardsWrapper: {
		width: '95%',
		alignSelf: 'center',
	},
	card: {
		height: 180,
		marginVertical: 6,
		flexDirection: 'row',
		shadowColor: '#999',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.5,
		shadowRadius: 4,
		elevation: 5,
		flexWrap: 'wrap',
		overflow: 'hidden',
	},
	cardImgWrapper: {
		flex: 2,
	},
	cardImg: {
		height: '100%',
		width: '100%',
		alignSelf: 'center',
		resizeMode: 'cover',
		borderRadius: 2,
		borderBottomRightRadius: 0,
		borderTopRightRadius: 0,
	},
	cardInfo: {
		flex: 3,
		padding: 10,
		borderBottomRightRadius: 4,
		borderTopRightRadius: 4,
		backgroundColor: '#fff',
	},
	cardTitle: {
		fontFamily: fonts.Raleway_700Bold,
		fontSize: 16,
	},
	newInfo: {
		fontFamily: fonts.Raleway_400Regular_Italic,
		color: '#666',
		fontSize: 14,
	},
	newDescription: {
		fontFamily: fonts.Raleway_400Regular,
		fontSize: 12,
	},
});
