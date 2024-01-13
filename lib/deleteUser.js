import GETDOC from "./getDoc";
import SETDOC from "./setDoc";

const DELETEUSER = async (id) => {
  const userToDelete = await GETDOC("users", id);
  await SETDOC("users", id, {
    ...userToDelete,
    deleteUser: true,
    Username: "",
  });
  try {
    return "user Deleted";
    // eslint-disable-next-line no-unreachable
  } catch (error) {
    throw error.message;
  }
};
export default DELETEUSER;
