import Input from "@/lib/Input/Input";
import CreateToast from "@/lib/createToast";
import decrypt from "@/lib/decrypt";
import getCurrentDateFormatted from "@/lib/getCurrentDateFormatted";
import GETDOC from "@/lib/getDoc";
import SETDOC from "@/lib/setDoc";
import UPDATEDOC from "@/lib/updateDoc";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Wallet = () => {
  const [user, setUser] = useState(null);
  const [refundMenu, setRefundMenu] = useState(false);
  const [refundRequest, setRefundRequest] = useState({
    UserID: null,
    Amount: 0,
    InstaPayEmail: "",
    Status: "",
    ID: uuidv4(),
    CreatedAt: "",
    ActionTakenAt: "",
  });
  console.log(refundRequest);
  const handleInput = (e) => {
    const { name, value } = e.target;
    setRefundRequest((prev) => {
      return { ...prev, [name]: value, CreatedAt: getCurrentDateFormatted() };
    });
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
          setRefundRequest((prev) => {
            return { ...prev, UserID: decryptedId };
          });
          setUser(fetchedUser);
        }
      }
    };
    CheckUser();
  }, []);
  const SubmitRefund = async () => {
    if (refundRequest.Amount > user.Wallet) {
      CreateToast(
        "error sending request:wallet amount is not sufficient",
        "error"
      );
      return;
    }
    try {
      await SETDOC("pendingRefunds", refundRequest.ID, refundRequest, true);
      await UPDATEDOC("users", user.id, {
        ...user,
        Wallet: user.Wallet - refundRequest.Amount,
      });
      setUser((prev) => {
        return { ...prev, Wallet: user.Wallet - refundRequest.Amount };
      });
      setRefundRequest({
        UserID: user.id,
        Amount: 0,
        InstaPayEmail: "",
        Status: "",
        ID: uuidv4(),
        CreatedAt: "",
        ActionTakenAt: "",
      });
      setRefundMenu(false);
      CreateToast("Refund request sent", "success");
    } catch (error) {
      console.log(error);
      CreateToast("error sending request", "error");
    }
  };
  const ClearRefund = () => {
    setRefundRequest({
      UserID: user.id,
      Amount: 0,
      InstaPayEmail: "",
      Status: "",
      ID: uuidv4(),
      CreatedAt: "",
      ActionTakenAt: "",
    });
    setRefundMenu(false);
  };
  return (
    <div className="Wallet-wrapper">
      <h3 className="Amount">Amount in Wallet: {user?.Wallet}</h3>
      <button
        onClick={() => {
          setRefundMenu(true);
        }}
      >
        Request Refund
      </button>
      {refundMenu && (
        <div className="Refund-Menu">
          <Input
            label="Refund Amount"
            type="number"
            required={true}
            name="Amount"
            value={refundRequest.Amount}
            onChangeFunction={handleInput}
          />
          <Input
            label="instaPay email"
            type="Email"
            required={true}
            name="InstaPayEmail"
            value={refundRequest.InstaPayEmail}
            onChangeFunction={handleInput}
          />
          <div className="actions">
            <button onClick={SubmitRefund}>Send Request</button>
            <button onClick={ClearRefund}>Cancel Request</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
