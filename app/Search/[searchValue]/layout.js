import "react-toastify/dist/ReactToastify.css";
import "../../globals.css";

export const metadata = {
  title: "Search",
};
export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
