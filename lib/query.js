import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,

  getFirestore,

  query,
  where,
} from "firebase/firestore";

import { con } from "./Conf.js";
export const app = initializeApp(con);
const db = getFirestore(app);
const QUERY = async (collectionName, propertyInDB, operation, value) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(propertyInDB, operation, value)
    );

    const querySnapshot = await getDocs(q);

    const matches = [];

    querySnapshot.forEach((doc) => {
      matches.push(doc.data());
    });

    return matches;
  } catch (error) {
    console.error("Error during query:", error);
    throw new Error("Error during query");
  }
};
export default QUERY;
