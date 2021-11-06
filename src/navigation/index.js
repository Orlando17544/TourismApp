import * as React from 'react';
import { AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
	SplashScreen,
	SignInScreen,
	RegisterScreen,
	PasswordForgottenScreen,
	ChangePasswordForgottenScreen,
} from '../screens/';
import { AuthContext } from '../utils';
import { MainNavigator } from './main';

export const USER_CONTEXT = React.createContext();

const Stack = createStackNavigator();

function AuthStack({ navigation, state }) {
	// console.log('navigation =>', navigation);
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: {
					elevation: 0,
					shadowOpacity: 0,
				},
				headerTitleAlign: 'center',
			}}
		>
			<Stack.Screen
				name="SignIn"
				component={SignInScreen}
				options={{
					title: 'Inicio de Sesión',
					// When logging out, a pop animation feels intuitive
					animationTypeForReplace: state.isSignout ? 'pop' : 'push',
				}}
			/>
			<Stack.Screen
				name="PasswordForgottenScreen"
				component={PasswordForgottenScreen}
				options={{
					title: 'Recuperar Contraseña',
				}}
			/>
			<Stack.Screen
				name="RegisterScreen"
				component={RegisterScreen}
				options={{
					title: 'Registro',
				}}
			/>
			<Stack.Screen
				name="MainNavigator"
				component={MainNavigator}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="ChangePasswordForgottenScreen"
				component={ChangePasswordForgottenScreen}
				options={{
					title: 'Cambia tu contraseña',
				}}
			/>
		</Stack.Navigator>
	);
}

export function LoginNavigator() {
	const [state, dispatch] = React.useReducer(
		(prevState, action) => {
			switch (action.type) {
				case 'RESTORE_TOKEN':
					return {
						...prevState,
						userToken: action.token,
						isLoading: false,
					};
				case 'SIGN_IN':
					if (action.token) {
						AsyncStorage.setItem('userToken', action.token);
					}
					return {
						...prevState,
						isSignout: false,
						userToken: action.token,
					};
				case 'SIGN_OUT':
					if (action.token) {
						AsyncStorage.removeItem('userToken', action.token);
					}
					return {
						...prevState,
						isSignout: true,
						userToken: null,
					};
			}
		},
		{
			isLoading: true,
			isSignout: false,
			userToken: null,
		}
	);

	React.useEffect(() => {
		// Fetch the token from storage then navigate to our appropriate place
		const bootstrapAsync = async () => {
			let userToken;

			try {
				userToken = await AsyncStorage.getItem('userToken');
			} catch (e) {
				// Restoring token failed
			}

			// After restoring token, we may need to validate it in production apps

			// This will switch to the App screen or Auth screen and this loading
			// screen will be unmounted and thrown away.
			dispatch({ type: 'RESTORE_TOKEN', token: null });
		};

		bootstrapAsync();
	}, []);

	const authContext = React.useMemo(
		() => ({
			signIn: async (data) => {
				// In a production app, we need to send some data (usually username, password) to server and get a token
				// We will also need to handle errors if sign in failed
				// After getting token, we need to persist the token using `AsyncStorage`
				// In the example, we'll use a dummy token

				dispatch({ type: 'SIGN_IN', token: data });
			},
			signOut: () => dispatch({ type: 'SIGN_OUT' }),
			signUp: async (data) => {
				// In a production app, we need to send user data to server and get a token
				// We will also need to handle errors if sign up failed
				// After getting token, we need to persist the token using `AsyncStorage`
				// In the example, we'll use a dummy token

				dispatch({ type: 'SIGN_IN', token: data });
			},
		}),
		[]
	);

	// Print a splash screen when loading the token or the info of the app
	if (state.isLoading) {
		return (
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Splash" options={{ headerShown: false }} component={SplashScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}

	return (
		<AuthContext.Provider value={authContext}>
			<NavigationContainer>
				{state.userToken == null ? (
					//No token found, user isn't signed in
					<AuthStack state={state} />
				) : (
					//User is signed in
					<MainNavigator />
				)}
			</NavigationContainer>
		</AuthContext.Provider>
	);
}
