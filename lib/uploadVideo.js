import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { con } from "./Conf.js";
export const app = initializeApp(con);

const storage = getStorage(app);
const UPLOADVIDEO = async (path, photo, onProgress) => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, photo);

  // Subscribe to the "state_changed" event to track the upload progress
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      onProgress(progress); // Pass the progress value to the provided onProgress callback
    },
    (error) => {
      throw new Error(`Error uploading photo: ${error.message}`);
    }
  );

  try {
    await uploadTask; // Wait for the upload to complete
    const url = await getDownloadURL(uploadTask.snapshot.ref);
    return url;
  } catch (error) {
    throw new Error(`Error getting download URL: ${error.message}`);
  }
};

export default UPLOADVIDEO;
