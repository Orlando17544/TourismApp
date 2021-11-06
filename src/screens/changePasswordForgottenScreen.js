import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AsyncStorage } from 'react-native';

import { fonts } from '../../assets/fonts';
import FormInput from '../components/formInput';
import PrimaryButton from '../components/primaryButton';
import TitleText from '../components/titleText';
import SubtitleText from '../components/subtitleText';
import { API_URL } from '../../env/API_URL';
import axios from 'axios';

export function ChangePasswordForgottenScreen({ route, navigation }) {
	const [password, setPassword] = React.useState('');
	const [confirmPass, setConfirmPass] = React.useState('');
	const [isPasswordValid, setPasswordValid] = React.useState(false);
	const [isConfirmPasswordValid, setConfirmPasswordValid] = React.useState(false);
	const [isPasswordEdited, setPasswordEdited] = React.useState(false);
	const [isConfirmPasswordEdited, setConfirmPasswordEdited] = React.useState(false);

	const { token } = route.params;

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
		if (password === confirmPassword) {
			setConfirmPasswordValid(true);
		} else {
			setConfirmPasswordValid(false);
		}
	}

	function showMessagePassword() {
		if (!isPasswordEdited) {
			return null;
		}

		if (isPasswordValid) {
			return null;
		}

		return (
			<Text style={styles.errorMessage}>
				La contraseña debe tener 8 carácteres como mínimo, al menos una mayúscula y un número.
			</Text>
		);
	}

	function showMessageConfirmPassword() {
		if (!isConfirmPasswordEdited) {
			return null;
		}

		if (isConfirmPasswordValid) {
			return null;
		}

		return <Text style={styles.errorMessage}>Las contraseñas deben de ser iguales</Text>;
	}

	async function changePassword() {
		try {
			if (!isPasswordValid || !isConfirmPasswordValid) {
				alert('La contraseña es inválida');
				return;
			}

			let response = await axios.post(
				`${API_URL}/usuario/update`,
				{ user: { password: password } },
				{ headers: { Authorizathion: `Bearer ${token}` } }
			);

			if (response.status !== 200) {
				throw new Error('HTTP error! status: ' + response.status);
			}

			await AsyncStorage.setItem('tokenKey', token);

			navigation.navigate('MainNavigator');
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<StatusBar backgroundColor="#fff" barStyle="black-content" />
			<ScrollView contentContainerStyle={styles.container}>
				<TitleText text="Restablecer contraseña" />

				<SubtitleText text="Una vez dado el botón de recuperar, se te enviará un correo al email registrado para recuperar su cuenta." />

				{/* Password form */}
				<FormInput
					labelValue={password}
					onChangeText={(text) => {
						setPassword(text);
						handleValidPassword(text);
						setPasswordEdited(true);
					}}
					placeholderText="Contraseña"
					iconType="lock"
					secureTextEntry={true}
				/>

				{showMessagePassword()}

				<FormInput
					labelValue={confirmPass}
					onChangeText={(text) => {
						setConfirmPass(text);
						handleValidConfirmPassword(text);
						setConfirmPasswordEdited(true);
					}}
					placeholderText="Confirmar contraseña"
					iconType="checkcircleo"
					secureTextEntry={true}
				/>

				{showMessageConfirmPassword()}

				{/* Login button */}
				<PrimaryButton buttonTitle="Cambiar contraseña" onPress={changePassword} />
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
	errorMessage: {
		fontFamily: fonts.Raleway_400Regular,
		color: '#FF0000',
		fontSize: 14,
	},
});
