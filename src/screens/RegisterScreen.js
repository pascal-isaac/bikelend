import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native'

import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';

import auth from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';
import {updateProfile} from '@react-native-firebase/auth';

const RegisterScreen = ({navigation}, id) => {
  const [passwordVisible, setPasswordVisible] = useState(true);

  const [email, setEmail] = useState('');
  const [emailValidError, setEmailValidError] = useState('');

  const [pseudo, setPseudo] = useState('');
  const [pseudoValidError, setPseudoValidError] = useState('');

  const [borderColor, setBorderColor] = useState('#5B8E7D');
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

  const [password, setPassword] = useState('');
  const [passwordValidError, setPasswordValidError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordValidError, setConfirmPasswordValidError] =
    useState('');

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
      setBorderColor('green');
      setColor('green');
    } else if (val.length > 20) {
      setPasswordValidError(
        'Le mot de passe doit être de 20 caractères au maximum',
      );
      setBorderColor('red');
      setColor('red');
    } else if (val.length < 20) {
      setPasswordValidError('Mot de passe correct');
      setBorderColor('green');
      setColor('green');
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

    var pseudoValid = false;
    if (pseudo.length == 0) {
      setPseudoValidError('Veuillez renseigner votre pseudo');
    } else {
      setPseudoValidError('');
      pseudoValid = true;
    }

    var passwordValid = false;
    if (password.length == 0) {
      setPasswordValidError('Mot de passe requis');
    } else if (password.length < 6) {
      setPasswordValidError('Le mot de passe doit avoir minimum 6 caractères');
    } else if (confirmPassword != password) {
      setConfirmPasswordValidError(
        'Les deux mots de passe ne sont pas identique',
      );
    } else if (password.indexOf(' ') >= 0) {
      setPasswordValidError('Le mot de passe ne doit pas contenir d espace');
    } else {
      setPasswordValidError('');
      passwordValid = true;
    }

    if (emailValid && passwordValid && pseudoValid) {
      setEmail('');
      setPseudo('');
      setPassword('');
      setConfirmPassword('');
      RegisterUser();
    }
  };

  /*function create() {
        firestore().collection('Users').doc(id).add({
            nom: nom,
            prenom: prenom,
            tel: tel,
        })
    }*/

  /*const RegisterUser = () => {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then((re) => {
                console.log(re);
            })
            .catch((re) => {
                console.log(re);
            });
        create()
        navigation.navigate('login')
    }*/

  const RegisterUser = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(res => {
        const user = auth().currentUser;

        return user.updateProfile({
          displayName: pseudo,
        });
      });
    navigation.navigate('login');
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <Text style={styles.txtTitle}>Email</Text>
        <TextInput
          style={{
            borderColor: borderColor,
            fontSize: 17,
            height: 50,
            width: 300,
            borderWidth: 3,
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
          theme={{
            roundness: 10,
            colors: {primary: '#000', underlineColor: 'transparent'},
          }}
        />
        {emailValidError ? (
          <Text style={{color: 'red', marginTop: 5}}>{emailValidError}</Text>
        ) : null}

        <Text style={styles.txtTitle}>Pseudonyme</Text>
        <TextInput
          style={{
            borderColor: borderColor,
            fontSize: 17,
            height: 50,
            width: 300,
            borderWidth: 3,
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
          }}
          label="Entrez votre pseudo"
          returnKeyType="next"
          autoCapitalize="none"
          value={pseudo}
          onChangeText={value => {
            setPseudo(value);
          }}
          onFocus={() => setBorderColor('blue')}
          theme={{
            roundness: 10,
            colors: {primary: '#000', underlineColor: 'transparent'},
          }}
        />
        {pseudoValidError ? (
          <Text style={{color: 'red', marginTop: 5}}>{pseudoValidError}</Text>
        ) : null}

        <Text style={styles.txtTitle}>Mot de passe</Text>
        <TextInput
          style={{
            borderColor: borderColor,
            fontSize: 17,
            height: 50,
            width: 300,
            borderWidth: 3,
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
          }}
          label="Entrez votre mot de passe"
          secureTextEntry={passwordVisible}
          returnKeyType="next"
          autoCapitalize="none"
          value={password}
          onChangeText={value => {
            setPassword(value);
          }}
          onBlur={value => {
            handleValidPassword(value);
          }}
          onFocus={() => setBorderColor('blue')}
          right={
            <TextInput.Icon
              name={passwordVisible ? 'eye' : 'eye-off'}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          }
          theme={{
            roundness: 10,
            colors: {primary: '#000', underlineColor: 'transparent'},
          }}
        />

        {passwordValidError ? (
          <Text style={{color: color, marginTop: 5}}>{passwordValidError}</Text>
        ) : null}
        <Text style={styles.txtTitle}>Confirmation du mot de passe</Text>
        <TextInput
          style={{
            borderColor: borderColor,
            fontSize: 17,
            height: 50,
            width: 300,
            borderWidth: 3,
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
          }}
          label="Entrez votre mot de passe"
          secureTextEntry={passwordVisible}
          returnKeyType="next"
          autoCapitalize="none"
          value={confirmPassword}
          onChangeText={value => {
            setConfirmPassword(value);
            //handleConfirmPassword(value);
          }}
          onFocus={() => setBorderColor('blue')}
          right={
            <TextInput.Icon
              name={passwordVisible ? 'eye' : 'eye-off'}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          }
          theme={{
            roundness: 10,
            colors: {primary: '#000', underlineColor: 'transparent'},
          }}
        />

        {confirmPassword == password && confirmPassword != 0 && (
          <Text style={{color: 'green', marginTop: 5}}>
            Mots de passe identique
          </Text>
        )}
        {confirmPassword != password && (
          <Text style={{color: 'red', marginTop: 5}}>
            Les mots de passe ne sont pas identique{' '}
          </Text>
        )}
        {confirmPassword == 0 && password == 0 && (
          <Text style={{color: 'green', marginTop: 5}}></Text>
        )}

        <TouchableOpacity style={{alignItems: 'center'}}
          onPress={() => {
            handleSubmit();
          }}>
          <Text style={styles.btnValidation}>Création</Text>
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5b8e7d',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  btnValidation: {
    backgroundColor: '#8cb369',
    color: '#FEFEE3',
    fontSize: 30,
    textAlign: 'center',
    paddingTop: 7,
    width: 250,
    height: 60,
    marginVertical: 40,
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
    borderWidth: 2,
    paddingHorizontal: 15,
    marginTop: 5,
    borderRadius: 10,
    color: '#F2E8E8',
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
    fontSize: 20,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
  },
});
