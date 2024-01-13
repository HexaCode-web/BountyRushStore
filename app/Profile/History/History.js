import decrypt from "@/lib/decrypt";
import GETDOC from "@/lib/getDoc";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const History = ({ Products }) => {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState(null);

  useEffect(() => {
    const CheckUser = async () => {
      // Check if window is defined to avoid errors during server-side rendering
      if (typeof window !== "undefined") {
        const storedActiveUser = sessionStorage.getItem("activeUser");

        // Check if sessionStorage has the item before using it
        if (storedActiveUser) {
          const decryptedId = decrypt(JSON.parse(storedActiveUser));

          const fetchedUser = await GETDOC("users", decryptedId);
          setUser(fetchedUser);
        }
      }
    };
    CheckUser();
  }, []);

  const DataForProducts = user?.ProductsHistory?.map((request) => {
    return {
      ID: request.ID,
      DateOrderMade: request.CreatedAt,
      DateActionTaken: request.DateActionTaken,
      Product: <span>{request?.title}</span>,
      status: request.status ? (
        <span className="status" style={{ background: "green" }}>
          accepted
        </span>
      ) : (
        <span className="status">rejected</span>
      ),
    };
  });
  const columnsForOrderAndProducts = [
    {
      name: "request ID",
      selector: (row) => row.ID,
      sortable: true,
      center: true,
    },
    {
      name: "status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Product",
      selector: (row) => row.Product,
      sortable: true,
      center: true,
    },
    {
      name: "Date Request Made",
      selector: (row) => row.DateOrderMade,
      sortable: true,
      center: true,
    },
    {
      name: "Date Action Taken",
      selector: (row) => row.DateActionTaken,
      sortable: true,
      center: true,
    },
  ];
  const DataForOrder = user?.history?.map((order) => {
    const product = Products?.find((product) => {
      return product.id === order.product;
    });
    return {
      ID: order.ID,
      DateOrderMade: order.CreatedAt,
      DateActionTaken: order.DateActionTaken,
      Product: (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.location.href = `/Product/${product.id}`;
          }}
        >
          {product?.title}
        </span>
      ),
      status: order.status ? (
        <span className="status" style={{ background: "green" }}>
          accepted
        </span>
      ) : (
        <span className="status">rejected</span>
      ),
    };
  });
  const columnsForRefunds = [
    {
      name: "request ID",
      selector: (row) => row.ID,
      sortable: true,
      center: true,
    },
    {
      name: "status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.Amount,
      sortable: true,
      center: true,
    },
    {
      name: "Date Request Made",
      selector: (row) => row.DateOrderMade,
      sortable: true,
      center: true,
    },
    {
      name: "Date Action Taken",
      selector: (row) => row.DateActionTaken,
      sortable: true,
      center: true,
    },
  ];
  const DataForRefunds = user?.history?.map((Request) => {
    return {
      ID: Request.ID,
      DateOrderMade: Request.CreatedAt,
      DateActionTaken: Request.DateActionTaken,
      Amount: Request.Amount,
      status: Request.status ? (
        <span className="status" style={{ background: "green" }}>
          accepted
        </span>
      ) : (
        <span className="status">rejected</span>
      ),
    };
  });
  return (
    <div className="Pending-wrapper">
      <h2>Requests History</h2>
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
          <DataTable columns={columnsForOrderAndProducts} data={DataForOrder} />
        )}
        {activePage === "Products" && (
          <DataTable
            columns={columnsForOrderAndProducts}
            data={DataForProducts}
          />
        )}
        {activePage === "Refunds" && (
          <DataTable columns={columnsForRefunds} data={DataForRefunds} />
        )}
      </div>
    </div>
  );
};

export default History;
