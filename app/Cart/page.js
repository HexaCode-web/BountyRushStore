"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import "./Cart.css";
import GETDOC from "@/lib/getDoc";
import SETDOC from "@/lib/setDoc";
import CreateToast from "@/lib/createToast";
import decrypt from "@/lib/decrypt";
import Nav from "../components/Nav/Nav";
import getCurrentDateFormatted from "@/lib/getCurrentDateFormatted";
import OnlinePayment from "./OnlinePayment";
import { ToastContainer } from "react-toastify";
export default function Page() {
  const [activeUser, setActiveUser] = React.useState({});
  const [LocalCart, setLocalCart] = React.useState([]);
  const [sortedCart, setSortedCart] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showSideMenu, setShowSideMenu] = React.useState(false);
  const [choice, SetChoice] = useState("");
  const [Total, setTotal] = React.useState(0);

  const [order, setOrder] = useState({
    items: [],
    user: null,
    ID: generateId(),
    status: "",
    paymentMethod: "",
    DateActionTaken: "",
    CreatedAt: "",
    orderAmount: "",
  });
  function generateId() {
    const randomNumber = Math.floor(Math.random() * 100000000);
    const id = randomNumber.toString().padStart(8, "0");
    return id;
  }
  const generateOrder = async () => {
    if (LocalCart.length === 0) {
      CreateToast("Please add some items to the cart first", "error");
      return;
    }
    for (const element of LocalCart) {
      const fetchedProduct = await GETDOC("products", element.id);
      if (fetchedProduct.stock > 0) {
        setOrder((prev) => {
          return {
            ...prev,
            items: [
              ...prev.items,
              {
                ...element,
                category: "DIGITAL_GOODS",
                amount_cents: element.price * 100,
                quantity: 1,
                name: element.title,
              },
            ],
            user: activeUser.id,
            CreatedAt: getCurrentDateFormatted(),
            amount_cents: Total.toFixed(0) * 100,
          };
        });
        CreateToast(`${element.title} Added to the order`, "success");
      } else {
        CreateToast(
          `${element.title} wasn't added, it's out of stock`,
          "error"
        );
      }
    }
  };
  const AddToPending = async () => {
    if (LocalCart.length === 0) {
      CreateToast("Please add some items to the cart first", "error");
      return;
    }
    let PendingOrdersUSER = activeUser.PendingOrders;
    let FetchedUser = await GETDOC("users", activeUser.id);
    for (const element of LocalCart) {
      const fetchedStatistics = await GETDOC("statistics", 0);
      const fetchedProduct = await GETDOC("products", element.id);
      const Order = {
        product: element.id,
        user: activeUser.id,
        ID: generateId(),
        status: "",
        paymentMethod: "",
        DateActionTaken: "",
        CreatedAt: getCurrentDateFormatted(),
      };
      console.log(Order);

      if (fetchedProduct.stock > 0) {
        PendingOrdersUSER = [...PendingOrdersUSER, Order];
        const updatedUser = {
          ...FetchedUser,
          Cart: [],
          pending: PendingOrdersUSER,
        };
        fetchedStatistics.PendingOrders.push(Order);
        const updatedStatistics = {
          ...fetchedStatistics,
          CartNum: fetchedStatistics.CartNum - 1,
        };
        // await SETDOC("statistics", 0, updatedStatistics);
        // setActiveUser(updatedUser);
        // setLocalCart(updatedUser.cart);
        CreateToast(
          `${element.title} Added to pending orders, we will let you know when its confirmed!`,
          "success"
        );
      } else {
        CreateToast(
          `${element.title} wasn't added, it's out of stock`,
          "error"
        );
      }
    }
  };

  const CheckInfo = (res) => {
    const vals = Object.keys(res).map(function (key) {
      return res[key];
    });
    for (let index = 0; index < vals.length; index++) {
      if (typeof vals[index] !== "boolean") {
        if (typeof vals[index] !== "object")
          if (vals[index] !== 0) {
            if (!vals[index]) {
              return true;
            }
          }
      }
    }
  };
  // const Choice = async (userChoice) => {
  //   setIsLoading(true);
  //   setShowSideMenu(false);
  //   await AddToPending();
  //   setIsLoading(false);
  //   // let fetchedData;
  //   // if (userChoice === "online") {
  //   //   CreateToast("coming soon!", "info");
  //   // }
  //   // if (userChoice === "cash") {
  //   //   await GETDOC("users", activeUser.id).then((res) => {
  //   //     fetchedData = res;
  //   //     setActiveUser(res);
  //   //   });
  //   //   if (CheckInfo(fetchedData)) {
  //   //     CreateToast(
  //   //       `your Profile is incomplete! go to ${
  //   //         fetchedData.admin ? "Admin Profile" : "settings"
  //   //       } to complete it`,
  //   //       "error"
  //   //     );
  //   //   } else {

  //   //   }
  //   // }
  // };
  const cartSorter = () => {
    let NewAr = [];
    setTotal(0);
    LocalCart.forEach((product) => {
      const price = product.Offer
        ? product.price - (product.price * product.discountPercentage) / 100
        : product.price;
      setTotal((prev) => prev + price);
      let productFound = false;
      for (let i = 0; i < NewAr.length; i++) {
        if (NewAr[i].product.id === product.id) {
          NewAr[i].quantity++;
          NewAr[i].price += price;
          productFound = true;
          break;
        }
      }
      if (!productFound) {
        NewAr.push({ product, quantity: 1, price: price });
      }
    });
    return NewAr;
  };
  const renderCartItems = LocalCart.map((product) => {
    return (
      <li key={product.id} className="cartItem">
        <span>{product.title}</span>
        <span>{product.price}</span>
      </li>
    );
  });
  useEffect(() => {
    const updateCart = async () => {
      setIsLoading(true);
      setSortedCart(cartSorter());
      if (activeUser.id) {
        await SETDOC("users", activeUser.id, {
          ...activeUser,
          cart: LocalCart,
          CartCount: LocalCart.length,
        });
      }
      setIsLoading(false);
    };
    updateCart();
  }, [LocalCart]);

  const decrease = async (id) => {
    const newCart = LocalCart.filter((localCartItem) => {
      return localCartItem.id !== id;
    });
    setLocalCart(newCart);
    setActiveUser((prev) => {
      return { ...prev, Cart: newCart, CartCount: activeUser.CartCount - 1 };
    });
    const fetchedStatistics = await GETDOC("statistics", 0);
    const updatedStatistics = {
      ...fetchedStatistics,
      CartNum: Math.max(0, fetchedStatistics.CartNum - 1),
    };
    await SETDOC("users", activeUser.id, {
      ...activeUser,
      Cart: newCart,
      CartCount: activeUser.CartCount - 1,
    });
    await SETDOC("statistics", 0, updatedStatistics);
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
          setActiveUser(fetchedUser);
          setLocalCart(fetchedUser.Cart);
          setIsLoading(false);
        }
      }
    };
    CheckUser();
  }, []);
  useEffect(() => {
    if (showSideMenu) {
      generateOrder();
    } else {
      setOrder({
        items: [],
        user: null,
        ID: generateId(),
        status: "",
        paymentMethod: "",
        DateActionTaken: "",
        CreatedAt: "",
        amount_cents: "",
      });
    }
  }, [showSideMenu]);
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
      <div className="Cart container">
        {isLoading && (
          <div className="overlay">
            <img src="/loading-13.gif"></img>
          </div>
        )}
        <h1 className="animate__animated animate__fadeInDown">
          your Shopping Cart
        </h1>
        <div className="CartList animate__animated animate__fadeInDown">
          {sortedCart.length > 0 ? (
            sortedCart.map((productWrapper) => {
              return (
                <div className={`CartItem`} key={uuid()}>
                  <img
                    className="Thumbnail"
                    src={productWrapper.product.thumbnail}
                  ></img>
                  <p>{productWrapper.product.title}</p>
                  <div className="Buttons">
                    <div className="button-wrapper">
                      <button
                        onClick={() => {
                          decrease(productWrapper.product.id);
                        }}
                      >
                        remove
                      </button>
                    </div>
                    <p>{productWrapper.quantity}</p>
                  </div>
                  <p>{productWrapper.price}$</p>
                </div>
              );
            })
          ) : (
            <div className="EmptyCart">
              <img src="/empty-cart.png"></img>
              <h2>your cart is empty </h2>
              <h6>Go shop some more or view your pending orders!</h6>
              <div className="button-wrapper" style={{ maxWidth: "50%" }}>
                <button
                  className="button"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Go back to shopping
                </button>
                <button
                  className="button"
                  onClick={() => {
                    window.location.href = "/User/Pending";
                  }}
                >
                  view your pending list
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          className={`SideMenuButton  ${
            showSideMenu ? "ShowSideMenuButton" : ""
          }`}
          onClick={() => {
            setShowSideMenu((prev) => !prev);
          }}
        >
          Checkout
        </div>
        <div className={`SideMenu ${showSideMenu ? "ShowSideMenu" : ""}`}>
          <div className="pricing">
            <ul className=" fieldWrapper itemsWrapper">{renderCartItems}</ul>
            <div className="fieldWrapper Total">
              <h5>Total:</h5>
              <h5>{Total.toFixed(2)}$</h5>
            </div>
          </div>
          <h4>Select payment method</h4>
          <div className="button-wrapper">
            <button
              className="SideMenuButton"
              onClick={() => {
                SetChoice("Bank");
              }}
            >
              Bank
            </button>
            {activeUser?.Wallet > Total && (
              <button
                className="SideMenuButton"
                onClick={() => {
                  SetChoice("Wallet");
                }}
              >
                Wallet
              </button>
            )}
          </div>
          <div>
            {choice === "Wallet" && (
              <div className="paymentWrapper">
                <span>
                  are you sure you want to pay with your wallet credits?
                </span>
                <span>you will be charged {Total}</span>
                <span>
                  you will have {(activeUser.Wallet - Total).toFixed(2)} wallet
                  credits left
                </span>
                <button className="button">Pay now</button>
              </div>
            )}
            {choice === "Bank" && (
              <OnlinePayment order={order} />
              // <div className="paymentWrapper">
              //   <div style={{ width: "100%" }}>
              //     <h5>Instructions</h5>
              //     <ol>
              //       <li>
              //         follow the this link{" "}
              //         <a
              //           href="https://paypal.me/marcokhairy32?country.x=EG&locale.x=en_US"
              //           target="_blank"
              //         >
              //           PayPal Link
              //         </a>
              //       </li>
              //     </ol>
              //   </div>
              // </div>
            )}
          </div>
        </div>
        {showSideMenu && (
          <>
            <div className="overlay Below"></div>
          </>
        )}
      </div>
    </>
  );
}
/*    

  const updatedProduct = {
        ...fetchedProduct,
        stock: fetchedProduct.stock - 1,
        Sold: fetchedProduct.Sold + 1,
      };
      await SETDOC("products", element.id, updatedProduct);
      const discount = (+element.price * element.discountPercentage) / 100;
      PendingOrders.push(element);
      const updatedStatistics = {
        ...fetchedStatistics,
        ProductsSold: [...fetchedStatistics.ProductsSold, element],
        Net: Math.round(+fetchedStatistics.Net + +element.price),
        TotalDiscount: Math.round(fetchedStatistics.TotalDiscount + discount),
        CartNum: Math.max(0, fetchedStatistics.CartNum - 1),
        Revenue:
          fetchedStatistics.Net -
          fetchedStatistics.TotalDiscount +
          element.price,
      };
      await SETDOC("statistics", 0, updatedStatistics); 
      */
