import GETDOC from "@/lib/getDoc";
import "./globals.css";
import { Montserrat } from "next/font/google";
import "animate.css";

const montserrat = Montserrat({
  subsets: ["cyrillic"],
  weight: ["400", "700", "300", "500", "100"],
});
export async function generateMetadata() {
  const fetchWebData = await GETDOC("websiteData", "title");
  return {
    title: fetchWebData.title,

    openGraph: {
      title: fetchWebData.title,

      siteName: fetchWebData.title,

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
