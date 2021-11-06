import * as React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { CategoriesScreen } from '../screens/index';
import { MapScreen } from '../screens/index';
import { NewsScreen } from '../screens/index';
import { FeaturedScreen } from '../screens/index';
import { fonts } from '../../assets/fonts';

const Tab = createMaterialTopTabNavigator();

export function TopTabBarNavigator() {
	return (
		<Tab.Navigator
			tabBarOptions={{
				style: {
					elevation: 0,
					shadowOpacity: 0,
					borderBottomWidth: 0,
				},

				tabStyle: { height: 40 },
				labelStyle: { height: 40 },
				style: { height: 40 },
				labelStyle: {
					fontSize: 7,
					fontFamily: fonts.Raleway_700Bold,
				},
				activeTintColor: '#093671',
				inactiveTintColor: '#999',
			}}
		>
			<Tab.Screen name="Categorias" component={CategoriesScreen} />
			<Tab.Screen name="Destacados" component={FeaturedScreen} />
			<Tab.Screen name="Mapa" component={MapScreen} />
			<Tab.Screen name="Noticias" component={NewsScreen} />
		</Tab.Navigator>
	);
}
