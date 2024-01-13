"use client";
import QUERY from "@/lib/query";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const Pending = ({ user, Products }) => {
  const [activePage, setActivePage] = useState(null);
  const [pendingProducts, setPendingProducts] = useState(null);
  const [pendingOrders, setOrders] = useState(null);
  const [pendingRefunds, setPendingRefunds] = useState(null);
  useEffect(() => {
    const getLists = async () => {
      try {
        const [pendingProductsData, ordersData, pendingRefundsData] =
          await Promise.all([
            QUERY("pendingProducts", "User", "==", user.id),
            QUERY("pendingOrders", "User", "==", user.id),
            QUERY("pendingRefunds", "UserID", "==", user.id),
          ]);

        setPendingProducts(pendingProductsData);
        setOrders(ordersData);
        setPendingRefunds(pendingRefundsData);
      } catch (error) {
        // Handle errors if necessary
        console.error("Error fetching data:", error);
      }
    };

    getLists();
  }, [user.id]);

  const columnsForPendingOrders = [
    {
      name: "Order ID",
      selector: (row) => row.ID,
      sortable: true,
      center: true,
    },
    {
      name: "Product ID",
      selector: (row) => row.ProductID,
      sortable: true,
      center: true,
    },
    {
      name: "Product",
      selector: (row) => row.Product,
      sortable: true,
      center: true,
    },
    {
      name: "Date Made",
      selector: (row) => row.Date,
      sortable: true,
      center: true,
    },
  ];
  const dataForPendingOrders = pendingOrders?.map((Order) => {
    const product = Products?.find((product) => {
      return product.id === Order.product;
    });
    return {
      Date: Order.CreatedAt,
      ID: +Order.ID,
      ProductID: +product?.id,
      Product: (
        <div
          onClick={() => {
            window.location.href = `/Product/${product.id}`;
          }}
        >
          {product?.title}
        </div>
      ),
    };
  });
  const columnsForPendingProducts = [
    {
      name: "Product ID",
      selector: (row) => row.ID,
      sortable: true,
      center: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.Product,
      sortable: true,
      center: true,
    },
    {
      name: "Date Made",
      selector: (row) => row.Date,
      sortable: true,
      center: true,
    },
  ];
  const dataForPendingProducts = pendingProducts?.map((Product) => {
    return {
      Date: Product.CreatedAt,
      ID: Product.id,
      Product: (
        <div
          onClick={() => {
            window.location.href = `/Product/${Product.id}`;
          }}
        >
          {Product.title}
        </div>
      ),
    };
  });
  const columnsForPendingRefunds = [
    {
      name: "Refund amount",
      selector: (row) => row.Amount,
      sortable: true,
      center: true,
    },
    {
      name: "Refund ID",
      selector: (row) => row.ID,
      sortable: true,
      center: true,
    },
    {
      name: "Date Made",
      selector: (row) => row.Date,
      sortable: true,
      center: true,
    },
  ];
  const dataForPendingRefunds = pendingRefunds?.map((Refund) => {
    return {
      Date: Refund.CreatedAt,
      ID: Refund.ID,
      Amount: Refund.Amount,
    };
  });
  return (
    <div className="Pending-wrapper">
      <h2>Pending Requests</h2>
      <ul className="nav">
        <li
          onClick={() => setActivePage("Orders")}
          style={{ animationDelay: ".1s" }}
          className={`${
            activePage === "Orders" ? "ActiveLink" : ""
          } animate__animated animate__backInDown `}
        >
          Orders
        </li>
        <li
          onClick={() => setActivePage("Products")}
          style={{ animationDelay: ".2s" }}
          className={`${
            activePage === "Products" ? "ActiveLink" : ""
          } animate__animated animate__backInDown `}
        >
          Products
        </li>
        <li
          onClick={() => setActivePage("Refunds")}
          style={{ animationDelay: ".3s" }}
          className={`${
            activePage === "Refunds" ? "ActiveLink" : ""
          } animate__animated animate__backInDown `}
        >
          Refunds
        </li>
      </ul>
      <div className="Data" style={{ width: "100%", marginTop: "20px" }}>
        {activePage === "Orders" && (
          <DataTable
            columns={columnsForPendingOrders}
            data={dataForPendingOrders}
          />
        )}
        {activePage === "Products" && (
          <DataTable
            columns={columnsForPendingProducts}
            data={dataForPendingProducts}
          />
        )}
        {activePage === "Refunds" && (
          <DataTable
            columns={columnsForPendingRefunds}
            data={dataForPendingRefunds}
          />
        )}
      </div>
    </div>
  );
};

export default Pending;
