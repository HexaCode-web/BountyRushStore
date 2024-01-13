import GETDOC from "@/lib/getDoc";
import { Montserrat } from "next/font/google";
import "../../globals.css";
import "animate.css";
import "react-toastify/dist/ReactToastify.css";

const montserrat = Montserrat({
  subsets: ["cyrillic"],
  weight: ["400", "700", "300", "500", "100"],
});
export async function generateMetadata({ params }, parent) {
  // read route params
  const id = params.ID;

  // fetch data
  const product = await GETDOC("products", id);

  // optionally access and extend (rather than replace) parent metadata

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,

      siteName: product.title,

      locale: "en_US",
      type: "website",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
