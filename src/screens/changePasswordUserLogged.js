import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import FormInput from '../components/formInput';
import TitleText from '../components/titleText';
import SubtitleText from '../components/subtitleText';
import PrimaryButton from '../components/primaryButton';

export function ChangePasswordUserLoggedScreen() {
	const [password, setPassword] = React.useState('');
	const [newPassword, setNewPassword] = React.useState('');
	const [confirmPass, setConfirmPass] = React.useState('');
	const [isPasswordValid, setPasswordValid] = React.useState(true);
	const [isConfirmPasswordValid, setConfirmPasswordValid] = React.useState(true);

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
		if (newPassword === confirmPassword) {
			setConfirmPasswordValid(true);
		} else {
			setConfirmPasswordValid(false);
		}
	}

	return (
		<ScrollView showsVerticalScrollIndicator={false}>
			<View style={styles.container}>
				<StatusBar backgroundColor="#fff" barStyle="black-content" />

				<TitleText text="Cambiar contraseña" />

				<SubtitleText text="La contraseña debe tener 8 carácteres como mínimo, al menos una mayúscula y un número." />

				{/* Password form */}
				<FormInput
					labelValue={password}
					onChangeText={(text) => setPassword(text)}
					placeholderText="Contraseña actual"
					iconType="lock"
					secureTextEntry={true}
				/>

				<FormInput
					labelValue={newPassword}
					onChangeText={(text) => {
						setNewPassword(text);
						handleValidPassword(text);
					}}
					placeholderText="Nueva contraseña"
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
					placeholderText="Confirmar nueva contraseña"
					iconType="checkcircleo"
					secureTextEntry={true}
				/>

				{isConfirmPasswordValid ? null : (
					<Text style={styles.errorMessage}>Las contraseñas deben de ser iguales</Text>
				)}

				{/* Login button */}
				<PrimaryButton
					buttonTitle="Recuperar cuenta"
					onPress={() => alert('Acción de cambiar la contraseña')}
				/>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		paddingTop: 50,
	},
	errorMessage: {
		color: '#FF0000',
		fontSize: 14,
	},
});
