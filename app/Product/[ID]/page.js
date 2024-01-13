"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Autoplay } from "swiper";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Card from "../../components/Card/Card";
import "./ProductDetails.css";
import { v4 as uid } from "uuid";
import "./ProductDetails.css";

import GETDOC from "@/lib/getDoc";
import CreateToast from "@/lib/createToast";
import SETDOC from "@/lib/setDoc";
import NotFound from "../../not-found";
import QUERY from "@/lib/query";
import Loading from "@/app/loading";
import { ToastContainer } from "react-toastify";
import decrypt from "@/lib/decrypt";
import Nav from "@/app/components/Nav/Nav";
export default function Product() {
  const [activeUser, setActiveUser] = React.useState({});
  const [inactive, setInactive] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [addedNum, setAddedNum] = React.useState(0);
  const [Product, setProduct] = React.useState({});
  const [Error, setError] = React.useState(false);
  const [mainPhoto, setMainPhoto] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [matchingProducts, setMatchingProducts] = useState([]);
  const id = useParams().ID;
  const discount1 = Product.Offer
    ? (Product.price * Product.discountPercentage) / 100
    : 0;
  const getProductAndUser = async () => {
    setIsLoading(true);
    const Product = await GETDOC("products", id);
    if (Product === "Error") {
      return setError(true);
    }
    setProduct(Product);
    const matchingProducts = await QUERY(
      "products",
      "category",
      "==",
      Product.category
    );
    setMatchingProducts(matchingProducts);

    JSON.parse(sessionStorage.getItem("activeUser"))?.admin
      ? setIsAdmin(true)
      : setIsAdmin(false);
    setIsLoading(false);
  };

  const UpdateStatics = async (target, action) => {
    let tempData;
    await GETDOC("statistics", "0").then((value) => {
      value ? (tempData = value) : "";
    });
    if (target === "wish" && action === "add") {
      tempData = { ...tempData, WishNum: tempData.WishNum + 1 };
    }
    if (target === "wish" && action === "remove") {
      tempData = { ...tempData, WishNum: tempData.WishNum - 1 };
    }
    if (target === "Cart" && action === "add") {
      tempData = { ...tempData, CartNum: tempData.CartNum + 1 };
    }
    if (target === "Cart" && action === "remove") {
      tempData = { ...tempData, CartNum: tempData.CartNum - 1 };
    }
    await SETDOC("statistics", "0", tempData);
  };
  const removeFromCart = async (item) => {
    if (Object.keys(activeUser).length === 0) {
      CreateToast("you aren't signed in!", "error");
      return;
    } else {
      setInactive(true);
      const newUser = {
        ...activeUser,
        CartCount: activeUser.CartCount - 1,
        Cart: activeUser.Cart.filter((CartProduct) => {
          return CartProduct.id !== item.id;
        }),
      };
      setActiveUser(newUser);
      await SETDOC("users", activeUser.id, {
        ...newUser,
      });
      await UpdateStatics("Cart", "remove");

      CreateToast("removed to the Cart!", "success");
    }
    setInactive(false);
  };
  const AddtoCart = async (item) => {
    if (Object.keys(activeUser).length === 0) {
      CreateToast("you aren't signed in!", "error");
      return;
    } else {
      if (Product.stock <= 0) {
        CreateToast("Sorry! we are out of stock!", "error");
        return;
      }
      setInactive(true);
      const newUser = {
        ...activeUser,
        CartCount: activeUser.CartCount + 1,
        Cart: [...activeUser.Cart, item],
      };
      setActiveUser(newUser);
      await SETDOC("users", activeUser.id, {
        ...newUser,
      });
      await UpdateStatics("Cart", "add");
      setAddedNum((prev) => prev + 1);

      addedNum === 0
        ? CreateToast("added to the Cart!", "success")
        : CreateToast(`added to the Cart ${addedNum + 1} times`, "success");
    }
    setInactive(false);
  };
  function removeElementById(obj, arrayName, idToRemove) {
    if (obj[arrayName]) {
      const modifiedArray = obj[arrayName].filter(
        (element) => element.id !== idToRemove.id
      );
      return { ...obj, [arrayName]: modifiedArray };
    }
    return obj;
  }
  const UpdateWishList = async (item) => {
    if (Object.keys(activeUser).length === 0) {
      CreateToast("you aren't signed in!", "error");
      return;
    } else {
      setInactive(true);
      if (
        activeUser.Wishlist.find((wish) => {
          return wish.id === Product.id;
        })
      ) {
        await UpdateStatics("wish", "remove");
        const newUser = removeElementById(activeUser, "Wishlist", item);
        setActiveUser(newUser);
        await SETDOC("users", activeUser.id, {
          ...newUser,
        });
        CreateToast("removed from Wishlist", "info");
      } else {
        await UpdateStatics("wish", "add");
        CreateToast("added to the Wishlist!", "success");
        const newUser = {
          ...activeUser,
          Wishlist: [...activeUser.Wishlist, item],
        };
        setActiveUser(newUser);
        await SETDOC("users", activeUser.id, {
          ...newUser,
        });
      }
      setInactive(false);
    }
  };
  const setMainImage = (e) => {
    setMainPhoto(e.target.src);
  };
  const photosEL = Product.images
    ? Product.images.map((photo) => {
        return (
          <button
            className={`thumb ${mainPhoto === photo.url ? "active" : ""}`}
            onClick={setMainImage}
            key={uid()}
          >
            <img src={photo.url} />
          </button>
        );
      })
    : "";
  useEffect(() => {
    const storedActiveUser = sessionStorage.getItem("activeUser");

    if (!storedActiveUser) {
      return;
    }

    let id = decrypt(JSON.parse(storedActiveUser));

    GETDOC("users", id).then((res) => {
      setActiveUser(res);
    });
  }, []);

  useEffect(() => {
    getProductAndUser();
  }, []);
  useEffect(() => {
    setMainPhoto(Product.images ? Product.images[0].url : "");
  }, [Product]);
  const NewProducts = matchingProducts?.map((productItem) => {
    return (
      <SwiperSlide key={uid()}>
        <Card product={productItem} />
      </SwiperSlide>
    );
  });
  useEffect(() => {
    const mainImg = document.querySelector(".mainIMG");
    if (mainImg) {
      mainImg.classList.add("animate__animated", "animate__backInDown");
      const animationEndHandler = () => {
        mainImg.classList.remove("animate__animated", "animate__backInDown");
      };
      mainImg.addEventListener("animationend", animationEndHandler);
      return () => {
        mainImg.removeEventListener("animationend", animationEndHandler);
      };
    }
  }, [mainPhoto]);
  return (
    <>
      <Nav />
      {inactive && <Loading loading={inactive} />}
      {Error ? (
        <NotFound />
      ) : !isLoading ? (
        <div>
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
          <div className="Details">
            <div className="left">
              <div className="MainIMG-wrapper">
                <img className="mainIMG" src={mainPhoto ? mainPhoto : ""} />
              </div>
              <div className="ThumbPhotos">{photosEL}</div>
            </div>
            <div className="right">
              <h1 className="Product animate__animated animate__fadeInRightBig">
                {Product.title}
              </h1>

              <p className="Overview animate__animated animate__fadeInRightBig">
                {Product.description}
              </p>
              {/* <div className="Sold-wrapper animate__animated animate__fadeInRightBig">
                <div>{Product.Sold} users bought this</div>
              </div> */}

              <div className="Price-Stock-wrapper  animate__animated animate__fadeInRightBig">
                $ {""}
                <span className="Price">{Product.price}</span>
              </div>

              <div className="buttons">
                {isAdmin ? (
                  <button
                    className={`Cart ${Product.stock ? "" : "button-inactive"}`}
                    onClick={() => {
                      window.location.href = `/Dashboard/Product/${Product.id}`;
                    }}
                  >
                    Edit Product / Add Stock
                  </button>
                ) : (
                  <>
                    <img
                      className="Wish animate__animated animate__bounceIn"
                      src={
                        Object.keys(activeUser).length !== 0
                          ? activeUser.Wishlist?.find((item) => {
                              return item.id === Product.id;
                            })
                            ? "/heart-hover.png"
                            : "/heart.png"
                          : "/heart.png"
                      }
                      onClick={() => {
                        UpdateWishList(Product);
                      }}
                    />
                    {activeUser?.Cart?.find((cartItem) => {
                      return cartItem.id === Product.id;
                    }) ? (
                      <button
                        className={`cart animate__animated animate__bounceIn ${
                          Product.stock > 0 ? "" : "button-inactive"
                        }`}
                        onClick={() => {
                          removeFromCart(Product);
                        }}
                      >
                        <img src="/cart-hover.png" />
                        remove from Cart
                      </button>
                    ) : (
                      <button
                        className={`cart animate__animated animate__bounceIn ${
                          Product.stock > 0 ? "" : "button-inactive"
                        }`}
                        onClick={() => {
                          AddtoCart(Product);
                        }}
                      >
                        <img src="/cart-hover.png" />
                        Add to Cart
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <h2> Similar Products</h2>
          {matchingProducts.length > 0 && (
            <Swiper
              freeMode={true}
              slidesPerView={5}
              spaceBetween={10}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              className="mySwiper"
            >
              {NewProducts}
            </Swiper>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
