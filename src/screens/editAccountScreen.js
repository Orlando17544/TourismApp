import React, { useState, useEffect, useContext } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	Platform,
	StyleSheet,
	ScrollView,
	AsyncStorage,
	Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, MaterialIcons } from 'react-native-vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import { AuthContext } from '../utils';
import { BASIC_URL } from '../../env/BASIC_URL';
import { API_URL } from '../../env/API_URL';
import FormInput from '../components/formInput';
import PrimaryButton from '../components/primaryButton';
import SecundaryButton from '../components/secundaryButton';
import TitleText from '../components/titleText';
import { fonts } from '../../assets/fonts';

export function EditAccountScreen({ navigation }) {
	const [mode, setMode] = useState('date');
	const [show, setShow] = useState(false);
	const [date, setDate] = useState(new Date());
	const [userToken, setUserToken] = useState('');
	const [user, setUser] = useState({});
	const [emailChange, SetEmailChange] = useState('');
	const [editAlert, setEditAlert] = useState(false);
	const [editAlertEmail, setEditAlertEmail] = useState(false);
	const [error, setError] = useState(false);

	const { signOut } = useContext(AuthContext);

	const changeUser = (name, value) => {
		setUser({
			...user,
			[name]: value,
		});
	};

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === 'ios');
		setDate(currentDate);
	};

	const showMode = (currentMode) => {
		setShow(true);
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showMode('date');
	};

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

		const header = `Bearer ${userToken}`;

		axios
			.get(`${API_URL}/usuario/self`, { headers: { Authorization: header } })
			.then((response) => {
				console.log('INFO USER EDIT: ', response.data);
				SetEmailChange(response.data.email);
				setUser(response.data);
			})
			.catch((error) => {
				console.log('EDIT TOKEN: ', error);
			});
	}, [userToken]);

	const editUserInfo = async () => {
		// Get the correct date
		let cleanDate = date.toISOString();
		let diffDate = cleanDate.split('T')[0];
		let formattingDate = diffDate.split('-');
		let correctDay = parseInt(formattingDate[2] - 1);
		let correctDate = `${formattingDate[0]}-${formattingDate[1]}-${correctDay}`;

		const config = {
			headers: { Authorization: `Bearer ${userToken}` },
		};

		axios
			.post(
				`${API_URL}/usuario/update`,
				{
					user: {
						username: user.username,
						email: user.email,
						telefono: user.telefono,
						direccion: user.direccion,
						fechaNacimiento: correctDate,
					},
				},
				config
			)
			.then((response) => {
				if (emailChange !== user.email) {
					//Notfiy the user that the change was made and to check his email
					editEmail();
				} else {
					//Notfiy the user that the change was made
					setEditAlert(true);
				}
			})
			.catch((response) => {
				console.log('ERROR EDITAR PERFIL', response);
				setError(true);
				setEditAlert(true);
			});
	};

	const editUserPhoto = async (source) => {
		const config = {
			headers: { Authorization: `Bearer ${userToken}` },
		};

		axios
			.post(`${API_URL}/usuario/upload-profile-image`, { image: source }, config)
			.then((response) => {
				console.log(response);

				//Notfiy the user that the change was made
				setEditAlert(true);
			})
			.catch((response) => {
				console.log('Error Imagen: ', response);
				setError(true);
				setEditAlert(true);
			});
	};

	const editEmail = async () => {
		const config = {
			headers: { Authorization: `Bearer ${userToken}` },
		};

		axios
			.post(`${API_URL}/usuario/update-email`, { email: user.email }, config)
			.then((response) => {
				// console.log('Correo cambiado...', response);
				setEditAlertEmail(true);
			})
			.catch((error) => {
				console.log('ERROR AL CAMBIAR CORREO', error);
			});
	};

	//Image picker functions
	useEffect(() => {
		const permissions = async () => {
			if (Platform.OS !== 'web') {
				const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('Favor de dar los permisos para poder seleccionar una imagen!');
				}
			}
		};
		permissions();
	}, []);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
			base64: true,
			storageOptions: {
				skipBackup: true,
			},
		});

		if (!result.cancelled) {
			let source = 'data:image/jpeg;base64,' + [result.base64];
			changeUser('image', source);
			editUserPhoto(source);
		}
	};

	let photoUser = `${BASIC_URL}` + user.fotoPath;

	return (
		<>
			<StatusBar backgroundColor="#fff" barStyle="black-content" />

			{/* Modal to notify the user that the changes were made to the user info */}
			{error === true ? (
				<Modal animationType="slide" transparent={true} visible={editAlert}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>
								Hubo un error al modificar tus datos, favor de intentarlo más tarde...
							</Text>
							<PrimaryButton
								buttonTitle="Aceptar"
								onPress={() => {
									setEditAlert(!editAlert);
								}}
							/>
						</View>
					</View>
				</Modal>
			) : (
				<>
					<Modal animationType="slide" transparent={true} visible={editAlert}>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Text style={styles.modalText}>Datos modificados con éxito!</Text>
								<PrimaryButton
									buttonTitle="Aceptar"
									onPress={() => {
										setEditAlert(!editAlert);
									}}
								/>
							</View>
						</View>
					</Modal>

					<Modal animationType="slide" transparent={true} visible={editAlertEmail}>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<Text style={styles.modalText}>Datos modificados con éxito!</Text>
								<Text style={styles.modalSubtext}>Si modificaste tu correo, verifica el correo!</Text>
								<PrimaryButton
									buttonTitle="Aceptar"
									onPress={() => {
										setEditAlertEmail(!editAlertEmail);
										signOut();
									}}
								/>
							</View>
						</View>
					</Modal>
				</>
			)}

			<ScrollView contentContainerStyle={styles.container}>
				<TitleText text="Editar Información" />
				{/* Profile Image */}
				<View style={{ alignSelf: 'center', marginBottom: 25 }}>
					<View style={styles.profileImage}>
						<Image
							source={{ uri: photoUser }}
							style={{ width: 200, height: 200 }}
							defaultSource={require('../../assets/image-missing.png')}
						/>
						{user.image && <Image source={{ uri: user.image }} style={{ width: 200, height: 200 }} />}
					</View>

					<TouchableOpacity onPress={pickImage} style={{ paddingBottom: 32, bottom: 10 }}>
						<View style={styles.add}>
							<MaterialIcons
								name="add-photo-alternate"
								size={28}
								color="#fff"
								style={{ marginLeft: 1 }}
							/>
						</View>
					</TouchableOpacity>
				</View>
				{/* Name form */}
				<FormInput
					labelValue={user.username}
					onChangeText={(text) => changeUser('username', text)}
					placeholderText="Nombre completo"
					iconType="user"
					autoCorrect={true}
				/>

				{/* Email form */}
				<FormInput
					labelValue={user.email}
					onChangeText={(text) => changeUser('email', text)}
					placeholderText="Correo Electronico"
					iconType="mail"
					keyboardType="email-address"
					autoCorrect={false}
				/>
				{/* Phone form */}
				<FormInput
					labelValue={user.telefono}
					onChangeText={(text) => changeUser('telefono', text)}
					placeholderText="Número de teléfono"
					iconType="phone"
					numberOfLines={1}
					keyboardType="number-pad"
				/>
				{/* Dirección form */}
				<FormInput
					labelValue={user.direccion}
					onChangeText={(text) => changeUser('direccion', text)}
					placeholderText="Dirección"
					numberOfLines={1}
					iconType="home"
				/>
				{/* DatePicker form */}
				<SecundaryButton buttonTitle="Ingrese su fecha de nacimiento" onPress={showDatepicker} />
				{show && (
					<DateTimePicker
						testID="dateTimePicker"
						value={date}
						mode={mode}
						onChange={onChange}
						display="spinner"
						style={{ width: '90%' }}
					/>
				)}
				{/* Edit button */}
				<PrimaryButton buttonTitle="Modificar Información" onPress={editUserInfo} />
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		fontFamily: fonts.Raleway_400Regular,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		paddingTop: 50,
	},
	logo: {
		height: 150,
		width: 150,
		resizeMode: 'cover',
	},
	image: {
		flex: 1,
		height: undefined,
		width: undefined,
	},
	profileImage: {
		width: 200,
		height: 200,
		borderRadius: 100,
		overflow: 'hidden',
	},
	add: {
		backgroundColor: '#41444B',
		position: 'absolute',
		bottom: 0,
		right: 0,
		width: 52,
		height: 52,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
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
		fontFamily: fonts.Raleway_700Bold,
		marginBottom: 15,
		textAlign: 'center',
		fontSize: 25,
	},
	modalSubtext: {
		fontFamily: fonts.Raleway_400Regular,
		marginBottom: 15,
		textAlign: 'center',
		fontSize: 25,
	},
});
