import React, { useContext, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  TextInput,
  Platform,
  Alert,
  Image,

} from 'react-native';
//import * as Progress from 'react-native-progress';

import Geolocation from '@react-native-community/geolocation';

import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';
import Entypo from "react-native-vector-icons/Entypo";

//import { TextInput } from 'react-native-paper';
import UserContext from '../components/UserContext';
import { Picker } from '@react-native-picker/picker'
import firestore from '@react-native-firebase/firestore';
import * as Yup from 'yup';
import { Formik, Field } from 'formik'
import * as ImagePicker from 'react-native-image-picker';
import { ModalPick } from '../components/ModalPick';
import { Avatar } from '../components/Avatar';
import CheckBox from '@react-native-community/checkbox';
import storage from '@react-native-firebase/storage';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import {API_GEOLOC} from "@env"


const PlaceRow = ({ data }) => {
  return (
    <View style={styles.row}>
      <View style={styles.iconContainer}>
        {data.description === 'Home'
          ? <Entypo name='home' siz={20} color={'white'} />
          : <Entypo name='location-pin' siz={20} color={'white'} />
        }
      </View>
      <Text style={styles.locationText}>{data.description || data.vicinity}</Text>
    </View>
  );
};

const LendBikeScreen = () => {
  const UserContext_ = useContext(UserContext);

  const navigation = useNavigation();

  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [pickerResponse, setPickerResponse] = useState(null);
  const [visible, setVisible] = useState(false);

  const [locationStatus, setLocationStatus] = useState('');
  const [address, setAddress] = useState('base');


  //const [uri, setUri] = useState(pickerResponse?.assets && pickerResponse.assets[0].uri);

  const uri = pickerResponse?.assets && pickerResponse.assets[0].uri;


  const uploadImage = async () => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage()
      .ref(filename)
      .putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      );
    });
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    Alert.alert(
      'Photo télécharger!',
      'Votre photo a été télécharger sur le stockage Firebase'
    );
    setPickerResponse(null);
  };


  const onImageLibraryPress = useCallback(() => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      quality: 0.25,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.launchImageLibrary(options, setPickerResponse);
  }, []);

  const onCameraPress = React.useCallback(() => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    ImagePicker.launchCamera(options, setPickerResponse);
  }, []);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const addBike = async ({ nom, description, type, etat, caution, Lumière, GPS, Casque, Sonnette, Antivol, Pompe, Sacoches, Veste }) => {
    await firestore().collection('bike').add({
      nom: nom,
      description: description,
      pseudo: UserContext_.user.displayName,
      mail: UserContext_.user.email,
      type: type,
      latitude: latitude,
      longitude: longitude,
      etat: etat,
      Lumière: Lumière,
      Casque: Casque,
      Sonnette: Sonnette,
      Antivol: Antivol,
      GPS: GPS,
      Pompe: Pompe,
      Sacoches: Sacoches,
      Veste: Veste,
      caution: caution,
      id: UserContext_.user.uid,
    }).then(() => {
      console.log('Vélo ajouté');
    }).catch(error => {
      console.log(error);
    })
  }

  const CautionList = [
    "Aucun",
    "Chèque",
    "Pièce d’identité",
  ]

  const EtatList = [
    "A définir",
    "Comme neuf",
    "Réparation",
    "Bon état",
    "Etat moyen"
  ]

  const TypeList = [
    "Aucun",
    "Tout terrain",
    "Ville",
    "Route",
    "Enfant",
    "Electrique",
    "Autre"
  ]


  const validationIncomes = Yup.object().shape({
    nom: Yup
      .string("nom invalide")
      .required("Veuillez renseigner un nom pour le vélo"),
    description: Yup
      .string("description invalide")
      .required("Veuillez renseigner une description"),
    type: Yup
      .string()
      .required("Selectionner une catégorie"),
    etat: Yup
      .string()
      .required("Selectionner une catégorie"),
    caution: Yup
      .string()
      .required("Selectionner une catégorie"),

  })

  const initialValues = {
    nom: '',
    description: '',
    type: '',
    etat: '',
    caution: '',
    Lumière: false,
    Casque: false,
    Sonnette: false,
    Antivol: false,
    GPS: false,
    Pompe: false,
    Sacoches: false,
    Veste: false,
  }

  useEffect(() => {

    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Votre localisation est nécessaire pour la position du vélo',
            message:
              'L application a besoin de votre position ',
            buttonNext: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation();
          //subscribeLocationLocation();
          console.log('Position donnée');
          setLocationStatus('Position donnée');
        } else {
          console.log('Position refusée');
          setLocationStatus('Position refusée');
        }
      } catch (err) {
        console.warn(err);
      }
    }
    requestLocationPermission();
  }, []);


  const ask = () => {
    setLocationStatus('Obtention de la localisation...');
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
      .then(data => {
        if (data === "already-enabled") {
          getOneTimeLocation()
        } else {
          setTimeout(() => {
            getOneTimeLocation()
          }, 1000)
        }
      })
  }

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus('Vous etes ici');
        console.log(position);
        const currentLatitude = position.coords.latitude;
        const currentLongitude = position.coords.longitude;

        setLongitude(currentLongitude);
        setLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 }
    );
  }

  return (
    <View style={styles.container}>
      <Avatar uri={uri} onPress={() => setVisible(true)} />
      <ModalPick
        isVisible={visible}
        onClose={() => setVisible(false)}
        onImageLibraryPress={onImageLibraryPress}
        onCameraPress={onCameraPress}
      />

      <View style={{ flexDirection: 'row', marginTop: 35, marginBottom: 10, marginHorizontal: 20 }}>
        <View
          style={{
            backgroundColor: '#F4E285', left: -5,
            alignItems: 'center', justifyContent: 'center', flex: 0.25,
          }}>
          <TouchableOpacity onPress={() => ask()}>
            <View style={{
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Entypo name='location-pin' size={30} color={'#000'} />

            </View>
            <Text style={{
              backgroundColor: '#F4E285',

              alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 10, fontWeight: 'bold', fontStyle: 'italic', bottom: 2
            }}>Votre position</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <GooglePlacesAutocomplete
            placeholder="Adresse de la position du vélo"
            onChangeText={(searchtext) =>
              setAddress({ searchtext })
            }
            minLength={2}
            autoFocus={true}
            returnKeyType='search'
            onPress={(data, details = null) => {
              setLatitude(details?.geometry?.location?.lat)
              setLongitude(details?.geometry?.location?.lng)

              console.log(details);
            }}
            enablePoweredByContainer={false}
            suppressDefaultStyles
            styles={{
              textInput: styles.textInputSearch,
              container: styles.autocompleteContainer,
              listView: styles.listView,
              separator: styles.separator,
            }}
            fetchDetails
            query={{
              key: API_GEOLOC,
              language: 'fr',
            }}
            renderRow={(data) => <PlaceRow data={data} />}
            renderDescription={(data) => data.description || data.vicinity}
          />
        </View>

      </View>
      <Formik
        initialValues={initialValues}
        validationSchema={validationIncomes}
        onSubmit={values => [navigation.navigate('home', { values }), console.log(values)]}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isValid }) => (
          <ScrollView>

            <View style={{ marginTop: 5, marginBottom: 35, marginHorizontal: 20 }}>
              <Text style={styles.txtTitle}>A propos du vélo</Text>
              <TextInput
                style={{
                  borderColor: '#5B8E7D',
                  fontSize: 17,
                  height: 40,
                  width: '100%',
                  borderWidth: 3,
                  paddingHorizontal: 15,
                  marginTop: 5,
                  alignSelf: 'center',
                  backgroundColor: '#F4A259',
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
                }}
                placeholder="Nom du vélo"
                returnKeyType="next"
                onChangeText={handleChange('nom')}
                onBlur={handleBlur('nom')}
                theme={{
                  roundness: 10,
                  colors: { primary: '#000', underlineColor: 'transparent' },
                }}
              />

              <TextInput
                style={{
                  borderColor: '#5B8E7D',
                  fontSize: 17,
                  width: '100%',
                  borderWidth: 3,
                  height: 60,
                  paddingHorizontal: 15,
                  marginTop: 5,
                  alignSelf: 'center',
                  backgroundColor: '#F4A259',
                  borderRadius: 10,
                  color: '#F2E8E8',
                  multiLine: true,
                  numberOfLines: 4,
                  shadowColor: 'black',
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 6.84,
                  elevation: 5,
                }}
                placeholder="Description"
                returnKeyType="next"
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                theme={{
                  roundness: 10,
                  colors: { primary: '#000', underlineColor: 'transparent' },
                }}
              />
              <Text style={styles.txtTitle}>Type de vélo</Text>
              <View style={styles.dropDownStyle}>
                <Picker
                  style={styles.input}
                  selectedValue={values.type}
                  onValueChange={handleChange('type')}
                >
                  {TypeList.map((item, index) => {
                    return (<Picker.Item label={item} value={item} key={index} />)
                  })}
                </Picker>
              </View>

              <Text style={styles.txtTitle}>Etat du vélo</Text>
              <View style={styles.dropDownStyle}>
                <Picker
                  style={styles.input}
                  selectedValue={values.etat}
                  onValueChange={handleChange('etat')}
                >
                  {EtatList.map((item, index) => {
                    return (<Picker.Item label={item} value={item} key={index} />)
                  })}
                </Picker>
              </View>

              <Text style={styles.txtTitle}>Accessoires mis à disposition</Text>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{ paddingTop: 4 }}>Lumière</Text>
                <CheckBox
                  value={values?.Lumière}
                  tintColors={{ true: '#bc4b51' }} onCheckColor={{ true: '#bc4b51' }}
                  onValueChange={nextValue => setFieldValue('Lumière', nextValue)}
                />
                <Text style={{ paddingTop: 4 }}>Casque</Text>
                <CheckBox
                  value={values?.Casque}
                  tintColors={{ true: '#bc4b51' }} onCheckColor={{ true: '#bc4b51' }}
                  onValueChange={nextValue => setFieldValue('Casque', nextValue)}
                />
                <Text style={{ paddingTop: 4 }}>Sonnette</Text>
                <CheckBox
                  value={values?.Sonnette}
                  tintColors={{ true: '#bc4b51' }} onCheckColor={{ true: '#bc4b51' }}
                  onValueChange={nextValue => setFieldValue('Sonnette', nextValue)}
                />
              </View>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{ paddingTop: 4 }}>Pompe   </Text>
                <CheckBox
                  value={values?.Pompe}
                  tintColors={{ true: '#bc4b51' }} onCheckColor={{ true: '#bc4b51' }}
                  onValueChange={nextValue => setFieldValue('Pompe', nextValue)}
                />
                <Text style={{ paddingTop: 4 }}>Antivol </Text>
                <CheckBox
                  value={values?.Antivol}
                  tintColors={{ true: '#bc4b51' }} onCheckColor={{ true: '#bc4b51' }}
                  onValueChange={nextValue => setFieldValue('Antivol', nextValue)}
                />
                <Text style={{ paddingTop: 4 }}>Sacoches</Text>
                <CheckBox
                  value={values?.Sacoches}
                  tintColors={{ true: '#bc4b51' }} onCheckColor={{ true: '#bc4b51' }}
                  onValueChange={nextValue => setFieldValue('Sacoches', nextValue)}
                />
              </View>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{ paddingTop: 4 }}>Veste</Text>
                <CheckBox
                  value={values?.Veste}
                  tintColors={{ true: '#bc4b51' }} onCheckColor={{ true: '#bc4b51' }}
                  onValueChange={nextValue => setFieldValue('Veste', nextValue)}
                />
                <Text style={{ paddingTop: 4 }}>GPS</Text>
                <CheckBox
                  value={values?.GPS}
                  tintColors={{ true: '#bc4b51' }} onCheckColor={{ true: '#bc4b51' }}
                  onValueChange={nextValue => setFieldValue('GPS', nextValue)}
                />
              </View>

              <Text style={styles.txtTitle}>Moyen de caution</Text>
              <View style={styles.dropDownStyle}>
                <Picker
                  style={styles.input}
                  selectedValue={values.caution}
                  onValueChange={handleChange('caution')}
                >
                  {CautionList.map((item, index) => {
                    return (<Picker.Item label={item} value={item} key={index} />)
                  })}
                </Picker>
              </View>

              <TouchableOpacity style={{ alignItems: 'center', marginVertical: 10, justifyContent: 'center', height: 50, borderRadius: 30 }} onPress={() => {
                handleSubmit()
                if (isValid) {
                  addBike(values)
                }
              }} title="Submit">
                <Text style={styles.btnValidation}>Ajouter</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

export default LendBikeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4E285',
    flex: 1
  },
  btnValidation: {
    backgroundColor: '#F4A259',
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
  textInputSearch: {
    borderColor: '#5B8E7D',
    fontSize: 17,
    width: '100%',
    borderWidth: 3,
    paddingHorizontal: 15,
    marginTop: 5,
    alignSelf: 'center',
    backgroundColor: '#F4A259',
    borderRadius: 10,
    color: '#000',
    multiLine: true,
    numberOfLines: 3,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,

  },
  iconContainer: {
    backgroundColor: '#a2a2a2',
    padding: 5,
    borderRadius: 50,
    marginRight: 15,
  },
  locationText: {
    color: '#000',
  },
  autocompleteContainer: {
    //position: 'absolute',
    top: 0,
    left: 0,
    right: 1,
  },
  separator: {
    backgroundColor: '#efefef',
    height: 1,
  },
  txtTitle: {
    color: '#000',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  dropDownStyle: {
    borderColor: '#5B8E7D',
    paddingHorizontal: 5,
    borderWidth: 3,
    backgroundColor: '#F4A259',
    borderRadius: 8,
    color: '#FFF',
    height: 35,
    textAlign: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    elevation: 5,
    marginVertical: 10
  },
});