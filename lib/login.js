import { initializeApp } from "firebase/app";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { con } from "./Conf.js";
export const app = initializeApp(con);
const auth = getAuth(app);

const LOGIN = async (Email, Password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      Email,
      Password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default LOGIN;
