import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import RevealObserver from "./components/RevealObserver";

export const metadata = {
  title: {
    default: "MICHEAL NORONHA",
    template: "%s — MICHEAL NORONHA"
  },
  description:
    "Thoughtful design and dependable technology for freelancers, ambitious startups and established businesses.",
  metadataBase: new URL("https://www.michealnoronha.com")
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <RevealObserver />
      </body>
    </html>
  );
}
