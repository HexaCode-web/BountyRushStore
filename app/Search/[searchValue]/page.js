"use client";

import React, { useEffect, useState } from "react";
import Card from "@/app/components/Card/Card";
import { useParams } from "next/navigation";
import GETCOLLECTION from "@/lib/getCollection";
import Nav from "@/app/components/Nav/Nav";
import Loading from "@/app/loading";
import decrypt from "@/lib/decrypt";
export default function Page() {
  const [activeUser, setActiveUser] = useState("");
  const [UpdateCart, setUpdateCart] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchValue = decodeURIComponent(useParams().searchValue);
  useEffect(() => {
    // Check if window is defined to avoid errors during server-side rendering
    if (typeof window !== "undefined") {
      const storedActiveUser = sessionStorage.getItem("activeUser");

      // Check if sessionStorage has the item before using it
      if (storedActiveUser) {
        const decryptedId = decrypt(JSON.parse(storedActiveUser));
        setActiveUser(decryptedId);
      }
    }
  }, []);
  useEffect(() => {
    const fetchResults = async () => {
      const Data = await GETCOLLECTION("products");
      setFilteredData(
        Data.filter((product) => {
          return product.title
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        })
      );
      setLoading(false);
    };
    fetchResults();
  }, []);
  return (
    <>
      <Loading loading={loading} />

      {!loading && (
        <>
          <Nav />
          <div style={{ marginTop: "90px" }}>
            {filteredData.length === 0 ? (
              <h1> Whoops! no products were found! try changing your words!</h1>
            ) : (
              filteredData.map((product) => {
                return <Card key={product.id} product={product} />;
              })
            )}
          </div>
        </>
      )}
    </>
  );
}
