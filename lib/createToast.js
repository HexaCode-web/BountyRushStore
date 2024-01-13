import { toast } from "react-toastify";

const CreateToast = (text, type, duration = 5000) => {
  let value;
  switch (type) {
    case "success":
      value = toast.success;
      break;
    case "info":
      value = toast.info;
      break;
    case "warning":
      value = toast.warn;
      break;
    case "error":
      value = toast.error;
      break;
    default:
      value = toast;
      break;
  }
  return value(text, {
    position: "bottom-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
export default CreateToast;
