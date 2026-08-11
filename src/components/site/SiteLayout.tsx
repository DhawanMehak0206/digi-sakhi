import Header from "./Header";
import Footer from "./Footer";
import Analytics from "./Analytics";
import { Outlet } from "react-router-dom";

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Analytics />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
