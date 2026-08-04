import {
    FaWhatsapp,
    FaEnvelope,
    FaInstagram,
    FaFacebookF,
    FaClock,
    FaCheck,
  } from "react-icons/fa";
  
  import "../styles/contact.css";
  
  function ContactPage() {
    return (
      <div className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero-content">
            <span className="contact-label">Let&apos;s Create Together</span>
  
            <h1>Let&apos;s Create Something Meaningful Together</h1>
  
            <p>
              Looking for a personalized Judaica gift, a custom laser engraving,
              or a unique handmade creation? We would love to hear your ideas and
              help you create something truly special.
            </p>
  
            <p>
              Every piece is handcrafted with care using natural olive wood,
              premium epoxy resin, and attention to every detail.
            </p>
          </div>
        </section>
  
        <section className="contact-section">
          <div className="contact-section-heading">
            <span>Custom Creations</span>
            <h2>Why Contact Us?</h2>
            <p>
              We specialize in handmade Judaica products that can be customized
              for meaningful occasions, personal gifts, and unique requests.
            </p>
          </div>
  
          <div className="contact-features">
            <div className="contact-feature">
              <FaCheck />
              <span>Personalized laser engravings</span>
            </div>
  
            <div className="contact-feature">
              <FaCheck />
              <span>Custom epoxy color combinations</span>
            </div>
  
            <div className="contact-feature">
              <FaCheck />
              <span>Wedding and Bar or Bat Mitzvah gifts</span>
            </div>
  
            <div className="contact-feature">
              <FaCheck />
              <span>Family and business gifts</span>
            </div>
  
            <div className="contact-feature">
              <FaCheck />
              <span>Custom sizes and special requests</span>
            </div>
  
            <div className="contact-feature">
              <FaCheck />
              <span>One-of-a-kind handmade Judaica creations</span>
            </div>
          </div>
        </section>
  
        <section className="contact-section">
          <div className="contact-section-heading">
            <span>Get in Touch</span>
            <h2>Choose the Most Convenient Way to Reach Us</h2>
            <p>
              We will be happy to answer questions, discuss custom orders, and
              help you choose the right product.
            </p>
          </div>
  
          <div className="contact-methods">
            <a
              className="contact-method-card"
              href="https://wa.me/972500000000"
              target="_blank"
              rel="noreferrer"
            >
              <div className="contact-method-icon whatsapp-icon">
                <FaWhatsapp />
              </div>
  
              <div>
                <h3>WhatsApp</h3>
                <p>
                  The fastest way to ask questions and discuss personalized
                  orders.
                </p>
                <span>Chat on WhatsApp</span>
              </div>
            </a>
  
            <a
              className="contact-method-card"
              href="mailto:oliveart@example.com"
            >
              <div className="contact-method-icon email-icon">
                <FaEnvelope />
              </div>
  
              <div>
                <h3>Email</h3>
                <p>
                  For detailed inquiries, custom requests, and order
                  information.
                </p>
                <span>oliveart@example.com</span>
              </div>
            </a>
  
            <a
              className="contact-method-card"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="contact-method-icon instagram-icon">
                <FaInstagram />
              </div>
  
              <div>
                <h3>Instagram</h3>
                <p>
                  See our newest creations, behind-the-scenes work, and customer
                  favorites.
                </p>
                <span>Follow us on Instagram</span>
              </div>
            </a>
  
            <a
              className="contact-method-card"
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="contact-method-icon facebook-icon">
                <FaFacebookF />
              </div>
  
              <div>
                <h3>Facebook</h3>
                <p>
                  Stay updated with new collections, handmade products, and
                  special offers.
                </p>
                <span>Visit our Facebook page</span>
              </div>
            </a>
          </div>
        </section>
  
        <section className="contact-bottom-grid">
          <div className="contact-info-card">
            <div className="contact-card-title">
              <FaClock />
              <h2>Business Hours</h2>
            </div>
  
            <div className="business-hours">
              <div className="business-hours-row">
                <span>Sunday – Thursday</span>
                <strong>08:00 – 18:00</strong>
              </div>
  
              <div className="business-hours-row">
                <span>Friday</span>
                <strong>08:00 – 13:00</strong>
              </div>
  
              <div className="business-hours-row">
                <span>Saturday</span>
                <strong>Closed</strong>
              </div>
            </div>
          </div>
  
          <div className="contact-info-card personalized-orders-card">
            <h2>Personalized Orders</h2>
  
            <p>
              Many of our products can be customized according to your
              preferences.
            </p>
  
            <ul>
              <li>Personal names and family blessings</li>
              <li>Custom laser engravings</li>
              <li>Different epoxy colors</li>
              <li>Special dimensions and shapes</li>
              <li>Gift packaging</li>
              <li>Unique design requests</li>
            </ul>
  
            <small>
              Additional charges may apply depending on the requested
              customization.
            </small>
          </div>
        </section>
  
        <section className="contact-closing">
          <p>
            Every handmade piece tells a story. We&apos;d be honored to create
            yours.
          </p>
        </section>
      </div>
    );
  }
  
  export default ContactPage;