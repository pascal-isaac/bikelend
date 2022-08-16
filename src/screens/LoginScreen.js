import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {TextInput as TextInputEye} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
//import UserContext from '../components/UserContext';

const LoginScreen = ({navigation}) => {
  const [passwordVisible, setPasswordVisible] = useState(true);

  const [email, setEmail] = useState('');
  const [emailValidError, setEmailValidError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordValidError, setPasswordValidError] = useState('');

  const [borderColor, setBorderColor] = useState('#5b8e7d');
  const [color, setColor] = useState('red');

  const LogInUser = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        navigation.navigate('Home');
        setEmail('');
        setPassword('');
      })
      .catch(res => {
        console.log(res);
      });
  };

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

    var passwordValid = false;
    if (password.length == 0) {
      setPasswordValidError('Mot de passe requis');
    } else if (password.length < 6) {
      setPasswordValidError('Le mot de passe doit avoir minimum 6 caractères');
    } else if (password.indexOf(' ') >= 0) {
      setPasswordValidError('Le mot de passe ne doit pas contenir d espace');
    } else {
      setPasswordValidError('');
      passwordValid = true;
    }

    if (emailValid && passwordValid) {
      LogInUser();
    }
  };

  const handleValidPassword = val => {
    if (val.length == 0) {
      setPasswordValidError('Un mot de passe est requis');
      setBorderColor('red');
      setColor('red');
    } else if (val.length < 6) {
      setPasswordValidError(
        'Le mot de passe doit être de 6 caractères au minimum',
      );
      setBorderColor('red');
      setColor('red');
    } else if (val.length <= 6) {
      setPasswordValidError('Mot de passe correct');
      setBorderColor('black');
      setColor('black');
    } else if (val.length > 20) {
      setPasswordValidError(
        'Le mot de passe doit être de 20 caractères au maximum',
      );
      setBorderColor('red');
      setColor('red');
    } else if (val.length < 20) {
      setPasswordValidError('Mot de passe correct');
      setBorderColor('black');
      setColor('black');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
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
      <ScrollView>
      <View style={{flex: 1, alignItems: 'center'}}>

        <Text style={styles.txtTitle}>Email</Text>
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
          placeholder="Entrez votre email"
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
        <Text style={styles.txtTitle}>Mot de passe</Text>
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
          secureTextEntry={passwordVisible} //placeholder="Entrez votre mot de passe"
          placeholder="Entrez votre mot de passe"
          returnKeyType="done"
          autoCapitalize="none"
          value={password}
          onChangeText={value => {
            setPassword(value);
            handleValidPassword(value);
          }}
          theme={{roundness: 10}}
          right={
            <TextInputEye.Icon
              name={passwordVisible ? 'eye' : 'eye-off'}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          }
        />
        {passwordValidError ? (
          <Text style={{color: color, marginTop: 5}}>{passwordValidError}</Text>
        ) : null}
        <View style={{flexDirection: 'row', marginTop:'5%'}}>
          <View style={{flex: 1.1}}>
            <Text
              style={{fontSize: 18, textAlign: 'right', fontWeight: 'bold'}}>
              Pas encore inscrit ?{' '}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={() => navigation.navigate('register')}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#f4a259',
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}>
                Créer un compte
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            handleSubmit();
          }}>
          <Text style={styles.btnValidation}>Connexion</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => navigation.navigate('reset')}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#f4a259',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
    alignSelf: 'flex-start',
    marginLeft: 60,
    fontSize: 22,
    marginTop: 15,
    marginBottom: 8,
    fontWeight: 'bold',
  },
});
