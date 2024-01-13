import { initializeApp } from "firebase/app";
import { con } from "./Conf.js";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";

const app = initializeApp(con);
const db = getFirestore(app);

export const REALTIME = (collection, id, setData) => {
  const docRef = doc(db, collection, id);
  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    setData(snapshot.data());
  });

  return unsubscribe;
};
