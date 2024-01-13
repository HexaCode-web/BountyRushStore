import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

import { con } from "./Conf.js";
export const app = initializeApp(con);
const db = getFirestore(app);

const GETCOLLECTION = async (target) => {
  try {
    const cleanData = [];
    const srcData = await getDocs(collection(db, target));
    srcData.forEach((doc) => {
      const info = doc.data();
      cleanData.push(info);
    });
    return cleanData;
  } catch (error) {
    return error;
  }
};

export default GETCOLLECTION;
