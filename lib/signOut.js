import { initializeApp } from "firebase/app";

import { getAuth, signOut } from "firebase/auth";
import { con } from "./Conf.js";
export const app = initializeApp(con);
const auth = getAuth(app);

const SIGNOUT = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      console.log(error);
    });
};
export default SIGNOUT;
