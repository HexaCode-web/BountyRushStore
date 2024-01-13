import CreateToast from "@/lib/createToast";

import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import Loading from "@/app/loading";
import SETDOC from "@/lib/setDoc";
import TipTap from "@/lib/RichTextEditor/tiptap";
import Input from "@/lib/Input/Input";
import decrypt from "@/lib/decrypt";
import { v4 as uuidv4 } from "uuid";
import getCurrentDateFormatted from "@/lib/getCurrentDateFormatted";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE,
  authDomain: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE2,
  projectId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE3,
  storageBucket: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE4,
  messagingSenderId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE5,
  appId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE6,
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export const AddProduct = () => {
  const [activeUser, setActiveUser] = React.useState({});
  //   const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    ID: uuidv4(),
    Hide: true,
    User: "",
    title: "",
    brand: "",
    category: "",
    description: "",
    stock: 0,
    Offer: false,
    discountPercentage: 0,
    HotProduct: false,
    cost: 0,
    price: 0,
    Stars: 0,
    UsersRated: [],
    rating: 0,
    CreatedAt: getCurrentDateFormatted(),
    thumbnail: "",
    images: [],
  });

  const [urlDone, setUrlDone] = useState("false");
  const [status, setStatus] = useState(false);
  console.log(newProduct);
  const handleInput = (event) => {
    let { name, value, type } = event.target;
    if (type === "number") {
      value = +value;
    }
    let filesAR = [];
    if (name === "thumbnail") {
      CreateToast("uploading thumbnail", "progress");
      const imageRef = ref(storage, `images/${newProduct.id}/thumbnail`);
      uploadBytes(imageRef, event.target.files[0]).then(async (snapshot) => {
        CreateToast("uploaded the thumbnail", "success");
        await getDownloadURL(snapshot.ref).then((url) => {
          setNewProduct((prev) => {
            return { ...prev, thumbnail: url };
          });
        });
      });
      CreateToast("uploaded thumbnail", "success");
    }
    if (name === "images") {
      filesAR = Array.from(event.target.files);
      let urlList = [];
      filesAR.forEach((element, index) => {
        setUrlDone("pending");
        const imageRef = ref(storage, `images/${newProduct.id}/${index}`);
        uploadBytes(imageRef, element).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            urlList.push({ index, url });
            if (urlList.length === filesAR.length) {
              setUrlDone("true");
              CreateToast("uploaded photos", "success");
            }
            setNewProduct((prev) => {
              return { ...prev, images: urlList };
            });
          });
        });
      });
    }
    if (name === "Offer") {
      if (value === "true") {
        value = true;
      } else {
        value = false;
      }
      setNewProduct((prev) => {
        return { ...prev, Offer: value };
      });
    }
    if (name === "HotProduct") {
      setNewProduct((prev) => {
        return { ...prev, HotProduct: value === "true" ? true : false };
      });
    } else {
      setNewProduct((prev) => {
        return {
          ...prev,
          User: activeUser,

          [name]: value,
        };
      });
    }
  };
  const handleDescriptionChange = (value) => {
    setNewProduct((prev) => {
      return { ...prev, description: value };
    });
  };
  const add = async (e) => {
    e.preventDefault();
    await SETDOC("pendingProducts", newProduct.id, newProduct, true);
    setNewProduct({
      id: uuidv4(),
      User: activeUser,
      title: "",
      brand: "",
      category: "",
      description: "",
      stock: 0,
      Offer: false,
      discountPercentage: 0,
      HotProduct: false,
      cost: 0,
      price: 0,
      Stars: 0,
      UsersRated: [],
      rating: 0,
      thumbnail: "",
      images: [],
    });
    CreateToast("product request sent");
  };
  useEffect(() => {
    switch (urlDone) {
      case "false":
        setStatus(<p className="alert">Please Upload some photos</p>);
        break;
      case "true":
        setStatus(
          <button required onClick={add}>
            Send Add Request
          </button>
        );
        break;
      case "pending":
        setStatus(
          <img
            alt="loading"
            src={Loading}
            style={{ margin: "auto", width: "50px" }}
          />
        );
        break;
      default:
        break;
    }
  }, [urlDone]);

  //   const catagoriesSelect = categories.map((category) => {
  //     return <option value={category.Name}>{category.Name}</option>;
  //   });
  useEffect(() => {
    const CheckUser = async () => {
      // Check if window is defined to avoid errors during server-side rendering
      if (typeof window !== "undefined") {
        const storedActiveUser = sessionStorage.getItem("activeUser");
        // Check if sessionStorage has the item before using it
        if (storedActiveUser) {
          const decryptedId = decrypt(JSON.parse(storedActiveUser));
          setActiveUser(decryptedId);
        }
      }
    };
    CheckUser();
  }, []);
  return (
    <form className="newProduct">
      <Input
        label="name"
        type="text"
        required={true}
        id="title"
        name="title"
        value={newProduct.title}
        onChangeFunction={handleInput}
      />

      {/* <div className="formItem">
        <label htmlFor="category"> category:</label>
        <select
          name="category"
          id="category"
          value={newProduct.category}
          onChange={handleInput}
        >
          <option value=""></option>
          {catagoriesSelect}
        </select>
      </div> */}
      <div className="formItem">
        <label htmlFor="description"> description:</label>
        <TipTap
          OldData={newProduct?.description}
          setHTML={handleDescriptionChange}
        />
      </div>
      {/* <div className="select-wrapper">
        <label htmlFor="Offer"> Offer?</label>
        <div style={{ display: "flex", gap: "50px" }}>
          <div className="form-check" id="Offer">
            <input
              required
              className="form-check-input"
              type="radio"
              name="Offer"
              id="offerYES"
              value={true}
              onChange={handleInput}
            />
            <label className="form-check-label" htmlFor="offerYES">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input
              required
              className="form-check-input"
              type="radio"
              name="Offer"
              id="offerNO"
              value={false}
              onChange={handleInput}
            />
            <label className="form-check-label" htmlFor="offerNO">
              No
            </label>
          </div>
        </div>
      </div>
      {newProduct.Offer ? (
        <div className="formItem">
          <label htmlFor="Discount">Discount percentage:</label>
          <input
            required
            type="number"
            id="Discount"
            name="discountPercentage"
            value={newProduct.discountPercentage}
            onChange={handleInput}
          ></input>
        </div>
      ) : (
        ""
      )}
      <div className="select-wrapper">
        <label htmlFor="HotProduct"> Hot Product List?</label>
        <div style={{ display: "flex", gap: "50px" }}>
          <div className="form-check" id="Hot">
            <input
              required
              className="form-check-input"
              type="radio"
              name="HotProduct"
              id="HotYes"
              value={true}
              onChange={handleInput}
            />
            <label className="form-check-label" htmlFor="HotYes">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input
              required
              className="form-check-input"
              type="radio"
              name="HotProduct"
              id="HotNo"
              value={false}
              onChange={handleInput}
            />
            <label className="form-check-label" htmlFor="HotNo">
              No
            </label>
          </div>
        </div>
      </div>
      <div className="formItem">
        <label htmlFor="Price">Product's COST:</label>
        <input
          min={0}
          required
          type="number"
          id="Price"
          name="cost"
          value={newProduct.cost}
          onChange={handleInput}
        ></input>
      </div> */}
      <Input
        label="displayed Price"
        type="number"
        required={true}
        id="price"
        name="price"
        value={newProduct.price}
        onChangeFunction={handleInput}
      />
      <p>
        notice: you only get 80% of the added Price <br></br> <br></br>you will
        get: {(newProduct.price * 0.8).toFixed(2)}
      </p>
      {/* <div className="formItem">
        <label htmlFor="stock">Product's stock:</label>
        <input
          required
          type="number"
          id="stock"
          name="stock"
          value={newProduct.stock}
          onChange={handleInput}
        ></input>
      </div> */}
      <div className="formItem photo">
        <label htmlFor="image">Product's Thumbnail:</label>
        <input
          required
          style={{ maxWidth: "119px" }}
          type="file"
          id="image"
          name="thumbnail"
          value=""
          onChangeFunction={handleInput}
        ></input>
      </div>
      <div className="formItem photo">
        <label htmlFor="images">Product's photos:</label>
        <input
          required
          style={{ maxWidth: "130px" }}
          type="file"
          id="images"
          name="images"
          multiple="multiple"
          value=""
          onChange={handleInput}
        ></input>
      </div>
      {status}
    </form>
  );
};
