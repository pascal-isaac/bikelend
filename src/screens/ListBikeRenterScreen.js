import React, { useState, useEffect, useContext } from 'react';
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
import UserContext from '../components/UserContext';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ListBikeRenterScreen = ({ navigation }) => {
  const UserContext_ = useContext(UserContext);

  const [bikes, setBikes] = useState([])

  const getBikes = async () => {

    firestore()
      .collection('bike')
      .where('pseudo', '==', UserContext_.user.displayName)
      .onSnapshot(snap => {
        const bike = []
        snap.forEach(arr => bike.push({ ...arr.data(), id: arr.id }));
        setBikes(bike);
      });

  };

  const isFocused = useIsFocused();

  useEffect(() => {
    setBikes([]);
    getBikes();
  }, [isFocused]);


  return (
    <View style={styles.container}>
      <ScrollView>
      {bikes.map((bike, index) => (
        <View style={{ marginVertical: 5, marginHorizontal: 10 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Image
                  style={{
                    height: 120,
                    width: '100%',
                    resizeMode: 'contain',
                    borderRadius: 5
                  }}
                  source={require('../images/velo-ville.png')}
                />
              </View>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'flex-start', marginHorizontal: 10 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>{bike.nom}</Text>
                  <Text style={{ fontSize: 14, color: '#000' }}>{bike.caution}</Text>

                  <Text style={{ fontSize: 14, color: '#000' }}>Accessoires fournis</Text>

                  <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-end', top: -70, left: 8 }}>
                    <View>
                      <Text><TouchableOpacity onPress={() => firestore().collection("bike").doc(bike.id).delete()}><Icon name='delete' size={20} style={{ color: 'red', marginTop: 8 }} /></TouchableOpacity></Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.txtfilter1}>{bike.type}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.txtfilter2}>{bike.etat}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          
        </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.navigate('home')}>
        <Text style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '7%', fontSize: 16, color: "#bc4b51" }} >Retour sur la carte</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ListBikeRenterScreen;


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
