const crypto = require("crypto");

const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipher(
    "aes-256-cbc",
    process.env.NEXT_PUBLIC_KEY
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};
export default decrypt;
