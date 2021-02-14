import firebase from "firebase";
import 'firebase/app'
import 'firebase/firestore'
import { firebaseConfig } from './firebase-config'

firebase.initializeApp(firebaseConfig);
const recipes = firebase.firestore().collection('recipes');

export {
  recipes
}
