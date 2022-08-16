import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import  auth from "@react-native-firebase/auth";

import {TextInput as TextInputEye} from 'react-native-paper';

const ResetMDPScreen = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [emailValidError, setEmailValidError] = useState('');

    const [borderColor, setBorderColor] = useState('#5b8e7d');
    const [color, setColor] = useState('red');

    const handleValidEmail = val => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (val.length === 0) {
          setEmailValidError('');
        } else if (reg.test(val) === false) {
          setEmailValidError('Entrez une adresse mail valide');
          setBorderColor('red');
        } else if (reg.test(val) === true) {
          setEmailValidError('');
          setBorderColor('blue');
        }
      };

      
  const handleSubmit = () => {
    var emailValid = false;
    if (email.length == 0) {
      setEmailValidError('Email requis');
    } else if (email.length < 6) {
      setEmailValidError('Email mini 6 caractères');
    } else if (email.indexOf(' ') >= 0) {
      setEmailValidError('Un email ne peut pas contenir un espace');
    } else {
      setEmailValidError('');
      emailValid = true;

    }


    if (emailValid == true) {
      forgotPassword(email)
    }
  };

    const forgotPassword = (email) => {
        auth().sendPasswordResetEmail(email).then(function () {
          alert("Lien de réinitialisation envoyé sur votre boîte mail");
        }).catch(function (e) {
          alert(e);
        });
        navigation.navigate('login');
      }



  return (
    <View style={styles.container}>
      <View style={{flex: 0.6, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          style={{
            height: '100%',
            width: '100%',
            resizeMode: 'contain',
            marginTop: 20,
          }}
          source={require('../images/logo.png')}
        />
      </View>
            <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={styles.txtTitle}>Mot de passe oublié?</Text>
        <TextInputEye
          style={{
            borderColor: borderColor,
            fontSize: 17,
            height: 50,
            width: 300,
            borderWidth: 2,
            paddingHorizontal: 15,
            marginTop: 5,
            backgroundColor: '#8cb369',
            borderRadius: 10,
            color: '#F4E285',
            shadowColor: 'black',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.25,
            shadowRadius: 6.84,
            elevation: 5,
          }}
          label="Entrez votre email"
          returnKeyType="next"
          autoCapitalize="none"
          value={email}
          onChangeText={value => {
            setEmail(value);
            handleValidEmail(value);
          }}
          onFocus={() => setBorderColor('blue')}
          theme={{roundness: 10}}
        />
        {emailValidError ? (
          <Text style={{color: 'red', marginTop: 5}}>{emailValidError}</Text>
        ) : null}
              <View style={{flex: 1, alignItems: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
          <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}} onPress={() => {
            handleSubmit();
          }}>
          <Text style={styles.btnValidation}>Réinitialisation</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, color: '#f4a259', fontWeight: 'bold', textAlign: 'center', marginHorizontal:15 }}>Nous allons envoyer par e-mail{'\n'}les instructions afin de réinitialiser votre mot de passe. </Text>
          </View>
        </View>
      </View>
        </View>

    </View>
  );
};

export default ResetMDPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5b8e7d',
  },
  btnValidation: {
    paddingTop: 7,
    backgroundColor: '#8cb369',
    color: '#F4E285',
    fontSize: 30,
    textAlign: 'center',
    width: 250,
    height: 60,
    marginVertical: 30,
    borderRadius: 30,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    elevation: 5,
  },
  textInput: {
    fontSize: 17,
    height: 50,
    width: 300,
    borderColor: '#838383',
    borderWidth: 2,
    paddingHorizontal: 15,
    marginTop: 5,
    backgroundColor: '#8cb369',
    borderRadius: 10,
    color: '#838383',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    elevation: 5,
  },
  txtTitle: {
    color: '#000',
    textAlign: 'center',
    fontSize: 22,
    marginTop: 15,
    marginBottom: 8,
    fontWeight: 'bold',
  },
});
