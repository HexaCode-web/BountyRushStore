"use client";
import React, { useEffect, useState } from "react";
import MyModal from "../../components/Modal/Modal";
import "react-toastify/dist/ReactToastify.css";
import LOGIN from "@/lib/login";
import RESETPASSWORD from "@/lib/resetPassword";
import SETDOC from "@/lib/setDoc";
import UPDATEEMAIL from "@/lib/updateEmail";
import GETDOC from "@/lib/getDoc";
import GETCOLLECTION from "@/lib/getCollection";
import DELETEDOC from "@/lib/deleteDoc";
import CreateToast from "@/lib/createToast";
import decrypt from "@/lib/decrypt";
import encrypt from "@/lib/encrypt";
import { ToastContainer } from "react-toastify";
import Nav from "@/app/components/Nav/Nav";
import Input from "@/lib/Input/Input";
import "./SettingsStyles.css";
export default function Settings() {
  const [activePage, setActivePage] = React.useState("Login");
  const [showModal, setShowModal] = React.useState(false);
  const [loginData, setLoginData] = React.useState({
    Email: "",
    Password: "",
  });
  const [ActiveUser, setActiveUser] = React.useState("");
  const [oldEmail, setOldEmail] = useState("");
  useEffect(() => {
    const CheckUser = async () => {
      // Check if window is defined to avoid errors during server-side rendering
      if (typeof window !== "undefined") {
        const storedActiveUser = sessionStorage.getItem("activeUser");

        // Check if sessionStorage has the item before using it
        if (storedActiveUser) {
          const decryptedId = decrypt(JSON.parse(storedActiveUser));

          const fetchedUser = await GETDOC("users", decryptedId);
          //   fetchedUser?.Roles.includes(649)
          //     ? setIsAdmin(true)
          //     : setIsAdmin(false);
          setActiveUser(fetchedUser);
          setOldEmail(fetchedUser.Email);
        }
      }
    };
    CheckUser();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setActiveUser((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handlePayments = (e) => {
    const { name, value } = e.target;
    setActiveUser((prev) => {
      return {
        ...prev,
        PaymentMethods: { ...prev.PaymentMethods, [name]: value },
      };
    });
  };
  const UpdateUser = async (targetUser, popups) => {
    try {
      await SETDOC("users", targetUser.id, { ...targetUser });
      popups
        ? CreateToast("your changes have been saved", "success", 3000)
        : "";
    } catch (error) {
      console.log("error:", error);
      popups ? CreateToast("something went wrong", "error", 3000) : "";
    }
  };
  const SaveData = async (e) => {
    let userToSend;
    e.preventDefault();
    const usersList = await GETCOLLECTION("users");
    const Match = usersList.find((user) => {
      return user.Email === ActiveUser.Email;
    });
    if (Match) {
      userToSend = { ...ActiveUser, Email: oldEmail };
      CreateToast("Email wasn't updated due to it was  taken", "error");
    } else {
      userToSend = ActiveUser;
      try {
        await UPDATEEMAIL(ActiveUser.Email);
        CreateToast("Data updated", "success");
      } catch (error) {
        CreateToast(error.message, "error");
      }
    }
    UpdateUser(userToSend, true);
  };
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = async (e) => {
    await DELETEDOC("users", ActiveUser.id);
    setShowModal(false);
    sessionStorage.clear();
    setTimeout(() => {
      window.location.href = "/User";
    }, 500);
  };
  useEffect(() => {
    const FetchUser = async () => {
      GETDOC("users", ActiveUser.id).then((res) => setActiveUser(res));
    };
    FetchUser();
  }, []);
  const SendResetEmail = async () => {
    try {
      RESETPASSWORD(ActiveUser.Email);
      CreateToast("Email has been sent", "success");
    } catch (error) {
      CreateToast(error, "error");
    }
  };
  const signIn = async (e) => {
    e.preventDefault();
    if (loginData.Email === ActiveUser.Email) {
      try {
        const authUser = await LOGIN(loginData.Email, loginData.Password);
        const DBuser = await GETDOC("users", authUser.uid);
        await SETDOC("users", authUser.uid, { ...DBuser, Active: true });
        const encryptedUserID = encrypt(authUser.uid);
        sessionStorage.setItem("activeUser", JSON.stringify(encryptedUserID));
        setActivePage("General");
      } catch (error) {
        CreateToast(error.message, "error");
      }
    } else {
      CreateToast("Email doesn't match the signed in one", "error");
    }
  };
  const UpdateInput = (event) => {
    const { name, value } = event.target;
    setLoginData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  return (
    <>
      <Nav />
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
      {activePage === "Login" ? (
        <div className="Container">
          <h3> please login once more </h3>
          <form className="animate__animated animate__fadeInDown">
            <Input
              label="Email"
              type="Email"
              required={true}
              id="Email"
              name="Email"
              value={loginData.Email}
              onChangeFunction={UpdateInput}
            />
            <Input
              label="Password"
              type="password"
              required={true}
              id="Password"
              name="Password"
              value={loginData.Password}
              onChangeFunction={UpdateInput}
            />
            <input type="submit" value="login" onClick={signIn}></input>
          </form>
        </div>
      ) : (
        <div className="Dashboard">
          <div className="SideBar">
            <ul className="BTNList">
              <li>
                <h3
                  onClick={() => setActivePage("General")}
                  className={activePage === "General" ? "ActiveLink" : ""}
                >
                  General Info
                </h3>
              </li>
              <li>
                <h3
                  onClick={() => setActivePage("Privacy")}
                  className={activePage === "Privacy" ? "ActiveLink" : ""}
                >
                  Privacy
                </h3>
              </li>
            </ul>
          </div>
          <div className="Main">
            {activePage === "General" && (
              <div className="General">
                <h3>General info</h3>
                <form>
                  <Input
                    label="First name"
                    type="text"
                    required={true}
                    name="Fname"
                    value={ActiveUser.Fname}
                    onChangeFunction={handleInput}
                  />
                  <Input
                    label="Last name"
                    type="text"
                    required={true}
                    name="Lname"
                    value={ActiveUser.Lname}
                    onChangeFunction={handleInput}
                  />
                  <Input
                    label="Username:"
                    type="text"
                    required={true}
                    name="Username"
                    value={ActiveUser.Username}
                    onChangeFunction={handleInput}
                  />
                  <Input
                    label="Phone Number:"
                    type="tel"
                    required={true}
                    name="phone"
                    value={ActiveUser.phone}
                    onChangeFunction={handleInput}
                  />

                  <Input
                    label="Email:"
                    type="Email"
                    required={true}
                    name="Email"
                    value={ActiveUser.Email}
                    onChangeFunction={handleInput}
                  />
                </form>
                <div className="payment-methods">
                  <h3>Payment Methods</h3>
                  <Input
                    label="InstaPay:"
                    type="text"
                    required={true}
                    name="InstaPay"
                    value={ActiveUser.PaymentMethods.InstaPay}
                    onChangeFunction={handlePayments}
                  />
                  <Input
                    label="VodafoneCash:"
                    type="text"
                    required={true}
                    name="VodafoneCash"
                    value={ActiveUser.PaymentMethods.VodafoneCash}
                    onChangeFunction={handlePayments}
                  />
                  <Input
                    label="PayPal:"
                    type="text"
                    required={true}
                    name="PayPal"
                    value={ActiveUser.PaymentMethods.PayPal}
                    onChangeFunction={handlePayments}
                  />
                </div>
                <button
                  onClick={(e) => {
                    SaveData(e);
                  }}
                  style={{
                    margin: "auto",
                    width: "fit-content",
                    color: "black",
                  }}
                >
                  Save
                </button>
              </div>
            )}
            {activePage === "Privacy" && (
              <div className="Privacy">
                <div className="Button-Wrapper">
                  <button className="btn btn-primary" onClick={SendResetEmail}>
                    Change Password
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleShowModal}
                    style={{ margin: "auto" }}
                  >
                    delete Account
                  </button>
                  <MyModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    title="Delete Account"
                    primaryButtonText="Delete my account"
                    handlePrimaryAction={handlePrimaryAction}
                  >
                    <>
                      <p style={{ textAlign: "center" }}>
                        are you sure you want to delete your account? this
                        action is IRREVERSIBLE
                      </p>
                    </>
                  </MyModal>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
