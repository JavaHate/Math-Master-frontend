import Image from "next/image";
import localFont from "next/font/local";
import Header from "@/components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <>
      <Header></Header>
      <main>
        <h2 className="text-[#22333B] font-semibold text-5xl max-w-lg mx-auto pt-8 text-center mt-20">welcome</h2>
      </main>
    </>
  );
}
