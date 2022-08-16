import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

const ListComponent = (props) => {
    const { nom, caution, type, etat } = props
    return (
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
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>{nom}</Text>
              <Text style={{ fontSize: 14, color: '#000' }}>{caution}</Text>
              <Text style={{ fontSize: 14, color: '#000' }}>Accessoires fournis</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                <View style={{ flex: 1 }}>
                 <Text style={styles.txtfilter1}>{type}</Text>
                </View>
                <View style={{ flex: 1 }}>
                 <Text style={styles.txtfilter2}>{etat}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
    )
}

export default ListComponent


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
      height:25,
      justifyContent:'center',
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
      height:25,
      justifyContent:'center',
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
      paddingTop: 2,
    },
  });
  


