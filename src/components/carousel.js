import React, { Component } from 'react';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { fonts } from '../../assets/fonts';

import { BASIC_URL } from '../../env/BASIC_URL';

const screenWidth = Dimensions.get('window').width;

var that;

class CarouselImages extends Component {
	constructor(props) {
		super(props);
		that = this;
	}

	images = this.props.imagesCarousel.map((fotoObject) => {
		return `${BASIC_URL}` + fotoObject.ruta;
	}); // images have to be an array like this: images = ['http://imagen.jpg', 'http://imagen2.jpg']

	state = {
		activeSlide: 0,
	};

	renderItem({ item, index }, parallaxProps) {
		console.log(
			that.props.imagesCarousel.map((fotoObject) => {
				fotoObject.ruta;
			})
		);
		return (
			<View style={that.props.itemCarousel}>
				<ParallaxImage
					source={{ uri: item }}
					containerStyle={that.props.imageContainerCarousel}
					style={that.props.imageCarousel}
					parallaxFactor={0.4}
					{...parallaxProps}
				/>
				<Text style={that.props.titleCarouselStyle}>{that.props.titleCarousel}</Text>
			</View>
		);
	}

	get pagination() {
		return (
			<Pagination
				activeDotIndex={this.state.activeSlide}
				dotsLength={this.images.length}
				containerStyle={{
					backgroundColor: 'rgba(0, 0, 0, 0)',
					width: screenWidth,
					height: screenWidth * 0.1,
					justifyContent: 'center',
					position: 'absolute',
					marginTop: screenWidth * 0.56,
				}}
				dotColor="#ffffff"
				dotContainerStyle={{
					backgroundColor: '#ffffff',
					width: 5,
					height: 5,
					marginLeft: 15,
					marginRight: 15,
					borderRadius: 5,
				}}
				dotStyle={{
					width: 10,
					height: 10,
					borderRadius: 10,
					marginHorizontal: 0,
					backgroundColor: '#ffffff',
				}}
				inactiveDotColor="#ffffff"
				inactiveDotOpacity={0.3}
				inactiveDotScale={0.7}
				inactiveDotStyle={
					{
						// Define styles for inactive dots here
					}
				}
				vertical={false}
				animatedDuration={100}
				animatedFriction={4}
				animatedTension={75}
			/>
		);
	}

	render() {
		return (
			<View>
				<Carousel
					data={this.images}
					renderItem={this.renderItem}
					sliderWidth={screenWidth}
					itemWidth={screenWidth}
					onSnapToItem={(index) => this.setState({ activeSlide: index })}
					justifyContent="flex-start"
					hasParallaxImages={true}
				/>
				{this.pagination}
			</View>
		);
	}
}

export default CarouselImages;
