import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Olive Art Creations</h1>
          <p>
            Handmade Judaica products crafted from olive wood and colorful epoxy resin.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="primary-btn">
              Shop Products
            </Link>

            <Link to="/my-orders" className="secondary-btn">
              My Orders
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img src="/images/logo.jpg" alt="Olive Art Creations Logo" />
        </div>
      </section>

      <section className="home-info">
        <div className="info-card">
          <h3>Handmade Products</h3>
          <p>Unique mezuzot, menorahs, jewelry, candle holders and home decor.</p>
        </div>

        <div className="info-card">
          <h3>Natural Materials</h3>
          <p>Products made with olive wood, resin, and artistic handmade finishes.</p>
        </div>

        <div className="info-card">
          <h3>Personal Gifts</h3>
          <p>Perfect for holidays, weddings, housewarming gifts and special occasions.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;