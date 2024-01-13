import { initializeApp } from "firebase/app";
import { getDoc, getFirestore, doc } from "firebase/firestore";

import { con } from "./Conf.js";
export const app = initializeApp(con);
const db = getFirestore(app);

const GETDOC = async (collection, id) => {
  try {
    const docSnap = await getDoc(doc(db, collection, id.toString()));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return "Error";
    }
  } catch (error) {
    return error;
  }
};

export default GETDOC;
