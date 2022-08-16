import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  ImageBackground,
} from 'react-native';

import { images } from '../images';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export function Avatar({ uri, onPress }) {
  return (

      <View style={styles.avatar}>
        <Image
          style={styles.avatarImage}
          source={uri ? { uri } : images.avatar}
        />

                <TouchableOpacity style={styles.addButton} onPress={onPress}>
        <Text style={styles.usernameText}>Ajouter une photo de votre vélo  <Icon style={styles.addButtonIcon} name="camera-plus" size={30} /> </Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor:'#F4E285',
  },
  avatarImage: {
    height: 180,
    width: '100%',

    overflow: 'hidden',
    borderColor: '#4D4D4D',
    borderWidth: 1,
  },
  addButton: {
    borderRadius: 50,
    position: 'absolute',

    bottom: 5,
    alignItems:'center',
    justifyContent:'center',
  },
  addButtonIcon: {
    alignItems:'center',
    justifyContent:'center',
    left: -1,
    top: -1,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    bottom: -38,
    fontStyle:'italic',
  },
});