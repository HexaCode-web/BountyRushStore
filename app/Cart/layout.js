import "../globals.css";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Check Out",
};
export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
