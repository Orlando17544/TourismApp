import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from 'react-native-vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import {
	ProfileScreen,
	ChangePasswordUserLoggedScreen,
	SelectCityScreen,
	TouristDestinationScreen,
	SubcategoryScreen,
	PlacesScreen,
	EditAccountScreen,
	TopTabBarNavigator,
	DetailedNewScreen,
} from '../screens/index';

const Stack = createStackNavigator();

export function MainNavigator() {
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
				name="Home"
				component={TopTabBarNavigator}
				options={({ navigation, route }) => ({
					headerTitle: 'Inicio',
					headerRight: () => (
						<TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
							<FontAwesome name="user-circle-o" size={22} style={{ paddingRight: 10 }} />
						</TouchableOpacity>
					),
					headerLeft: () => (
						<TouchableOpacity onPress={() => navigation.navigate('SelectCityScreen')}>
							<FontAwesome name="search" size={20} style={{ paddingLeft: 10 }} />
						</TouchableOpacity>
					),
				})}
			/>
			<Stack.Screen
				name="ProfileScreen"
				component={ProfileScreen}
				options={{
					title: 'Perfil',
				}}
			/>
			<Stack.Screen
				name="EditAccountScreen"
				component={EditAccountScreen}
				options={{
					title: 'Modificar perfil',
				}}
			/>
			<Stack.Screen
				name="ChangePasswordUserLogged"
				component={ChangePasswordUserLoggedScreen}
				options={{
					title: 'Cambiar Contraseña',
				}}
			/>
			<Stack.Screen
				name="SelectCityScreen"
				component={SelectCityScreen}
				options={{
					title: 'Seleccionar Ciudad',
				}}
			/>
			<Stack.Screen
				name="TouristDestinationScreen"
				component={TouristDestinationScreen}
				options={{
					title: 'Cargando...',
				}}
			/>
			<Stack.Screen
				name="SubcategoryScreen"
				component={SubcategoryScreen}
				options={{
					title: 'Cambiar por Subcategoria',
				}}
			/>
			<Stack.Screen
				name="PlacesScreen"
				component={PlacesScreen}
				options={{
					title: 'Lugares disponibles',
				}}
			/>
			<Stack.Screen name="DetailedNewScreen" options={{ headerShown: false }} component={DetailedNewScreen} />
		</Stack.Navigator>
	);
}
