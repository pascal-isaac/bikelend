import * as React from 'react'
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import auth from '@react-native-firebase/auth';

const CustomDrawer = ({ navigation }) => {
    const onLogout = () => {
        auth()
          .signOut()
          .then(function () {
            console.log('Sign-out successful.');
          })
          .catch(function (error) {
            console.log('An error happened when signing out');
          });
        navigation.navigate('login');
      };
    return (

        <View style={styles.container}>
            <View style={{ flex: 1.25, backgroundColor:'#2B6747' }}>
                <ImageBackground source={require('../images/logo.png')} style={styles.img}>
                <Text style={styles.title}>Bikelend</Text>
            </ImageBackground>
            </View>
            <View style={{ flex: 3.5, alignItems: 'center', marginTop: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('home')} >
                    <Text style={styles.txt}>Accueil</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ListRenter')} >
                    <Text style={styles.txt}>Liste de vos vélos</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('lend')} >
                    <Text style={styles.txt}>Prêter votre vélo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        onLogout();
                    }}>
                    <Text style={styles.txt}>Déconnexion</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

export default CustomDrawer


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E1D7D5',
    },
    img: {
        height: '100%',
        width: '100%',
        justifyContent:'flex-end',
        resizeMode: 'contain',
    },
    title: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 24,
        color: '#F4E285',
        textAlign: 'center',
        marginVertical:8

    },
    txt: {
        marginTop: 12,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
    },
});