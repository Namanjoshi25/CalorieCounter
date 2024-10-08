
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";

import Header from "@/components/component/header";
import ReduxProvider from "@/lib/store/reduxProvider";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'], // Specify the font weights you want to use
  subsets: ['latin'], // Specify the subsets you want to use
 // Control how font swapping works
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className} >
        <ReduxProvider>
        <Header/>
        {children}
        </ReduxProvider>
        </body>
    </html>
  );
}
