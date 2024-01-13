"use client";
import React, { useEffect } from "react";
import CreateToast from "@/lib/createToast";
import RESETPASSWORD from "@/lib/resetPassword";
import DELETEDOC from "@/lib/deleteDoc";
import DELETECURRENTUSER from "@/lib/deleteCurrentUser";
import LOGIN from "@/lib/login";
import SETDOC from "@/lib/setDoc";
import NEWUSER from "@/lib/newUser";
import GETDOC from "@/lib/getDoc";

import MyModal from "../components/Modal/Modal";
import { ToastContainer } from "react-toastify";
import "./User.css";
import Loading from "../loading";
import decrypt from "@/lib/decrypt";
import encrypt from "@/lib/encrypt";
import Nav from "../components/Nav/Nav";
import Input from "@/lib/Input/Input";
export default function User() {
  const [user, setUser] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [IsAdmin, setIsAdmin] = React.useState(false);
  const [showSignup, setShowSignUp] = React.useState(false);
  const [Email, setEmail] = React.useState("");
  const [loginData, setLoginData] = React.useState({
    Email: "",
    Password: "",
  });
  const [newUser, setNewUser] = React.useState({
    DeleteUser: false,
    Lname: "",
    Fname: "",
    Username: "",
    Email: "",
    Phone: "",
    CartCount: 0,
    History: [],
    PendingOrders: [],
    PendingRefunds: [],
    PendingProducts: [],
    Cart: [],
    Roles: [154, 676],
    Wishlist: [],
    Active: false,
    Wallet: 0,
    joinedAt: getCurrentDateFormatted(),
    Password: "",
    PaymentMethods: {
      InstaPay: "",
      VodafoneCash: "",
      PayPal: "",
    },
  });

  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handlePrimaryAction = async () => {
    handleCloseModal();
    try {
      RESETPASSWORD(Email);
      CreateToast("Email has been sent", "success");
    } catch (error) {
      CreateToast(error, "error");
    }
    setEmail("");
  };

  const changeForm = () => {
    setShowSignUp((prev) => !prev);
    setLoginData({
      Email: "",
      Password: "",
    });
    setNewUser((prev) => {
      return { ...prev, Email: "", Password: "", Username: "" };
    });
  };
  useEffect(() => {
    const CheckUser = async () => {
      // Check if window is defined to avoid errors during server-side rendering
      if (typeof window !== "undefined") {
        const storedActiveUser = sessionStorage.getItem("activeUser");

        // Check if sessionStorage has the item before using it
        if (storedActiveUser) {
          const decryptedId = decrypt(JSON.parse(storedActiveUser));

          const fetchedUser = await GETDOC("users", decryptedId);
          fetchedUser?.Roles.includes(649)
            ? setIsAdmin(true)
            : setIsAdmin(false);
          setUser(fetchedUser);
        }
      }
    };
    CheckUser();
    setIsLoading(false);
  }, []);
  const UpdateInput = (form, event) => {
    if (form === "login") {
      const { name, value } = event.target;
      setLoginData((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
    if (form === "newUser") {
      const { name, value } = event.target;
      setNewUser((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };
  function getCurrentDateFormatted() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = String(currentDate.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  const Signup = async (e) => {
    CreateToast("creating account...", "info");
    e.preventDefault();

    try {
      const authUser = await NEWUSER(newUser.Email, newUser.Password);
      await SETDOC(
        "users",
        authUser.uid,
        { ...newUser, id: authUser.uid },
        true
      );
      CreateToast("Successfully signed up! You can now login.", "success");
      setShowSignUp(false);
    } catch (error) {
      CreateToast(error.message, "error");
      return;
    }
  };
  const signIn = async (e) => {
    e.preventDefault();
    try {
      const authUser = await LOGIN(loginData.Email, loginData.Password);
      const DBuser = await GETDOC("users", authUser.uid);
      if (DBuser.deleteUser) {
        await DELETEDOC("users", authUser.uid),
          await DELETECURRENTUSER(),
          CreateToast("sorry your account have been deleted", "info");
        return;
      }
      await SETDOC("users", authUser.uid, { ...DBuser, Active: true });

      const encryptedUserID = encrypt(authUser.uid);

      sessionStorage.setItem("activeUser", JSON.stringify(encryptedUserID));
      window.location.href = "/Profile";
    } catch (error) {
      CreateToast(error.message, "error");
    }
  };

  return (
    <>
      <Nav />
      <Loading loading={isLoading} />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {user ? (
        <>
          {IsAdmin
            ? window.location.replace("/Dashboard")
            : window.location.replace("/Profile")}
        </>
      ) : (
        <div className="Container ">
          <h3
            className="animate__animated animate__fadeInDown"
            style={{ animationDelay: ".5s" }}
          >
            {!showSignup ? "Welcome Back!" : "Register"}
          </h3>
          {showSignup ? (
            <form className="animate__animated animate__fadeInDown">
              <Input
                label="Email"
                type="Email"
                required={true}
                id="Email"
                name="Email"
                value={newUser.Email}
                onChangeFunction={() => {
                  UpdateInput("newUser", event);
                }}
              />

              <Input
                label="Username"
                type="text"
                required={true}
                id="Username"
                name="Username"
                value={newUser.Username}
                onChangeFunction={() => {
                  UpdateInput("newUser", event);
                }}
              />

              <Input
                label="Password"
                type="password"
                required={true}
                id="Password"
                name="Password"
                value={newUser.Password}
                onChangeFunction={() => {
                  UpdateInput("newUser", event);
                }}
              />

              <input type="submit" value="sign up" onClick={Signup}></input>
            </form>
          ) : (
            <form className="animate__animated animate__fadeInDown">
              <Input
                label="Email"
                type="Email"
                required={true}
                id="Email"
                name="Email"
                value={loginData.Email}
                onChangeFunction={(event) => {
                  UpdateInput("login", event);
                }}
              />
              <Input
                label="Password"
                type="password"
                required={true}
                id="Password"
                name="Password"
                value={loginData.Password}
                onChangeFunction={() => {
                  UpdateInput("login", event);
                }}
              />

              <input type="submit" value="login" onClick={signIn}></input>
            </form>
          )}
          <p
            className="animate__animated animate__fadeInUp"
            style={{
              textAlign: "center",
              animationDelay: "1s",
              marginTop: "15px",
            }}
          >
            {!showSignup ? "not a user?" : "already have an account?"}{" "}
            <span style={{ cursor: "pointer" }} onClick={changeForm}>
              {!showSignup ? "sign up now" : "sign in now!"}
            </span>
          </p>
          <button
            style={{
              border: "none",
              animationDelay: "1.1s",
              opacity: ".7",
              fontSize: ".8rem",
            }}
            className="animate__animated animate__fadeInUp"
            onClick={handleShowModal}
          >
            Forgot Password?
          </button>
          <MyModal
            show={showModal}
            handleClose={handleCloseModal}
            title="Reset password"
            primaryButtonText="send Email"
            handlePrimaryAction={handlePrimaryAction}
          >
            <>
              <p>
                please put your Email and if its a valid Email we will send a
                reset password link to it
              </p>
              <div className="formItem ">
                <label htmlFor="Email">Email:</label>
                <input
                  required
                  type="Email"
                  value={Email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                ></input>
              </div>
            </>
          </MyModal>
        </div>
      )}
    </>
  );
}
