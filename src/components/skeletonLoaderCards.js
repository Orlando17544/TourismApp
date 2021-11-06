import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('window').height;

const LoaderSkeletonCards = () => (
	<ContentLoader backgroundColor={'#d8d8d8'} foregroundColor={'#efefef'}>
		<Rect
			x={10}
			y={10}
			rx="5"
			ry="5"
			width={screenWidth - 20}
			height={screenHeight / 3}
			style={{ alignSelf: 'center' }}
		/>
		<Rect x={10} y={10 + screenHeight / 3 + 10} rx="5" ry="5" width={screenWidth - 20} height={screenHeight / 3} />
		<Rect
			x={10}
			y={10 + screenHeight / 3 + 10 + screenHeight / 3 + 10}
			rx="5"
			ry="5"
			width={screenWidth - 20}
			height={screenHeight / 3}
		/>
	</ContentLoader>
);

export default LoaderSkeletonCards;
