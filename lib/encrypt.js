const crypto = require("crypto");
const encrypt = (text) => {
  const cipher = crypto.createCipher(
    "aes-256-cbc",
    process.env.NEXT_PUBLIC_KEY
  );
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};
export default encrypt;
