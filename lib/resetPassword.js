import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { con } from "./Conf.js";
export const app = initializeApp(con);
const auth = getAuth(app);
const RESETPASSWORD = (email) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      // Email sent.
      console.log("Password reset email sent successfully");
    })
    .catch((error) => {
      console.log(error);
      // An error happened.
    });
};
export default RESETPASSWORD;
