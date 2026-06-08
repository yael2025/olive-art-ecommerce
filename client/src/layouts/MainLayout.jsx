import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
 import AiChatWidget from "../components/AiChatWidget";

function MainLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <AiChatWidget/>
      <Footer />
    </div>
  );
}

export default MainLayout;