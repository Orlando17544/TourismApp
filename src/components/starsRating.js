import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from 'react-native-vector-icons';

export default function StarsRating(props) {
	if (props.stars == 1) {
		return (
			<>
				<TouchableOpacity onPress={() => props.setStars(1)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(2)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(3)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(4)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(5)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
			</>
		);
	} else if (props.stars > 1 && props.stars < 2) {
		return (
			<>
				<TouchableOpacity onPress={() => props.setStars(1)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(2)}>
					<FontAwesome name="star-half-empty" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(3)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(4)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(5)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
			</>
		);
	} else if (props.stars == 2) {
		return (
			<>
				<TouchableOpacity onPress={() => props.setStars(1)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(2)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(3)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(4)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(5)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
			</>
		);
	} else if (props.stars > 2 && props.stars < 3) {
		return (
			<>
				<TouchableOpacity onPress={() => props.setStars(1)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(2)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(3)}>
					<FontAwesome name="star-half-empty" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(4)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(5)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
			</>
		);
	} else if (props.stars == 3) {
		return (
			<>
				<TouchableOpacity onPress={() => props.setStars(1)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(2)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(3)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(4)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(5)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
			</>
		);
	} else if (props.stars > 3 && props.stars < 4) {
		return (
			<>
				<TouchableOpacity onPress={() => props.setStars(1)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(2)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(3)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(4)}>
					<FontAwesome name="star-half-empty" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(5)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
			</>
		);
	} else if (props.stars == 4) {
		return (
			<>
				<TouchableOpacity onPress={() => props.setStars(1)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(2)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(3)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(4)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(5)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
			</>
		);
	} else if (props.stars > 4 && props.stars < 5) {
		return (
			<>
				<TouchableOpacity onPress={() => props.setStars(1)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(2)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(3)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(4)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(5)}>
					<FontAwesome name="star-half-empty" size={props.size} color={props.color} />
				</TouchableOpacity>
			</>
		);
	} else if (props.stars == 5) {
		return (
			<>
				<TouchableOpacity onPress={() => props.setStars(1)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(2)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(3)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(4)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(5)}>
					<FontAwesome name="star" size={props.size} color={props.color} />
				</TouchableOpacity>
			</>
		);
	} else {
		return (
			<>
				<TouchableOpacity onPress={() => props.setStars(1)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(2)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(3)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(4)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
				<TouchableOpacity onPress={() => props.setStars(5)}>
					<FontAwesome name="star-o" size={props.size} color={props.color} />
				</TouchableOpacity>
			</>
		);
	}
}
