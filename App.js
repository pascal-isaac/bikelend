

import React, {useState, useEffect} from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import AppNavigation from './src/navigation/AppNavigation';
import {StatusBar} from 'react-native';
import UserContext from './src/components/UserContext';
import  auth from '@react-native-firebase/auth';
import {GetData} from './src/components/GetData';

const theme = {
  ...DefaultTheme,
  myOwnProperty: true,
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      text: "#F4E285",
      primary: "#f4a259",
    },
  roundness: 10,
};

export default function App() {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [latitude, setlatitude] = useState(0)
  const [longitude, setlongitude] = useState(0)
  const [markers_array, setMarkers_array] = useState([])
  const [nom, setNom] = useState("")
  const [data_, setdata_] = useState([])

  function onAuthStateChanged(user) {
    setUser(user);
    /*if (user != null){
    SetSolde_(user.uid)
    }*/
    if (initializing) setInitializing(false);
  }

  useEffect(() => {

    /*if (user != null){
      SetSolde_(user.uid)
    }*/

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; 
  }, []);

  if (initializing) return null;

  if (!user) {
      console.log('Deconnecter')
  }
  
  return (
    <PaperProvider theme={theme}>
       <StatusBar backgroundColor="#5b8e7d" barStyle="light-content" />
       <UserContext.Provider value={{user, latitude, longitude, nom, markers_array}}>
      <AppNavigation />
      </UserContext.Provider>
        </PaperProvider>
  );
};