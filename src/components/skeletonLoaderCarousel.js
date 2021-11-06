import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('window').height;

const LoaderSkeletonCards = () => (
	<ContentLoader backgroundColor={'#d8d8d8'} foregroundColor={'#efefef'}>
		<Rect x={0} y={0} rx="2" ry="2" width={screenWidth} height={screenWidth * 0.72} />
		<Rect x={10} y={screenWidth * 0.72 + 30} rx="2" ry="2" width={screenWidth - 20} height={20} />
		<Rect x={10} y={screenWidth * 0.72 + 30 + 20 + 10} rx="2" ry="2" width={screenWidth - 80} height={20} />
		<Rect
			x={10}
			y={screenWidth * 0.72 + 30 + 20 + 10 + 20 + 10}
			rx="2"
			ry="2"
			width={screenWidth - 20}
			height={20}
		/>
		<Rect
			x={10}
			y={screenWidth * 0.72 + 30 + 20 + 10 + 20 + 10 + 20 + 10}
			rx="2"
			ry="2"
			width={screenWidth - 80}
			height={20}
		/>
		<Rect
			x={10}
			y={screenWidth * 0.72 + 30 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10}
			rx="2"
			ry="2"
			width={screenWidth - 20}
			height={20}
		/>
		<Rect
			x={10}
			y={screenWidth * 0.72 + 30 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10}
			rx="2"
			ry="2"
			width={screenWidth - 80}
			height={20}
		/>
		<Rect
			x={10}
			y={screenWidth * 0.72 + 30 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10}
			rx="2"
			ry="2"
			width={screenWidth - 20}
			height={20}
		/>
		<Rect
			x={10}
			y={screenWidth * 0.72 + 30 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10}
			rx="2"
			ry="2"
			width={screenWidth - 80}
			height={20}
		/>
	</ContentLoader>
);

export default LoaderSkeletonCards;
