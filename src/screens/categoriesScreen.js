import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image, AsyncStorage } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';

import { API_URL } from '../../env/API_URL';
import { BASIC_URL } from '../../env/BASIC_URL';
import ServerError from '../components/errorScreen';
import SkeletonLoaderCards from '../components/skeletonLoaderCards';
import { fonts } from '../../assets/fonts';

const { width, height } = Dimensions.get('window');

const Category = ({ item, onPress, colors, idx }) => {
	const index = idx.toString();
	const color = colors[index[index.length - 1]];

	let checkStatus = item.status;
	if (checkStatus === true) {
		return (
			<TouchableOpacity onPress={onPress}>
				<View style={[styles.cardView, { backgroundColor: color }]}>
					<Image
						style={styles.image}
						source={{ uri: `${BASIC_URL}` + item.urlImg }}
						defaultSource={require('../../assets/image-missing.png')}
					/>
					<View style={styles.textView}>
						<Text style={styles.itemTitle}> {item.nombre}</Text>
						<Text style={styles.itemDescription}>{item.descripcion}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	} else {
		return null;
	}
};

export function CategoriesScreen({ navigation }) {
	const [userToken, setUserToken] = useState('');
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const header = `Bearer ${userToken}`;

	useEffect(() => {
		const retrieveToken = async () => {
			try {
				const token = await AsyncStorage.getItem('userToken');
				if (token !== null) {
					// console.log(token);
					setUserToken(token);
				}
			} catch (error) {
				console.log(error);
			}
		};

		retrieveToken();

		axios
			.get(`${API_URL}/category`, { headers: { Authorization: header } })
			.then((response) => {
				setCategories(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error('ERROR CATEGORIAS: ' + error);
				setError(true);
			});
	}, [userToken]);

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
				<ScrollView showsVerticalScrollIndicator={false}>
					{categories.map((object, idx) => {
						return (
							<Category
								idx={idx}
								item={object}
								onPress={() =>
									navigation.navigate('SubcategoryScreen', {
										// Params to send
										categoryName: object.nombre,
										categoryId: object.id,
									})
								}
								style={{ margin: 10 }}
								colors={[
									'#e73935',
									'#ff7043',
									'#fff176',
									'#66bb6a',
									'#1cb997',
									'#64b5f6',
									'#003da3',
									'#8447c9',
									'#e96190',
									'#000',
								]}
							/>
						);
					})}
				</ScrollView>
			)}
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	cardView: {
		flex: 1,
		width: width - 20,
		height: height / 3,
		backgroundColor: 'white',
		margin: 10,
		borderRadius: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0.5, height: 0.5 },
		shadowOpacity: 0.2,
		shadowRadius: 3,
		elevation: 5,
		justifyContent: 'center',
	},
	textView: {
		position: 'absolute',
		margin: 10,
		alignContent: 'center',
		alignSelf: 'center',
		alignItems: 'center',
		textAlign: 'center',
	},
	image: {
		width: width - 20,
		height: height / 3,
		borderRadius: 4,
		opacity: 0.6,
	},
	itemTitle: {
		fontFamily: fonts.Raleway_700Bold,
		color: 'white',
		fontSize: 24,
		shadowColor: '#ccc',
		shadowOffset: { width: 0.8, height: 0.8 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		marginBottom: 5,
		textShadowColor: 'black',
		textShadowOffset: { width: -1, height: 0 },
		textShadowRadius: 10,
	},
	itemDescription: {
		fontFamily: fonts.Raleway_400Regular,
		color: 'white',
		fontSize: 14,
		shadowColor: '#000',
		shadowOffset: { width: 0.8, height: 0.8 },
		shadowOpacity: 0.6,
		shadowRadius: 3,
		textShadowColor: 'black',
		textShadowOffset: { width: -1, height: 0 },
		textShadowRadius: 10,
	},
});
