import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import FormInput from '../components/formInput';
import PrimaryButton from '../components/primaryButton';
import TitleText from '../components/titleText';
import SubtitleText from '../components/subtitleText';
import { fonts } from '../../assets/fonts';

import * as Linking from 'expo-linking';

export function PasswordForgottenScreen({ navigation }) {
	const [email, setEmail] = React.useState('');
	const [isEmailValid, setEmailValid] = React.useState(false);
	const [isEmailEdited, setEmailEdited] = React.useState(false);

	function handleRedirect(event) {
		Linking.removeEventListener('url', handleRedirect);
		const regex = /(?:token=)(\w+)/;
		const token = event.url.match(regex)[1];
		navigation.navigate('ChangePasswordForgottenScreen', { token: token });
	}

	async function sendEmailToUser() {
		try {
			if (!isEmailValid) {
				alert('El correo es inválido');
				return;
			}

			let response = await axios.post(`${API_URL}/usuario/forgot-pass-movil`, { email: email });

			if (response.status !== 200) {
				throw new Error('HTTP error! status: ' + response.status);
			}

			Linking.addEventListener('url', handleRedirect);
		} catch (error) {
			console.log(error);
		}
	}

	function showMessageEmail(props) {
		if (!isEmailEdited) {
			return null;
		}

		if (isEmailValid) {
			return null;
		}

		return <Text style={styles.errorMessage}>El correo que ingresaste es incorrecto</Text>;
	}

	function handleValidEmail(email) {
		var re = /^[a-z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_‘{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
		//Extracted from https://regular-expressions.mobi/email.html?wlr=1
		if (re.test(email.trim())) {
			setEmailValid(true);
		} else {
			setEmailValid(false);
		}
	}

	return (
		<>
			<StatusBar backgroundColor="#fff" barStyle="black-content" />
			<ScrollView contentContainerStyle={styles.container}>
				<TitleText text="Restablecer contraseña" />

				<SubtitleText text="Una vez dado el botón de recuperar, se te enviará un correo al email registrado para recuperar tu cuenta." />

				{/* Email form */}
				<FormInput
					labelValue={email}
					onChangeText={(email) => {
						setEmail(email);
						handleValidEmail(email);
						setEmailEdited(true);
					}}
					placeholderText="Correo Electronico"
					iconType="mail"
					keyboardType="email-address"
					autoCapitalize="none"
					autoCorrect={false}
				/>

				{showMessageEmail()}

				{/* Login button */}
				<PrimaryButton buttonTitle="Recuperar cuenta" onPress={sendEmailToUser} />
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
