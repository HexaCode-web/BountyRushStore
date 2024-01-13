import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { con } from "./Conf.js";
export const app = initializeApp(con);

const storage = getStorage(app);
const UPLOADPHOTO = async (path, photo) => {
  try {
    const snapshot = await uploadBytes(ref(storage, path), photo);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    // Handle the error here
    console.error("Error uploading photo:", error);
    throw error; // Rethrow the error if needed
  }
};

export default UPLOADPHOTO;
