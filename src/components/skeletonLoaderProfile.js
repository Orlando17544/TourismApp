import React from 'react';
import { Dimensions } from 'react-native';
import ContentLoader, { Rect, Circle, BulletList } from 'react-content-loader/native';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('window').height;

const info = () => {
	<ContentLoader backgroundColor={'#d8d8d8'} foregroundColor={'#efefef'}>
		<BulletList />
	</ContentLoader>;
};

const LoaderSkeletonProfile = () => (
	<ContentLoader backgroundColor={'#d8d8d8'} foregroundColor={'#efefef'}>
		<Circle cx={screenWidth / 2} cy={screenWidth / 3.55} r="80" />

		<Rect x={screenWidth / 7} y={screenWidth * 0.58} rx="2" ry="2" width="220" height={25} />
		<Rect x={screenWidth / 9} y={screenWidth * 0.67} rx="2" ry="2" width="250" height={16} />

		<Rect x={30} y={screenWidth * 0.72 + 30 + 20 + 10} rx="2" ry="2" width={screenWidth - 110} height={20} />
		<Rect
			x={30}
			y={screenWidth * 0.72 + 30 + 20 + 10 + 20 + 10 + 20 + 10}
			rx="2"
			ry="2"
			width={screenWidth - 60}
			height={20}
		/>
		<Rect
			x={30}
			y={screenWidth * 0.72 + 30 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10}
			rx="2"
			ry="2"
			width={screenWidth - 50}
			height={20}
		/>
		<Rect
			x={30}
			y={screenWidth * 0.72 + 30 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10 + 20 + 10}
			rx="2"
			ry="2"
			width={screenWidth - 100}
			height={20}
		/>
	</ContentLoader>
);

export default LoaderSkeletonProfile;
