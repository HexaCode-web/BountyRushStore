import { initializeApp } from "firebase/app";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { con } from "./Conf.js";
export const app = initializeApp(con);
const auth = getAuth(app);
const NEWUSER = async (Email, Password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      Email,
      Password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default NEWUSER;
