// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { AntDesign } from '@expo/vector-icons';
// import colors from '../constants/Colors';

// const RoundIconBtn = ({ antIconName, size, color, style, onPress }) => {
//   return (
//     <AntDesign
//       name={antIconName}
//       size={size || 24}
//       color={color || colors.background}
//       style={[styles.icon, { ...style }]}
//       onPress={onPress}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   icon: {
//     backgroundColor: colors.background,
//     padding: 15,
//     borderRadius: 50,
//     elevation: 5,
//   },
// });

// export default RoundIconBtn;
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Assuming you're using AntDesign icons

interface RoundIconBtnProps {
  antIconName: string;
  size: number;
  color?: string; // Optional color prop
  style?: any; // Optional style prop
  onPress: () => void;
}

const RoundIconBtn: React.FC<RoundIconBtnProps> = ({
  antIconName,
  size,
  color = 'black', // Default color if not provided
  style = {}, // Default empty style if not provided
  onPress,
}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <AntDesign name={antIconName} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100, // To make it round
    borderWidth: 1,
    borderColor: 'black', // Example border color
  },
});

export default RoundIconBtn;
