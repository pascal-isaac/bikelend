import React, {  useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import ListComponent from "../components/ListComponent";


const ListBikeScreen = ({ navigation }) => {

  const [bikes, setBikes] = useState([])

  const fetchBikes = async () => {
    firestore().collection("bike").get().then((querySnapshot) => {

      querySnapshot.forEach(element => {
        var bike = element.data();
        setBikes(arr => [...arr, bike]);

      });
    })
  }


  const isFocused = useIsFocused();

  useEffect(() => {
    setBikes([]);
    fetchBikes();
  },[isFocused]);


  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ marginVertical: 15, marginHorizontal: 10 }}>
          
            {bikes.map((bike, index) => (
          <TouchableOpacity key={index} onPress={() => {
            navigation.navigate('details', {
              nom: bike.nom,
              type: bike.type,
              description: bike.description,
              etat: bike.etat,
              latitude: bike.latitude,
              longitude: bike.longitude,
              id: bike.id,
              caution: bike.caution,
              Veste: bike.Veste,
              Sonnette: bike.Sonnette,
              Sacoches: bike.Sacoches,
              Pompe: bike.Pompe,
              Lumière: bike.Lumière,
              GPS: bike.GPS,
              Casque: bike.Casque,
              Antivol: bike.Antivol,
              mail: bike.mail,
              pseudo: bike.pseudo,
            })
          }}>
                
              <ListComponent key={index} nom={bike.nom} caution={bike.caution} type={bike.type} etat={bike.etat} />
              </TouchableOpacity>
            ))}
          
        </View>

      </ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate('home')}>
        <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '7%', fontSize: 16, color: "#bc4b51" }} >Retour sur la carte</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ListBikeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4E285',
  },
  txtfilter1: {
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    elevation: 5,
    backgroundColor: '#CC2A2A',
    borderRadius: 25,
    width: '100%',
    height: 25,
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 2,
  },
  txtfilter2: {
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
    elevation: 5,
    backgroundColor: '#34B541',
    borderRadius: 25,
    marginHorizontal: 8,
    width: '100%',
    height: 25,
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 2,
  },
});
