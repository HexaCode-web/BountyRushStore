import "react-toastify/dist/ReactToastify.css";
import "./User.css";
import "../globals.css";
export const metadata = {
  title: "Portal",
};
export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
