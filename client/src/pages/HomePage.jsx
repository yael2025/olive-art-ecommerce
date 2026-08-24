import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { user } = useUser();
  const { t } = useTranslation();

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Olive Art Creations</h1>

          <p>{t("homePage.heroText")}</p>

          <div className="home-actions">
            <Link to="/products" className="home-btn primary">
              {t("homePage.shopProducts")}
            </Link>

            {user && (
              <Link to="/my-orders" className="home-btn secondary">
                {t("homePage.myOrders")}
              </Link>
            )}
          </div>
        </div>

        <div className="hero-image">
          <img
            src="/images/logo.jpg"
            alt="Olive Art Creations Logo"
          />
        </div>
      </section>

      <section className="home-info">
        <div className="info-card">
          <h3>{t("homePage.handmadeProducts")}</h3>
          <p>{t("homePage.handmadeProductsText")}</p>
        </div>

        <div className="info-card">
          <h3>{t("homePage.naturalMaterials")}</h3>
          <p>{t("homePage.naturalMaterialsText")}</p>
        </div>

        <div className="info-card">
          <h3>{t("homePage.personalGifts")}</h3>
          <p>{t("homePage.personalGiftsText")}</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;