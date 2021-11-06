import React, { useState, useEffect } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Image,
	StyleSheet,
	TextInput,
	ScrollView,
	Dimensions,
	AsyncStorage,
	Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Entypo, MaterialIcons, Feather, MaterialCommunityIcons } from 'react-native-vector-icons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import axios from 'axios';

import { AuthContext } from '../utils';
import { API_URL } from '../../env/API_URL';
import PrimaryButton from '../components/primaryButton';
import SkeletonLoaderProfile from '../components/skeletonLoaderProfile';
import { BASIC_URL } from '../../env/BASIC_URL';
import { fonts } from '../../assets/fonts';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export function ProfileScreen({ navigation }) {
	const [loading, setLoading] = useState(true);
	const [userToken, setUserToken] = useState('');
	const [deleteAlert, setDeleteAlert] = useState(false);
	const [userInfo, setUserInfo] = useState({
		direccion: '',
		email: '',
		fechaNacimiento: '',
		fotoPath: '',
		passwordUpdatedAt: '',
		role: '',
		status: '',
		telefono: '',
		username: '',
	});

	const { signOut } = React.useContext(AuthContext);
	let menu = null;

	const setMenuRef = (ref) => {
		menu = ref;
	};

	const hideMenu = () => {
		menu.hide();
	};

	const showMenu = () => {
		menu.show();
	};

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Menu
					ref={setMenuRef}
					button={
						<TouchableOpacity onPress={showMenu}>
							<Entypo name="dots-three-vertical" size={22} color="#000" style={styles.menuIcon} />
						</TouchableOpacity>
					}
				>
					<MenuItem
						onPress={() => {
							menu.hide();
							navigation.navigate('ChangePasswordUserLogged');
						}}
					>
						Cambiar contraseña
					</MenuItem>
					<MenuItem
						onPress={() => {
							menu.hide();
							navigation.navigate('EditAccountScreen');
						}}
					>
						Editar perfil
					</MenuItem>
					<MenuDivider />
					<MenuItem onPress={() => setDeleteAlert(true)}>Dar de baja la cuenta</MenuItem>
				</Menu>
			),
		});
	}, [navigation]);

	const retrieveToken = async () => {
		try {
			const token = await AsyncStorage.getItem('userToken');
			if (token !== null) {
				// console.log(token);
				setUserToken(token);
			}
		} catch (error) {
			// console.log(error);
		}
	};

	retrieveToken();

	const header = `Bearer ${userToken}`;

	useEffect(() => {
		axios
			.get(`${API_URL}/usuario/self`, { headers: { Authorization: header } })
			.then((response) => {
				setUserInfo(response.data);
				setLoading(false);
			})
			.catch((error) => {
				// console.error('PERFIL: ', error);
			});
	}, [userToken]);

	let photo = `${BASIC_URL}` + userInfo.fotoPath;

	//Check the user data to show the correct info
	//Check if the user has a profile photo
	let hasPhoto;

	if (userInfo.fotoPath === null) {
		hasPhoto = (
			<View style={{ marginVertical: 20, marginHorizontal: 20, alignSelf: 'center' }}>
				<View style={{ alignSelf: 'center' }}>
					<Image source={require('../../assets/profileUser.png')} style={styles.profileImage} />
				</View>

				<View>
					<Text
						style={{ color: '#fff', fontSize: 22, fontFamily: fonts.Raleway_700Bold, textAlign: 'center' }}
					>
						{userInfo.username}
					</Text>
				</View>
				<View
					style={{ flexDirection: 'row', alignContent: 'center', alignSelf: 'center', alignItems: 'center' }}
				>
					<MaterialIcons name="email" size={20} style={{ marginRight: 5, color: '#fff' }} />
					<Text style={{ color: '#fff', fontSize: 16, fontFamily: fonts.Raleway_400Regular }}>
						{userInfo.email}
					</Text>
				</View>
			</View>
		);
	} else {
		hasPhoto = (
			<View style={{ marginVertical: 20, marginHorizontal: 20, alignSelf: 'center' }}>
				<View style={{ alignSelf: 'center' }}>
					<Image
						source={{ uri: photo }}
						style={styles.profileImage}
						defaultSource={require('../../assets/image-missing.png')}
					/>
				</View>

				<View>
					<Text
						style={{ color: '#fff', fontSize: 22, fontFamily: fonts.Raleway_700Bold, textAlign: 'center' }}
					>
						{userInfo.username}
					</Text>
				</View>
				<View
					style={{ flexDirection: 'row', alignContent: 'center', alignSelf: 'center', alignItems: 'center' }}
				>
					<MaterialIcons name="email" size={22} style={{ marginRight: 5, color: '#fff' }} />
					<Text
						style={{
							color: '#fff',
							fontSize: 16,
							alignContent: 'center',
							fontFamily: fonts.Raleway_400Regular,
						}}
					>
						{userInfo.email}
					</Text>
				</View>
			</View>
		);
	}

	//Check if the user has a phone
	let hasPhone;

	if (userInfo.telefono === null) {
		hasPhone = (
			<>
				<Feather name="phone" size={22} style={styles.iconField} />
				<Text style={styles.textField}>Vacio...</Text>
			</>
		);
	} else {
		hasPhone = (
			<>
				<Feather name="phone" size={30} style={styles.iconField} />
				<Text style={styles.textField}>{userInfo.telefono}</Text>
			</>
		);
	}

	//Check if the user has an address
	let hasAddress;

	if (userInfo.direccion === null) {
		hasAddress = (
			<>
				<Feather name="map-pin" size={30} style={styles.iconField} />
				<Text style={styles.textField}>Vacio...</Text>
			</>
		);
	} else {
		hasAddress = (
			<>
				<Feather name="map-pin" size={30} style={styles.iconField} />
				<Text style={styles.textField} numberOfLines={0}>
					{userInfo.direccion}
				</Text>
			</>
		);
	}

	//Check if the user set the birthdate
	let birthSet;

	if (userInfo.fechaNacimiento === null) {
		birthSet = (
			<>
				<Feather name="calendar" size={30} style={styles.iconField} />
				<Text style={styles.textField}>Vacio...</Text>
			</>
		);
	} else {
		birthSet = (
			<>
				<Feather name="calendar" size={30} style={styles.iconField} />
				<Text style={styles.textField}>{userInfo.fechaNacimiento}</Text>
			</>
		);
	}

	return (
		<View>
			{loading ? (
				<View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
					<SkeletonLoaderProfile />
				</View>
			) : (
				<>
					<StatusBar backgroundColor="#fff" barStyle="dark-content" />

					<Modal animationType="slide" transparent={true} visible={deleteAlert}>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Text style={styles.modalText}>
									Esta apunto de dar de baja su cuenta... Seguro que quiere realizar esta acción?
								</Text>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ paddingHorizontal: 10 }}>
										<PrimaryButton
											buttonTitle="Eliminar"
											onPress={() => {
												axios
													.delete(`${API_URL}/usuario/delete`, {
														headers: { Authorization: header },
													})
													.then((response) => {
														console.log(response);
													})
													.catch((response) => {
														console.error(response);
													});

												signOut();
											}}
										/>
									</View>

									<View
										style={{
											justifyContent: 'center',
											alignItems: 'center',
											alignContent: 'center',
											alignSelf: 'center',
										}}
									>
										<Text
											style={{
												fontWeight: 'bold',
												fontSize: 18,
												marginTop: 10,
												color: '#000',
												opacity: 0.5,
											}}
											onPress={() => setDeleteAlert(!deleteAlert)}
										>
											Cancelar
										</Text>
									</View>
								</View>
							</View>
						</View>
					</Modal>

					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={styles.container}>
							<View style={styles.backgroundColor}>{hasPhoto}</View>

							<View style={styles.profileDataContainer}>
								<View style={styles.fieldContainer}>{hasPhone}</View>

								<View style={styles.fieldContainer}>{hasAddress}</View>
								<View style={styles.fieldContainer}>{birthSet}</View>
								<TouchableOpacity style={styles.fieldContainer} onPress={signOut}>
									<MaterialCommunityIcons
										name="exit-to-app"
										size={32}
										style={styles.logoutIconField}
									/>
									<Text style={styles.logoutText}>Cerrar sesión</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ScrollView>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	menuIcon: {
		paddingRight: 15,
	},
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginBottom: 5,
	},
	backgroundColor: {
		backgroundColor: '#FF5F00',
		width: screenWidth,
		height: 240,
	},
	profileImage: {
		width: 120,
		height: 120,
		borderRadius: 120,
		borderColor: '#c64800',
		borderWidth: 3,
	},
	profileDataContainer: {
		width: screenWidth,
	},
	fieldContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginTop: 25,
		marginHorizontal: 25,
		paddingBottom: 25,
		borderBottomColor: '#cdcdcd',
		borderBottomWidth: 1,
	},
	iconField: {
		color: '#093671',
		marginRight: 10,
		alignContent: 'center',
		alignSelf: 'center',
	},
	textField: {
		fontFamily: fonts.Raleway_400Regular,
		color: '#01132b',
		fontSize: 25,
		alignSelf: 'center',
	},
	logoutIconField: {
		color: '#c41c0d',
		marginRight: 10,
	},
	logoutText: {
		fontFamily: fonts.Raleway_400Regular,
		color: '#d84134',
		fontSize: 25,
		alignSelf: 'center',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 5,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	modalText: {
		fontFamily: fonts.Raleway_400Regular,
		marginBottom: 15,
		textAlign: 'center',
		fontSize: 20,
	},
});
