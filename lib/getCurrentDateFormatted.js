function getCurrentDateFormatted() {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = String(currentDate.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}
export default getCurrentDateFormatted;
