import React, { useContext, useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  PermissionsAndroid
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import UserContext from '../components/UserContext';
import MapView, { Marker, Callout } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';
import Entypo from "react-native-vector-icons/Entypo";
import Geolocation from '@react-native-community/geolocation';

import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
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


const HomeScreen = () => {

  const [latitude, setLatitude] = useState(46.7236179);
  const [longitude, setLongitude] = useState(2.4597668);

  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [locationStatus, setLocationStatus] = useState('');

  const navigation = useNavigation();

  const [markers, setMarkers] = useState([])

  const fetchMarkers = async () => {
    firestore().collection("bike").get().then((querySnapshot) => {

      querySnapshot.forEach(element => {
        var marker = element.data();
        setMarkers(arr => [...arr, marker]);
      });
    })
  }


  const isFocused = useIsFocused();

  useEffect(() => {
    setMarkers([]);
    fetchMarkers();
  }, [isFocused]);

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
    /*return () => {
    Geolocation.clearWatch(watchID);
    }*/
  }, []);

  const ask = () => {
    setLocationStatus('Obtention de la localisation...');
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
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
    setLocationStatus('Obtention de la localisation...');
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
      <View style={{ flexDirection: 'row', backgroundColor: "#5B8E7D", height: '8%' }}>
        <View style={{ flex: 0.25, alignSelf: 'center' }}>
          <Icon name='md-menu' size={36} style={{ marginLeft: 15, color: '#fff' }} onPress={() => navigation.openDrawer()} />
        </View>
        <View style={{ flex: 0.57, alignSelf: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginLeft: -25 }}>Accueil</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#2B6747' }}>
        <View
          style={{
            flex: 2,

          }}>
          <GooglePlacesAutocomplete
            placeholder="Une petite virée en vélo ?"
            minLength={2}
            autoFocus={true}
            returnKeyType={'search'}
            onPress={(data, details = null) => {
              setLatitude(details?.geometry?.location?.lat)
              setLongitude(details?.geometry?.location?.lng)

              console.log(details);
            }}
            enablePoweredByContainer={false}
            suppressDefaultStyles
            styles={{
              textInput: styles.textInput,
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


          <View
            style={{
              flex: 0.5,
              backgroundColor: '#8CB369',
              alignItems: 'center', justifyContent: 'center',
            }}>
                      <TouchableOpacity onPress={() => ask()}>
            <View style={{
alignItems: 'center', justifyContent: 'center',
            }}>
              <Entypo name='location-pin' size={30} color={'#000'} />

            </View>
            <Text style={{
              backgroundColor: '#8CB369',
              alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 10, fontWeight:'bold',fontStyle: 'italic',bottom: 2
            }}>Votre position</Text>
                    </TouchableOpacity>
          </View>

        <View
          style={{
            flex: 0.3,
            backgroundColor: '#8CB369',
          }}>
          <TouchableOpacity style={{ backgroundColor: '#8CB369', alignItems: 'center', justifyContent: 'center', width: '100%', height: 50 }} onPress={() => navigation.navigate('List')}>
            <MaterialCommunityIcons name="file-document-multiple-outline" size={26} />
            <Text style={{ fontStyle: 'italic', fontWeight: 'bold', fontSize: 16 }}>liste</Text>

          </TouchableOpacity>
        </View>
      </View>

      <MapView
        style={{ flex: 1 }}

        initialRegion={{
          latitude: 46.7236179,
          longitude: 2.4597668,
          latitudeDelta: 0,
          longitudeDelta: 0.0131,
        }}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0,
          longitudeDelta: 0.0131,
        }}
      >
        {markers.map((marker, index) => (

          <Marker key={index} coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }} onCalloutPress={() => {
            navigation.navigate('details', {
              nom: marker.nom,
              type: marker.type,
              description: marker.description,
              etat: marker.etat,
              latitude: marker.latitude,
              longitude: marker.longitude,
              id: marker.id,
              caution: marker.caution,
              Veste: marker.Veste,
              Sonnette: marker.Sonnette,
              Sacoches: marker.Sacoches,
              Pompe: marker.Pompe,
              Lumière: marker.Lumière,
              GPS: marker.GPS,
              Casque: marker.Casque,
              Antivol: marker.Antivol,
              mail: marker.mail,
              pseudo: marker.pseudo,
            })
          }}>

            <Callout><View><Text style={{ textAlign: 'center', color: '#000', fontWeight: 'bold' }}>{marker.nom}</Text><Text style={{ textAlign: 'center', fontSize: 11 }}>Cliquer pour plus</Text><Text style={{ textAlign: 'center', fontSize: 11 }}> d'info</Text></View></Callout>
          </Marker>

        ))}

      </MapView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  textInput: {
    paddingLeft: 15,
    backgroundColor: '#E5E3E3',
    borderRadius: 2,
    height: 50
  },
  autocompleteContainer: {
    //position: 'absolute',
    top: 0,
    left: 0,
    right: 1,
    borderWidth: 1,
    borderColor: '#8CB369'
  },
  separator: {
    backgroundColor: '#efefef',
    height: 1,
  },
  separator: {
    backgroundColor: '#efefef',
    height: 1,
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

  circle: {
    width: 5,
    height: 5,
    backgroundColor: 'black',
    position: 'absolute',
    top: 20,
    left: 15,
    borderRadius: 5,
  },
  line: {
    width: 1,
    height: 50,
    backgroundColor: '#c4c4c4',
    position: 'absolute',
    top: 28,
    left: 17,
  },
  square: {
    width: 5,
    height: 5,
    backgroundColor: 'black',
    position: 'absolute',
    top: 80,
    left: 15,
  },
  dropDownStyle: {
    width: '50%',
    flex: 0.85,
    borderColor: '#838383',
    paddingHorizontal: 5,
    backgroundColor: '#adabab',
    borderRadius: 10,
    color: '#838383',
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
  },
});
