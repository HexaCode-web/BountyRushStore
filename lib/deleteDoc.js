import { initializeApp } from "firebase/app";
import { doc, getFirestore, deleteDoc } from "firebase/firestore";

import { con } from "./Conf.js";
export const app = initializeApp(con);
const db = getFirestore(app);
const DELETEDOC = async (collection = String, id = Number) => {
  try {
    await deleteDoc(doc(db, collection, id.toString()));
  } catch (error) {
    console.log(error);
  }
};
export default DELETEDOC;
