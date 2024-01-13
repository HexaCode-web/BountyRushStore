import { initializeApp } from "firebase/app";
import { doc, setDoc, getFirestore } from "firebase/firestore";

import { con } from "./Conf.js";
import GETDOC from "./getDoc.js";
export const app = initializeApp(con);
const db = getFirestore(app);
const SETDOC = async (
  collection = String,
  id = Number,
  newValue = Object,
  New = ""
) => {
  if (New) {
    await setDoc(doc(db, collection, id.toString()), newValue);
  }
  const res = await GETDOC(collection, id);
  if (res === "Error") {
    throw new Error(`No data found`);
  } else {
    await setDoc(doc(db, collection, id.toString()), newValue);
  }
};
export default SETDOC;
