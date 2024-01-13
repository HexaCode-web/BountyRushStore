"use client";

import decrypt from "@/lib/decrypt";
import "./globals.css";
import GETDOC from "@/lib/getDoc";
import React, { useEffect, useState } from "react";
import GETCOLLECTION from "@/lib/getCollection";
import SETDOC from "@/lib/setDoc";
import CreateToast from "@/lib/createToast";
import { ToastContainer } from "react-toastify";
import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import Loading from "./loading";
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [activeUser, setActiveUser] = useState("");
  const [Data, SetData] = useState([]);
  const [catagories, setCatagories] = useState([]);
  const [UpdateCart, setUpdateCart] = useState(0);
  useEffect(() => {
    const CheckUser = async () => {
      // Check if window is defined to avoid errors during server-side rendering
      if (typeof window !== "undefined") {
        const storedActiveUser = sessionStorage.getItem("activeUser");

        // Check if sessionStorage has the item before using it
        if (storedActiveUser) {
          const decryptedId = decrypt(JSON.parse(storedActiveUser));

          const fetchedUser = await GETDOC("users", decryptedId);
          setActiveUser(fetchedUser);
        }
      }
    };
    CheckUser();
  }, []);
  async function GetData() {
    setLoading(true);

    await GETCOLLECTION("categories").then((res) => {
      setCatagories(res);
    });
    await GETCOLLECTION("products").then((res) => SetData(res));
    setLoading(false);
  }
  const UpdateUser = async (
    targetUser,

    popups
  ) => {
    try {
      await SETDOC("users", targetUser.id, { ...targetUser });
      sessionStorage.setItem("activeUser", JSON.stringify(targetUser));
      popups
        ? CreateToast("your changes have been saved", "success", 3000)
        : "";
    } catch (error) {
      console.log(error);
      popups ? CreateToast("something went wrong", "error", 3000) : "";
    }
  };

  useEffect(() => {
    GetData();
  }, []);
  useEffect(() => {
    if (UpdateCart === 0) {
      GETDOC("users", activeUser.id).then((res) =>
        setUpdateCart(res.CartCount)
      );
    }
  }, [UpdateCart, activeUser.id]);
  return (
    <div className="App">
      <Loading loading={loading} />

      <Nav activeUser={activeUser} UpdateCart={UpdateCart} />

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
      <>
        <div>
          <Header List={Data} catagories={catagories} />
          <Content />
        </div>
      </>
      <Footer catagories={catagories} activeUser={activeUser} />
    </div>
  );
}
