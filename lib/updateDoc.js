import { initializeApp } from "firebase/app";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

import { con } from "./Conf.js";
export const app = initializeApp(con);
const db = getFirestore(app);

const UPDATEDOC = async (collection = String, id, newData = Object) => {
  try {
    await updateDoc(doc(db, collection, id.toString()), newData);
  } catch (error) {
    console.log(error);
  }
};
export default UPDATEDOC;
