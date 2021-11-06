import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList, StyleSheet, AsyncStorage } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from 'react-native-vector-icons';
import axios from 'axios';
import { API_URL } from '../../env/API_URL';
import { fonts } from '../../assets/fonts';

const SubCategory = ({ item, onPress }) => (
	<TouchableOpacity onPress={onPress}>
		<View style={styles.itemContainer}>
			<View style={styles.arrowItem}>
				<Text style={styles.itemTitle}>{item.nombre}</Text>
				<AntDesign name="right" size={18} style={styles.arrow} />
			</View>
			{/*Le cambié el item.total por que el endpoint no tiene esa información*/}
			<Text style={styles.itemTotal}>{item.descripcion}</Text>
		</View>
	</TouchableOpacity>
);

export function SubcategoryScreen({ route, navigation }) {
	const [error, setError] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [userToken, setUserToken] = useState('');
	const [selectedId, setSelectedId] = useState(null);
	const [subcategories, setSubcategories] = useState(null);

	// Get the param from categories
	const { categoryName, categoryId } = route.params;

	// Set the header title
	navigation.setOptions({ title: categoryName });

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
			.post(`${API_URL}/subcategory/son/?id=` + categoryId, { headers: { Authorization: header } })
			.then((response) => {
				setSubcategories(response.data);
			})
			.catch((error) => {
				console.error('ERROR SUBCATEGORIAS: ' + error);
				setError(true);
			});
	}, [userToken]);

	const refreshSubcat = () => {
		setRefresh(true);

		axios
			.post(`${API_URL}/subcategory/son/?id=` + categoryId, { headers: { Authorization: header } })
			.then((response) => {
				console.log('Refreshed!');
				setSubcategories(response.data);
				setRefresh(false);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const renderItem = ({ item }) => {
		return (
			<SubCategory
				item={item}
				onPress={() => {
					// setSelectedId(item.id);
					navigation.navigate('PlacesScreen', {
						subcategoryId: item.id,
						subcategoryName: item.nombre,
					});
				}}
				style={{ margin: 10 }}
			/>
		);
	};

	return (
		<>
			<StatusBar backgroundColor="#fff" barStyle="black-content" />

			<View style={styles.container}>
				<FlatList
					data={subcategories}
					renderItem={renderItem}
					keyExtractor={(item) => item.id}
					extraData={selectedId}
					refreshing={refresh}
					onRefresh={refreshSubcat}
					showsVerticalScrollIndicator={false}
				/>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 15,
	},
	itemContainer: {
		marginHorizontal: 30,
		marginVertical: 15,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
	},
	arrowItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	itemTitle: {
		fontFamily: fonts.Raleway_700Bold,
		fontSize: 28,
	},
	itemTotal: {
		fontFamily: fonts.Raleway_400Regular,
		fontSize: 16,
		opacity: 0.7,
		paddingBottom: 20,
	},
	arrow: {
		marginTop: 15,
		opacity: 0.3,
	},
});
