import { initializeApp } from "firebase/app";

import { getAuth, deleteUser } from "firebase/auth";
import { con } from "./Conf.js";
export const app = initializeApp(con);
const auth = getAuth(app);

const DELETECURRENTUSER = async () => {
  const user = auth.currentUser;
  deleteUser(user).catch((error) => {
    console.log(error);
  });
};
export default DELETECURRENTUSER;
