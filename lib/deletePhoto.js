import { initializeApp } from "firebase/app";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { con } from "./Conf.js";
const app = initializeApp(con);

const storage = getStorage(app);
const DELETEPHOTO = async (path) => {
  await deleteObject(ref(storage, path));
};

export default DELETEPHOTO;
