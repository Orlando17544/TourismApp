import { AsyncStorage } from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from './API_URL';

export const API = async ({ url, method, data }) => {
	let token = await AsyncStorage.getItem('userToken');

	return axios({
		baseURL: BASE_URL,
		method,
		url,
		data,
		headers: { Authorization: token },
	});
};
