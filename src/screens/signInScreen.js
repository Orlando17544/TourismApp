import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from 'react-native-vector-icons';
import axios from 'axios';

import { AuthContext } from '../utils';
import FormInput from '../components/formInput';
import PrimaryButton from '../components/primaryButton';
import SecundaryButton from '../components/secundaryButton';
import { API_URL } from '../../env/API_URL';

import * as Facebook from 'expo-facebook';
import { fonts } from '../../assets/fonts';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

//Para login con Google
WebBrowser.maybeCompleteAuthSession();

export function SignInScreen({ navigation }) {
	const [loginError, setLoginError] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [authenticationUserData, setAuthenticationUserData] = useState(null);
	const [isEmailValid, setEmailValid] = useState(true);
	const [isPasswordValid, setPasswordValid] = useState(true);
	const [request, response, promptAsync] = Google.useAuthRequest({
		expoClientId: '1048873913772-a7tsc2uogte52mbjj9ino52bgsa1ab8b.apps.googleusercontent.com',
		iosClientId: '1048873913772-htsnuiek4mv0pfe2b2im31ubp95gv75e.apps.googleusercontent.com',
		androidClientId: '1048873913772-8osjn5lcg581skpcopv964hlbk93uslv.apps.googleusercontent.com',
	});

	useEffect(() => {
		if (response !== null) {
			if (response.type === 'success') {
				const { authentication } = response;
				console.log('Response: ' + JSON.stringify(response));
				console.log('Autenticación: ' + JSON.stringify(authentication));
			}
		}
	}, [response]);

	async function initializeSignInWithFacebook() {
		try {
			await Facebook.initializeAsync({
				appId: '3744755978983279',
				appName: 'SINALOA DIGITAL',
				version: 'v10.0',
				localStorage: true,
			});
			let responseFacebook = await Facebook.logInWithReadPermissionsAsync({
				permissions: ['public_profile', 'email'],
			});

			if (responseFacebook.type === 'cancel') {
				throw new Error('The user or Facebook cancelled the login');
			}

			let responseBack = await axios.post(`${API_URL}/usuario/fb-login`, {
				userId: responseFacebook.userId,
				token: responseFacebook.token,
			});

			signIn(responseBack.data.token);
		} catch (error) {
			console.log(error);
		}
	}

	const { signIn } = useContext(AuthContext);

	function handleValidEmail(email) {
		var re =
			/^[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
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

	function handleSignIn() {
		if (email.trim() === '' && password === '') {
			Alert.alert('Credenciales inválidas', 'El correo o contraseña no pueden estar vacíos');
			return;
		}

		signIn('ueorrñÑEOOROretoR387ore');

		/*axios
			.post(`${API_URL}/usuario/login`, { email, password })
			.then((response) => {
				// console.log(response.data);
				signIn(response.data.token);
			})
			.catch(function (error) {
				if (error.response.status === 401) {
					setLoginError(true);
					console.log('Datos erroneos/Cuenta dada de baja...');
				} else {
					console.error(error);
				}
			});*/
	}

	return (
		<>
			<StatusBar backgroundColor="#fff" barStyle="black-content" />
			<ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
				<Image
					source={require('../../assets/logoSin.png')}
					style={styles.logo}
					defaultSource={require('../../assets/image-missing.png')}
				/>

				{/* Email form */}
				<FormInput
					labelValue={email}
					onChangeText={(email) => {
						setEmail(email);
						handleValidEmail(email);
					}}
					placeholderText="Correo Electrónico"
					iconType="mail"
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
				/>

				{isEmailValid ? null : <Text style={styles.errorMessage}>El correo que ingresaste es incorrecto</Text>}

				{/* Password form */}
				<FormInput
					labelValue={password}
					onChangeText={(password) => {
						setPassword(password);
						handleValidPassword(password);
					}}
					placeholderText="Contraseña"
					iconType="lock"
					secureTextEntry={true}
				/>

				{/* Login button */}
				<PrimaryButton
					buttonTitle="Iniciar Sesión"
					onPress={() => {
						// signIn({ email, password });
						handleSignIn();
					}}
				/>

				{loginError === true ? (
					<Text style={(styles.errorMessage, { marginTop: 8, color: '#FF0000', opacity: 0.7 })}>
						Email y/o contraseña erroneos...
					</Text>
				) : (
					<View />
				)}

				{/* Forgot password button */}
				<SecundaryButton
					buttonTitle="¿Olvidaste tu contraseña?"
					onPress={() => navigation.navigate('PasswordForgottenScreen')}
				/>

				{/* Social logins */}
				<View>
					{/* Facebook */}
					<TouchableOpacity
						style={[styles.buttonContainerSocial, { backgroundColor: '#e6eaf4' }]}
						onPress={() => {
							initializeSignInWithFacebook();
						}}
					>
						<View style={styles.iconWrapper}>
							<FontAwesome name="facebook" style={styles.icon} size={22} color="#4867aa" />
						</View>
						<View style={styles.btnTxtWrapper}>
							<Text style={[styles.buttonText, { color: '#4867aa' }]}>Iniciar sesión con Facebook</Text>
						</View>
					</TouchableOpacity>

					{/* Google */}
					<TouchableOpacity
						style={[styles.buttonContainerSocial, { backgroundColor: '#f5e7ea' }]}
						onPress={() => {
							promptAsync();
						}}
					>
						<View style={styles.iconWrapper}>
							<FontAwesome name="google" style={styles.icon} size={22} color="#de4d41" />
						</View>
						<View style={styles.btnTxtWrapper}>
							<Text style={[styles.buttonText, { color: '#de4d41' }]}>Iniciar sesión con Google</Text>
						</View>
					</TouchableOpacity>
				</View>

				{/* Register button */}
				<SecundaryButton
					buttonTitle="¿No tienes cuenta? Registrate!"
					onPress={() => navigation.navigate('RegisterScreen')}
				/>
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
	logo: {
		width: 300,
		height: 150,
		marginBottom: 20,
	},
	errorMessage: {
		opacity: 0.7,
		fontStyle: 'italic',
		color: '#FF0000',
		fontSize: 14,
	},
	// Social buttons css
	buttonText: {
		fontFamily: fonts.Raleway_700Bold,
		fontSize: 17,
		color: '#ffffff',
	},
	buttonContainerSocial: {
		marginTop: 10,
		width: '100%',
		height: 800 / 15,
		padding: 10,
		flexDirection: 'row',
		borderRadius: 3,
	},
	iconWrapper: {
		width: 30,
		justifyContent: 'center',
		alignItems: 'center',
	},
	btnTxtWrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
