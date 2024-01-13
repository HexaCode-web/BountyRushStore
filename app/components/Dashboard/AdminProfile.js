import React, { useEffect, useState } from "react";

import DELETEDOC from "@/lib/deleteDoc";
import GETCOLLECTION from "@/lib/getCollection";

import RESETPASSWORD from "@/lib/resetPassword";
import LOGIN from "@/lib/login";
import SETDOC from "@/lib/setDoc";
import UPDATEEMAIL from "@/lib/updateEmail";
import GETDOC from "@/lib/getDoc";

import MyModal from "../Modal/Modal";
import { CreateToast } from "../../App";
import encrypt from "@/lib/encrypt";
import decrypt from "@/lib/decrypt";
import Input from "@/lib/Input/Input";
const AdminProfile = (props) => {
  const [activePage, setActivePage] = React.useState("Login");
  const [ActiveUser, setActiveUser] = React.useState(props.ActiveUser);
  const [showModal, setShowModal] = React.useState(false);
  const [loginData, setLoginData] = React.useState({
    email: "",
    Password: "",
  });
  const [oldEmail, setOldEmail] = useState(null);
  useEffect(() => {
    const CheckUser = async () => {
      // Check if window is defined to avoid errors during server-side rendering
      if (typeof window !== "undefined") {
        const storedActiveUser = sessionStorage.getItem("activeUser");

        // Check if sessionStorage has the item before using it
        if (storedActiveUser) {
          const decryptedId = decrypt(JSON.parse(storedActiveUser));

          const fetchedUser = await GETDOC("users", decryptedId);
          setOldEmail(fetchedUser.email);
        }
      }
    };
    CheckUser();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const SaveData = async (e) => {
    let userToSend;
    e.preventDefault();
    const usersList = await GETCOLLECTION("users");
    const Match = usersList.find((user) => {
      return user.email === ActiveUser.email;
    });
    if (Match) {
      userToSend = { ...ActiveUser, email: oldEmail };
      CreateToast("email wasn't updated due to it was taken", "error");
    } else {
      userToSend = ActiveUser;
      try {
        await UPDATEEMAIL(ActiveUser.email);
        CreateToast("Data updated", "success");
      } catch (error) {
        CreateToast(error.message, "error");
      }
    }
    props.UpdateUser(userToSend, false);
    oldEmail = JSON.parse(sessionStorage.getItem("activeUser")).email;
  };
  const handlePrimaryAction = async (e) => {
    await DELETEDOC("users", ActiveUser.id);
    setShowModal(false);
    sessionStorage.clear();
    setTimeout(() => {
      window.location.href = "/User";
    }, 500);
  };
  const handleInput = (e) => {
    const { name, value } = e.target;
    setActiveUser((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const SendResetEmail = async () => {
    try {
      RESETPASSWORD(ActiveUser.email);
      CreateToast("email has been sent", "success");
    } catch (error) {
      CreateToast(error, "error");
    }
  };
  const signIn = async (e) => {
    e.preventDefault();
    if (loginData.email === ActiveUser.email) {
      try {
        const authUser = await LOGIN(loginData.email, loginData.Password);
        const DBuser = await GETDOC("users", authUser.uid);
        await SETDOC("users", authUser.uid, { ...DBuser, Active: true });
        const encryptedUserID = encrypt(authUser.uid);

        sessionStorage.setItem("activeUser", JSON.stringify(encryptedUserID));
        setActivePage("General");
      } catch (error) {
        CreateToast(error.message, "error");
      }
    } else {
      CreateToast("email doesn't match the signed in one", "error");
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
  useEffect(() => {
    const FetchUser = async () => {
      GETDOC("users", ActiveUser.id).then((res) => setActiveUser(res));
    };
    FetchUser();
  }, []);
  return (
    <>
      {activePage === "Login" ? (
        <div className="Container">
          <h3> please login once more </h3>
          <form className="animate__animated animate__fadeInDown">
            <Input
              label="Email"
              type="email"
              required={true}
              id="email"
              name="email"
              value={loginData.email}
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
        <>
          <div className="General">
            <h1>General info</h1>
            <form>
              <Input
                label="First Name"
                type="text"
                required={true}
                id="Fname"
                name="Fname"
                value={ActiveUser.Fname}
                onChangeFunction={handleInput}
              />

              <Input
                label="Last Name"
                type="text"
                required={true}
                id="Lname"
                name="Lname"
                value={ActiveUser.Lname}
                onChangeFunction={handleInput}
              />

              <div
                id="Username"
                className="animate__animated animate__fadeInLeft"
                style={{ animationDelay: ".4s" }}
              >
                <label for="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="Username"
                  value={ActiveUser.Username}
                  onChange={handleInput}
                />
              </div>
              <div
                id="Phone"
                className="animate__animated animate__fadeInRight"
                style={{ animationDelay: ".5s" }}
              >
                <label for="phone">Phone Number:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={ActiveUser.phone}
                  onChange={handleInput}
                />
              </div>
              <div
                id="Email"
                className="animate__animated animate__fadeInUp"
                style={{ animationDelay: ".6s" }}
              >
                <label for="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={ActiveUser.email}
                  onChange={handleInput}
                />
              </div>
              <div
                id="Address"
                className="animate__animated animate__fadeInUp"
                style={{ animationDelay: ".7s" }}
              >
                <label for="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={ActiveUser.address}
                  onChange={handleInput}
                />
              </div>
              <div
                id="Gender"
                className="animate__animated animate__fadeInUp"
                style={{ animationDelay: ".8s" }}
              >
                <label for="gender">Gender:</label>
                <select
                  id="gender"
                  name="gender"
                  value={ActiveUser.gender}
                  onChange={handleInput}
                >
                  <option value="" selected disabled>
                    Select your gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div
                id="DOB"
                className="animate__animated animate__fadeInUp"
                style={{ animationDelay: ".9s" }}
              >
                <label for="birthdate">Date of Birth:</label>
                <input
                  type="date"
                  id="birthdate"
                  name="dateOfBirth"
                  value={ActiveUser.dateOfBirth}
                  onChange={handleInput}
                />
              </div>
              <input
                id="Save"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  props.UpdateUser(ActiveUser, true);
                }}
                value="Save"
                style={{ margin: "auto", width: "50%", textIndent: "0" }}
              />
            </form>
          </div>
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
                    are you sure you want to delete your account? this action is
                    IRREVERSIBLE
                  </p>
                </>
              </MyModal>
            </div>
          </div>{" "}
        </>
      )}
    </>
  );
};

export default AdminProfile;
