import { initializeApp } from "firebase/app";
import { getAuth, updateEmail, onAuthStateChanged } from "firebase/auth";
import { con } from "./Conf.js";
export const app = initializeApp(con);
const auth = getAuth(app);

const UPDATEEMAIL = async (newEmail = "") => {
  try {
    onAuthStateChanged(auth, (user) => {
      updateEmail(user, newEmail);
    });
    return "Email updated successfully";
  } catch (error) {
    throw new Error(error.message);
  }
};

export default UPDATEEMAIL;
