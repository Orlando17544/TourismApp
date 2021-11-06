import React, { useState, useEffect } from 'react';
import {
	View,
	TouchableOpacity,
	TouchableHighlight,
	StyleSheet,
	ScrollView,
	Image,
	Platform,
	Text,
	Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, FontAwesome } from 'react-native-vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

import { API_URL } from '../../env/API_URL';
import FormInput from '../components/formInput';
import PrimaryButton from '../components/primaryButton';
import SecundaryButton from '../components/secundaryButton';
import TitleText from '../components/titleText';
import { fonts } from '../../assets/fonts';

export function RegisterScreen({ navigation }) {
	const [mode, setMode] = useState('date');
	const [show, setShow] = useState(false);
	const [date, setDate] = useState(new Date());
	const [user, setUser] = useState({});
	const [confirmPass, setConfirmPass] = useState('');
	const [modalConfirmation, setModalConfirmation] = useState(false);
	const [modalError, setModalError] = useState(false);
	const [modalEmail, setModalEmail] = useState(false);
	const [isEmailValid, setEmailValid] = useState(true);
	const [isPasswordValid, setPasswordValid] = useState(true);
	const [isConfirmPasswordValid, setConfirmPasswordValid] = useState(true);
	const [isPhoneNumberValid, setPhoneNumberValid] = useState(true);

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

	const registerUser = async () => {
		// Parse the date to a String and correct the day of it
		let cleanDate = date.toISOString();
		let diffDate = cleanDate.split('T')[0];
		let formattingDate = diffDate.split('-');
		let correctDay = parseInt(formattingDate[2] - 1);
		let correctDate = `${formattingDate[0]}-${formattingDate[1]}-${correctDay}`;

		console.log(correctDate);

		const body = {
			user: {
				...user,
				username: user.name,
				fechaNacimiento: correctDate,
			},
			image: user.image,
		};
		console.log(body);

		axios
			.post(`${API_URL}/usuario/registro/user`, body)
			.then((response) => {
				console.log(response.data);
				setModalConfirmation(true);
			})
			.catch(function (error) {
				console.log(error.response.data);
				console.log(error.response.status);
				console.log(error.response.headers);

				// setModalError(true);

				if (error.response.status === 409) {
					console.log(error.response.data);
					setModalEmail(true);
				} else {
					console.log('ERROR REGISTRO: ' + error);
					setModalError(true);
				}
			});
	};

	//Image picker functions
	useEffect(() => {
		const permissions = async () => {
			if (Platform.OS !== 'web') {
				const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('Sorry, we need camera roll permissions to make this work!');
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
		}
	};

	function handleValidEmail(email) {
		var re = /^[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
		//Extracted from https://regular-expressions.mobi/email.html?wlr=1
		if (re.test(email.trim())) {
			setEmailValid(true);
		} else {
			setEmailValid(false);
		}
	}

	function handleValidPassword(password) {
		var reNumber = /\d/;
		var reLower = /[a-z]/;
		var reUpper = /[A-Z]/;
		if (password.length >= 8 && reNumber.test(password) && reLower.test(password) && reUpper.test(password)) {
			setPasswordValid(true);
		} else {
			setPasswordValid(false);
		}
	}

	function handleValidConfirmPassword(confirmPassword) {
		if (user.password === confirmPassword) {
			setConfirmPasswordValid(true);
		} else {
			setConfirmPasswordValid(false);
		}
	}

	function handleValidPhoneNumber(phoneNumber) {
		if (phoneNumber.length >= 9 && phoneNumber.length <= 11) {
			//https://www.clavelada.com.mx/mexico/claves-lada/
			setPhoneNumberValid(true);
		} else {
			setPhoneNumberValid(false);
		}
	}

	return (
		<>
			<StatusBar backgroundColor="#fff" barStyle="black-content" />
			<ScrollView contentContainerStyle={styles.container}>
				{/* Modals are hidden until the hook changes the state of them */}
				<Modal animationType="slide" transparent={true} visible={modalConfirmation}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>
								Favor de checar su correo electrónico ingresado anteriormente, así podremos verificar su
								cuenta...
							</Text>

							<TouchableHighlight
								style={styles.openButton}
								onPress={() => {
									setModalConfirmation(!setModalConfirmation);
									navigation.goBack();
								}}
							>
								<Text style={styles.textStyle}>Aceptar</Text>
							</TouchableHighlight>
						</View>
					</View>
				</Modal>

				<Modal animationType="slide" transparent={true} visible={modalEmail}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Image style={styles.imageModal} source={require('../../assets/registerError.png')} />

							<Text
								style={{
									justifyContent: 'center',
									fontSize: 15,
									fontWeight: 'bold',
									textAlign: 'center',
									marginBottom: 10,
								}}
							>
								Ya existe un usuario registrado con este email, revise su correo de confirmacion o si
								tenia una cuenta y la ha eliminado solicite que le reenvien un correo de activacion
							</Text>

							<TouchableHighlight
								style={{ ...styles.openButton, backgroundColor: '#bf2635' }}
								onPress={() => {
									setModalEmail(!setModalEmail);
								}}
							>
								<Text style={styles.textStyle}>Aceptar</Text>
							</TouchableHighlight>
						</View>
					</View>
				</Modal>

				<Modal animationType="slide" transparent={true} visible={modalError}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Image style={styles.imageModal} source={require('../../assets/registerError.png')} />

							<Text style={styles.modalText}>
								Hubo un error al crear su cuenta, verifique sus datos de nuevo...
							</Text>

							<TouchableHighlight
								style={styles.openButton}
								onPress={() => {
									setModalError(!setModalError);
								}}
							>
								<Text style={styles.textStyle}>Aceptar</Text>
							</TouchableHighlight>
						</View>
					</View>
				</Modal>

				<TitleText text="Registro de usuario" />

				{/* Profile Image */}
				<View style={{ alignSelf: 'center', marginBottom: 25 }}>
					<View style={styles.profileImage}>
						<FontAwesome
							name="user-circle"
							size={200}
							color="#666"
							style={styles.image}
							resizeMode="center"
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
					labelValue={user.name}
					onChangeText={(text) => changeUser('name', text)}
					placeholderText="Nombre completo"
					numberOfLines={1}
					iconType="user"
				/>

				{/* Email form */}
				<FormInput
					labelValue={user.email}
					onChangeText={(text) => {
						changeUser('email', text);
						handleValidEmail(text);
					}}
					placeholderText="Correo Electronico"
					iconType="mail"
					keyboardType="email-address"
					autoCorrect={false}
				/>

				{isEmailValid ? null : <Text style={styles.errorMessage}>El correo que ingresaste es incorrecto</Text>}

				{/* Password form */}
				<FormInput
					labelValue={user.password}
					onChangeText={(text) => {
						changeUser('password', text);
						handleValidPassword(text);
					}}
					placeholderText="Contraseña"
					iconType="lock"
					secureTextEntry={true}
				/>

				{isPasswordValid ? null : (
					<Text style={styles.errorMessage}>
						La contraseña debe tener 8 carácteres como mínimo, al menos una mayúscula y un número.
					</Text>
				)}

				<FormInput
					labelValue={confirmPass}
					onChangeText={(text) => {
						setConfirmPass(text);
						handleValidConfirmPassword(text);
					}}
					placeholderText="Confirmar contraseña"
					iconType="checkcircleo"
					secureTextEntry={true}
				/>

				{isConfirmPasswordValid ? null : (
					<Text style={styles.errorMessage}>Las contraseñas deben de ser iguales</Text>
				)}

				{/* Phone form */}
				<FormInput
					labelValue={user.telefono}
					onChangeText={(text) => {
						changeUser('telefono', text);
						handleValidPhoneNumber(text);
					}}
					placeholderText="Número de teléfono"
					iconType="phone"
					numberOfLines={1}
					keyboardType="number-pad"
				/>

				{isPhoneNumberValid ? null : (
					<Text style={styles.errorMessage}>El número telefónico es incorrecto</Text>
				)}

				{/* Address form */}
				<FormInput
					labelValue={user.direccion}
					onChangeText={(text) => changeUser('direccion', text)}
					placeholderText="Dirección"
					numberOfLines={1}
					iconType="home"
					autoCapitalize={true}
				/>

				{/* DatePicker button */}
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

				{/* Register button */}
				<PrimaryButton buttonTitle="Crear cuenta" onPress={registerUser} />
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
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
		bottom: 15,
		right: 0,
		width: 52,
		height: 52,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	errorMessage: {
		fontFamily: fonts.Raleway_400Regular,
		color: '#FF0000',
		fontSize: 14,
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
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
	imageModal: {
		width: 150,
		height: 150,
	},
	openButton: {
		backgroundColor: '#2e64e5',
		borderRadius: 5,
		padding: 10,
		elevation: 2,
	},
	textStyle: {
		fontFamily: fonts.Raleway_700Bold,
		color: 'white',
		textAlign: 'center',
	},
	modalText: {
		fontFamily: fonts.Raleway_700Bold,
		fontSize: 18,
		marginBottom: 15,
		textAlign: 'center',
	},
});
