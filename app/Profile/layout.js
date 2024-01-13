import "../globals.css";
import "react-toastify/dist/ReactToastify.css";
export const metadata = {
  title: "Profile",
};
export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
