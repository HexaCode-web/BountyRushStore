"use client";
import React, { useEffect, useState } from "react";

import Icons from "../HandleIconChange";

import "./Nav.css";
import GETCOLLECTION from "@/lib/getCollection";
import GETDOC from "@/lib/getDoc";
import SETDOC from "@/lib/setDoc";
import decrypt from "@/lib/decrypt";
import { REALTIME } from "@/lib/Realtime";

export default function Nav() {
  const [activeUser, setActiveUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [ShowDropDown, setShowDropDown] = React.useState(false);
  const [logo, setLogo] = React.useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (activeUser) {
      // Call the REALTIME function with the appropriate arguments
      const unsubscribe = REALTIME("users", activeUser.id, setActiveUser);

      // Clean up the snapshot listener when the component unmounts
      return () => {
        unsubscribe();
      };
    }
  }, [activeUser.id]);

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
          setActiveUser(fetchedUser);
        }
      }
      const logo = await GETDOC("websiteData", "icon");
      setLogo(logo.icon);
      setLoading(false);
    };
    CheckUser();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        window.location.href = `/Search/${searchValue}`;
      }
    };
    // Add event listener when component mounts
    document
      .getElementById("Search")
      .addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      if (document.getElementById("Search")) {
        document
          .getElementById("Search")
          .removeEventListener("keydown", handleKeyPress);
      }
    };
  }, [searchValue]); // Empty dependency array means this effect runs once when the component mounts

  const logOut = async () => {
    let cleanData = [];
    await GETCOLLECTION("users").then((response) => {
      cleanData = response;
    });
    cleanData.forEach(async (User) => {
      if (User.Username === activeUser.Username) {
        User.Active = false;
      }
      await SETDOC("users", User.id, { ...User });
      sessionStorage.clear();
      window.location.href = "/";
    });
  };
  // useEffect(() => {
  //   if (!loading) {
  //     document.getElementById("itemThree").addEventListener("click", () => {
  //       if (activeUser) {
  //         if (isAdmin) {
  //           return;
  //         } else {
  //           setShowDropDown(true);
  //         }
  //       } else {
  //         window.location.href = "/Portal";
  //       }
  //     });
  //   }
  // }, [activeUser]);
  return (
    <>
      <div className="Nav">
        <div className="nav animate__animated animate__fadeInDown">
          <a href="/">
            <img className="logo" src={logo}></img>
          </a>
          <div className={`search-wrapper ${showSearch ? "animate" : ""}`}>
            <input
              id="Search"
              type="text"
              value={searchValue}
              className="search"
              name="search"
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
            <span className="item itemFour"></span>
          </div>
          <ul>
            <Icons
              className="item"
              defaultSrc="/search.png"
              hoverSrc="/search-hover.png"
              onClick={() => {
                setShowSearch((prev) => !prev);
              }}
            />

            <div className="dropDown-wrapper">
              {isAdmin && (
                <Icons
                  className="item"
                  defaultSrc="/dashboard.png"
                  hoverSrc="/dashboard-hover.png"
                  onClick={() => {
                    window.location.href = "/Dashboard";
                  }}
                />
              )}
              {activeUser ? (
                <img
                  className="item"
                  id="itemThree"
                  onClick={() => {
                    setShowDropDown(true);
                  }}
                  src={ShowDropDown ? "/login-hover.png" : "/login.png"}
                ></img>
              ) : (
                <img
                  className="item"
                  onClick={() => {
                    window.location.href = "/Portal";
                  }}
                  src={ShowDropDown ? "/login-hover.png" : "/login.png"}
                ></img>
              )}

              {ShowDropDown && (
                <div className="DropDown">
                  <div style={{ position: "relative" }}>
                    {activeUser?.CartCount > 0 ? (
                      <div className="CartCounter">{activeUser?.CartCount}</div>
                    ) : (
                      ""
                    )}
                    <Icons
                      className="item"
                      defaultSrc="/cart-hover.png"
                      hoverSrc="/cart-hover.png"
                      onClick={() => {
                        window.location.href = "/Cart";
                      }}
                    />
                  </div>
                  <Icons
                    className="item"
                    defaultSrc="/heart.png"
                    hoverSrc="/heart-hover.png"
                    onClick={() => {
                      window.location.href = "/Profile";
                    }}
                  />
                  <Icons
                    className="item"
                    defaultSrc="/settings.png"
                    hoverSrc="/settings-hover.png"
                    onClick={() => {
                      window.location.href = "/Profile/Settings";
                    }}
                  />
                </div>
              )}
            </div>
            {activeUser && (
              <>
                <Icons
                  className="item"
                  defaultSrc="/logout.png"
                  hoverSrc="/logout-hover.png"
                  onClick={() => {
                    logOut();
                  }}
                />
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
