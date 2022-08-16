import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    ImageBackground,
} from 'react-native';


import MapView, { Marker, Callout } from 'react-native-maps';

import UserContext from '../components/UserContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { Linking } from 'react-native'


const DetailsBikeScreen = ({ route, navigation }) => {
    const UserContext_ = useContext(UserContext);

    const { nom, pseudo, type, latitude, longitude, mail, id, etat, description, caution, Veste, Sonnette, Sacoches, Pompe, Lumière, GPS, Casque, Antivol } = route.params;

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', backgroundColor: "#5B8E7D", height: '8%' }}>
                <View style={{ flex: 0.25, alignSelf:'center' }}>
                    <Icon name='arrow-back-outline' size={36} style={{ marginLeft: 15, color: '#fff' }} onPress={() => navigation.goBack()} />
                </View>
                <View style={{ flex: 0.57, alignSelf:'center' }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, textAlign:'center', marginLeft:-25 }}>Fiche vélo</Text>
                </View>
            </View>
            <ScrollView>
                <Image
                    style={{
                        height: 220,
                        width: '100%',
                    }}
                    source={require('../images/velo-ville.png')}
                />
                <Text style={styles.txtLender}>Propriété de {pseudo}</Text>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                    <View style={{ flex: 1, marginHorizontal: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000', textAlign: 'center', top: -16 }}>{nom}</Text>
                        <Text style={{ fontSize: 14, color: '#000', textAlign: 'justify', top: -10 }}> {description}
                        </Text>

                        <Text style={styles.titleZone}>Caractéristiques</Text>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', marginVertical: '2%' }}>
                            <View>
                                <Text style={styles.txtfilter1}>{type}</Text>
                            </View>
                            <View>
                                <Text style={styles.txtfilter2}>{etat}</Text>
                            </View>
                        </View>

                        <Text style={styles.titleZone}>Accessoires fournis</Text>
                        <View style={{ flex: 1, flexDirection: 'row', marginVertical: '2%' }}>
                            {Casque == true && <View>
                                <Text style={styles.txtfilter3}>Casque</Text>
                            </View>}

                            {Lumière == true && <View>
                                <Text style={styles.txtfilter3}>Lumière</Text>
                            </View>}
                            {Pompe == true && <View>
                                <Text style={styles.txtfilter3}>Pompe</Text>
                            </View>}
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', marginVertical: '2%' }}>

                            {Antivol == true && <View>
                                <Text style={styles.txtfilter3}>Antivol</Text>
                            </View>}

                            {Sacoches == true && <View>
                                <Text style={styles.txtfilter3}>Sacoches</Text>
                            </View>}

                            {Sonnette == true && <View>
                                <Text style={styles.txtfilter3}>Sonnette</Text>
                            </View>}
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', marginBottom: '2%' }}>
                            {GPS == true && <View>
                                <Text style={styles.txtfilter3}>GPS</Text>
                            </View>}
                            {Veste == true && <View>
                                <Text style={styles.txtfilter3}>Veste</Text>
                            </View>}
                        </View>

                        <Text style={styles.titleZone}>Moyen de caution</Text>
                        <View style={{ marginVertical: '1%' }}>
                            <Text style={styles.txtZone}>{caution}</Text>
                        </View>

                        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => Linking.openURL(`mailto:${mail}?subject=Emprunt vélo via BikeLend&body=Bonjour,\n\n\n Cordialement, \n${UserContext_.user.displayName} \n\n Message envoyé grace à l'application BikeLend `)}><Text style={styles.btnLend}>Envoyer un mail au prêteur</Text></TouchableOpacity>

                        <Text style={styles.titleZone}>Localisation</Text>
                        <Text style={styles.txtZone}>La localisation exacte vous sera communiquée par le prêteur</Text>

                    </View>
                </View>
                <MapView
                    style={{ width: '100%', height: 135, backgroundColor: 'white', marginTop: '2%' }}
                    maxZoomLevel={16}
                    initialRegion={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0,
                        longitudeDelta: 0.0131,
                    }}
                >
                    <Marker icon={require('../images/roundloca.png')} width={75} height={75}
                        coordinate={{
                            latitude: latitude,
                            longitude: longitude,
                        }} >
                        <Callout><Text>Vélo La Manu</Text></Callout>
                    </Marker>
                </MapView>
            </ScrollView>
        </View>
    );
};
export default DetailsBikeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4E285',
    },
    txtfilter1: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6.84,
        elevation: 5,
        backgroundColor: '#CC2A2A',
        borderRadius: 25,
        width: 100,
        height: 25,
        justifyContent: 'center',
        paddingTop: 2,
        marginRight: '3%',
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
        width: 100,
        height: 25,
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        paddingTop: 2,
        textAlign: 'center'
    },
    txtfilter3: {
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6.84,
        elevation: 5,
        backgroundColor: '#302C2C',
        borderRadius: 25,
        width: 100,
        height: 25,
        justifyContent: 'center',
        marginRight: '4.5%',
        color: '#fff',
        fontWeight: 'bold',
        paddingTop: 2,
        textAlign: 'center'
    },
    txtLender: {
        color: '#f9c74f', fontWeight: 'bold', textAlign: 'center', marginRight: '2%', fontSize: 28, top: -120, transform: [{ rotate: '-30deg' }]
    },
    titleZone: {
        fontSize: 16, color: '#000', fontWeight: 'bold'
    },
    txtZone: {
        fontSize: 13, color: '#000', marginBottom: 2
    },
    btnLend: {
        paddingTop: 4,
        backgroundColor: '#5B8E7D',
        color: '#FFF',
        fontSize: 22,
        textAlign: 'center',
        width: '80%',
        height: 40,
        marginVertical: 10,
        borderRadius: 10,
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
