import React, { useState,useEffect,useContext } from "react";

import firestore from '@react-native-firebase/firestore';

export const GetData = async () => {
    
    let markers__ = 0
    let markers__array = []

    await firestore()
    .collection('markers')
    .get()
    .then(documentSnapshot => {

        if (documentSnapshot != null) {

            markers__array = documentSnapshot._docs

        for (let i = 0; i < documentSnapshot._docs.length; i++) {
            
            markers__ = markers__ + Number(documentSnapshot._docs[i].data().amount)
            
        }


        } else {
        console.log(" Document marker does not exist ");
        }

    })

    return {markers__array,markers__}

}