"use client";
import React, { useEffect } from "react";
import GETCOLLECTION from "@/lib/getCollection";
import GETDOC from "@/lib/getDoc";
import CreateToast from "@/lib/createToast";
import "react-toastify/dist/ReactToastify.css";

import Card from "../components/Card/Card";
import DataTable from "react-data-table-component";
import MyModal from "../components/Modal/Modal";
import decrypt from "@/lib/decrypt";
import "./Profile.css";
import { ToastContainer } from "react-toastify";
import Nav from "../components/Nav/Nav";
import { AddProduct } from "./AddProduct/AddProduct";
import Pending from "./Pending/Pending";
import Loading from "../loading";
import Wallet from "./Wallet/Wallet";
import History from "./History/History";
export default function ViewUser() {
  const [user, setUser] = React.useState(null);
  const [ActivePage, setActivePage] = React.useState("personal");
  const [Products, setProducts] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [RejectReason, setRejectReason] = React.useState("");
  let AcceptedOrders = [];
  let RejectedOrders = [];
  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = () => {
    handleCloseModal();
    setRejectReason("");
  };
  function timeSince(dateString) {
    const dateParts = dateString.split("/");
    const year = parseInt(dateParts[2], 10) + 2000; // add 2000 to two-digit year
    const month = parseInt(dateParts[1], 10) - 1; // subtract 1 from month (0-indexed)
    const day = parseInt(dateParts[0], 10);
    const date = new Date(year, month, day);

    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) {
      return seconds + " second" + (seconds === 1 ? "" : "s") + " ago";
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return minutes + " minute" + (minutes === 1 ? "" : "s") + " ago";
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours + " hour" + (hours === 1 ? "" : "s") + " ago";
    }
    const days = Math.floor(hours / 24);
    return days + " day" + (days === 1 ? "" : "s") + " ago";
  }

  React.useEffect(() => {
    const fetchUser = async () => {
      const storedActiveUser = sessionStorage.getItem("activeUser");
      if (!storedActiveUser) {
        return;
      }

      const decryptedId = decrypt(JSON.parse(storedActiveUser));
      await GETDOC("users", decryptedId).then((res) => setUser(res));
      await GETCOLLECTION("products").then((res) => {
        setProducts(res);
      });
    };
    fetchUser();
    setLoading(false);
  }, []);
  const CheckInfo = (res) => {
    const vals = Object.keys(res).map(function (key) {
      return res[key];
    });
    for (let index = 0; index < vals.length; index++) {
      if (typeof vals[index] !== "boolean") {
        if (typeof vals[index] !== "object")
          if (vals[index] !== 0) {
            if (!vals[index]) {
              CreateToast(
                `your Profile is incomplete! go to ${
                  res.admin ? "Admin Profile" : "settings"
                } to complete it`,
                "warn"
              );
              return;
            }
          }
      }
    }
  };
  useEffect(() => {
    const checkData = async () => {
      const storedActiveUser = sessionStorage.getItem("activeUser");
      if (!storedActiveUser) {
        return;
      }

      const decryptedId = decrypt(JSON.parse(storedActiveUser));
      let fetchedData = {};
      GETDOC("users", decryptedId).then((res) => {
        fetchedData = res;
        CheckInfo(fetchedData);
      });
    };
    if (ActivePage === "personal") {
      checkData();
    }
  }, [user]);

  useEffect(() => {
    user?.history?.forEach((Order) => {
      if (Order.Reason) {
        RejectedOrders.push(Order);
      } else {
        AcceptedOrders.push(Order);
      }
    });
  }, [user]);

  return (
    <>
      <Nav />
      <div className="ViewUser">
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
        {loading && <Loading />}
        {user && (
          <>
            <h3 className="animate__animated  animate__fadeInLeft">
              {user.Fname} {user.Lname}'s profile
            </h3>
            <div className="Content">
              <div className="Left animate__animated  animate__fadeInDown">
                <p className="UserName animate__animated  animate__backInDown">
                  {user.Username}
                </p>
                <span
                  className="Email animate__animated  animate__backInDown"
                  style={{ animationDelay: ".3s" }}
                >
                  {user.Email}
                </span>
                <ul className="Navigation">
                  <li
                    onClick={() => setActivePage("personal")}
                    className={`${
                      ActivePage === "personal" ? "ActiveLink" : ""
                    } animate__animated animate__backInDown `}
                  >
                    Personal info
                  </li>
                  <li
                    onClick={() => setActivePage("Products")}
                    style={{ animationDelay: ".3s" }}
                    className={`${
                      ActivePage === "Products" ? "ActiveLink" : ""
                    } animate__animated animate__backInDown`}
                  >
                    Products in Cart
                  </li>
                  <li
                    onClick={() => setActivePage("WishList")}
                    style={{ animationDelay: ".4s" }}
                    className={`${
                      ActivePage === "WishList" ? "ActiveLink" : ""
                    } animate__animated animate__backInDown `}
                  >
                    WishList
                  </li>
                  <li
                    onClick={() => setActivePage("History")}
                    style={{ animationDelay: ".5s" }}
                    className={`${
                      ActivePage === "History" ? "ActiveLink" : ""
                    } animate__animated animate__backInDown `}
                  >
                    History
                  </li>
                  <li
                    onClick={() => setActivePage("Pending")}
                    style={{ animationDelay: ".6s" }}
                    className={`${
                      ActivePage === "PendingOrders" ? "ActiveLink" : ""
                    } animate__animated animate__backInDown `}
                  >
                    Pending Requests
                  </li>
                  <li
                    onClick={() => setActivePage("Wallet")}
                    style={{ animationDelay: ".6s" }}
                    className={`${
                      ActivePage === "PendingOrders" ? "ActiveLink" : ""
                    } animate__animated animate__backInDown `}
                  >
                    Wallet
                  </li>
                  <li
                    onClick={() => setActivePage("RequestProduct")}
                    style={{ animationDelay: ".65s" }}
                    className={`${
                      ActivePage === "RequestProduct" ? "ActiveLink" : ""
                    } animate__animated animate__backInDown `}
                  >
                    Add a Product
                  </li>
                  <li
                    onClick={() => (window.location.href = "/Profile/Settings")}
                    style={{ animationDelay: ".69s" }}
                    className={`${
                      ActivePage === "Settings" ? "ActiveLink" : ""
                    } animate__animated animate__backInDown `}
                  >
                    Settings
                  </li>
                </ul>
              </div>
              <div className="Right">
                {ActivePage === "personal" && (
                  <div className="Card-wrapper">
                    <div className="Card animate__animated  animate__fadeInLeft">
                      <div className="header">
                        <p className="CardTitle">Full Name</p>
                        <img src="/phone.png"></img>
                      </div>
                      <p className="CardInfo">
                        {user.Fname} {user.Lname}
                      </p>
                    </div>
                    <div className="Card animate__animated  animate__fadeInLeft">
                      <div className="header">
                        <p className="CardTitle">Username</p>
                        <img src="/phone.png"></img>
                      </div>
                      <p className="CardInfo">{user.Username}</p>
                    </div>
                    <div className="Card animate__animated  animate__fadeInRight">
                      <div className="header">
                        <p className="CardTitle">Phone Number</p>
                        <img src="/phone.png"></img>
                      </div>
                      <p className="CardInfo">{user.phone}</p>
                    </div>
                    <div
                      className="Card animate__animated  animate__fadeInLeft"
                      style={{ animationDelay: ".4s" }}
                    >
                      <div className="header">
                        <p className="CardTitle">Date Joined</p>
                        <img src="/calendar.png"></img>
                      </div>
                      <p className="CardInfo">{user.joinedAt}</p>
                      <span className="SubText">
                        {timeSince(user.joinedAt)}
                      </span>
                    </div>

                    <div
                      className="Card animate__animated  animate__fadeInUp"
                      style={{ animationDelay: "1.1s" }}
                    >
                      <div className="header">
                        <p className="CardTitle">successful Orders</p>
                        <img src="/successful.png"></img>
                      </div>
                      <p className="CardInfo">{AcceptedOrders.length}</p>
                    </div>
                    <div
                      className="Card animate__animated  animate__fadeInUp"
                      style={{ animationDelay: "1.2s" }}
                    >
                      <div className="header">
                        <p className="CardTitle">Rejected Orders</p>
                        <img src="/Rejected.png"></img>
                      </div>
                      <p className="CardInfo">{RejectedOrders.length}</p>
                    </div>
                    <div
                      className="Card animate__animated  animate__fadeInUp"
                      style={{ animationDelay: ".9s" }}
                    >
                      <div className="header">
                        <p className="CardTitle">Pending Orders</p>
                        <img src="/Pending.png"></img>
                      </div>
                      <p className="CardInfo">{user.PendingOrders.length}</p>
                    </div>
                    <div
                      className="Card animate__animated  animate__fadeInUp"
                      style={{ animationDelay: ".9s" }}
                    >
                      <div className="header">
                        <p className="CardTitle">Pending Refund Requests</p>
                        <img src="/Pending.png"></img>
                      </div>
                      <p className="CardInfo">{user.PendingRefunds.length}</p>
                    </div>
                    <div
                      className="Card animate__animated  animate__fadeInUp"
                      style={{ animationDelay: ".9s" }}
                    >
                      <div className="header">
                        <p className="CardTitle">Pending Products Requests</p>
                        <img src="/Pending.png"></img>
                      </div>
                      <p className="CardInfo">{user.PendingProducts.length}</p>
                    </div>
                  </div>
                )}
                {ActivePage === "Products" &&
                  (user.Cart.length <= 0 ? (
                    <h2 style={{ margin: "auto" }}>no products in Cart yet</h2>
                  ) : (
                    user.Cart.map((product) => {
                      return <Card product={product} />;
                    })
                  ))}
                {ActivePage === "WishList" &&
                  (user.Wishlist.length <= 0 ? (
                    <h2 style={{ margin: "auto" }}>
                      no products in wishlist yet
                    </h2>
                  ) : (
                    user.Wishlist.map((product) => {
                      return <Card product={product} />;
                    })
                  ))}
                {ActivePage === "History" && <History Products={Products} />}
                {ActivePage === "RequestProduct" && <AddProduct />}
                {ActivePage === "Wallet" && <Wallet />}
                {ActivePage === "Pending" && (
                  <Pending user={user} Products={Products} />
                )}
              </div>
            </div>
          </>
        )}
        <MyModal
          show={showModal}
          handleClose={handleCloseModal}
          title="Reason of rejected order"
          primaryButtonText="okay"
          handlePrimaryAction={handlePrimaryAction}
        >
          <div style={{ textAlign: "center" }}>
            <p>Reason of rejection:</p>
            <br />
            <p style={{ fontSize: "1.2rem" }}>{RejectReason}</p>
          </div>
        </MyModal>
      </div>
    </>
  );
}
