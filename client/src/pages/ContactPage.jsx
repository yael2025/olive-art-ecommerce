import {
  FaWhatsapp,
  FaEnvelope,
  FaInstagram,
  FaFacebookF,
  FaClock,
  FaCheck,
} from "react-icons/fa";

import "../styles/contact.css";
import { useTranslation } from "react-i18next";

function ContactPage() {
  const { t, i18n } = useTranslation();

  const whatsappMessage =
    i18n.language === "he"
      ? "שלום Olive Art Creations! אשמח לשאול לגבי מוצר יודאיקה בהתאמה אישית."
      : "Hello Olive Art Creations! I would like to ask about a custom Judaica product.";

  const whatsappUrl = `https://wa.me/972533353529?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-label">
            {t("contactPage.heroLabel")}
          </span>

          <h1>{t("contactPage.heroTitle")}</h1>

          <p>{t("contactPage.heroText1")}</p>

          <p>{t("contactPage.heroText2")}</p>

          <div className="contact-handmade-note">
            {t("contactPage.handmadeNote")}
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-section-heading">
          <span>{t("contactPage.customCreations")}</span>

          <h2>{t("contactPage.whyContactUs")}</h2>

          <p>{t("contactPage.whyContactText")}</p>
        </div>

        <div className="contact-features">
          <div className="contact-feature">
            <FaCheck />
            <span>{t("contactPage.feature1")}</span>
          </div>

          <div className="contact-feature">
            <FaCheck />
            <span>{t("contactPage.feature2")}</span>
          </div>

          <div className="contact-feature">
            <FaCheck />
            <span>{t("contactPage.feature3")}</span>
          </div>

          <div className="contact-feature">
            <FaCheck />
            <span>{t("contactPage.feature4")}</span>
          </div>

          <div className="contact-feature">
            <FaCheck />
            <span>{t("contactPage.feature5")}</span>
          </div>

          <div className="contact-feature">
            <FaCheck />
            <span>{t("contactPage.feature6")}</span>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-section-heading">
          <span>{t("contactPage.getInTouch")}</span>

          <h2>{t("contactPage.contactMethodsTitle")}</h2>

          <p>{t("contactPage.contactMethodsText")}</p>
        </div>

        <div className="contact-methods">
          <a
            className="contact-method-card"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            <div className="contact-method-icon whatsapp-icon">
              <FaWhatsapp />
            </div>

            <div>
              <h3>WhatsApp</h3>

              <p>{t("contactPage.whatsappText")}</p>

              <span>{t("contactPage.whatsappAction")}</span>
            </div>
          </a>

          <a
            className="contact-method-card"
            href="mailto:avihopi@gmail.com"
          >
            <div className="contact-method-icon email-icon">
              <FaEnvelope />
            </div>

            <div>
              <h3>{t("contactPage.emailTitle")}</h3>

              <p>{t("contactPage.emailText")}</p>

              <span>avihopi@gmail.com</span>
            </div>
          </a>

          <a
            className="contact-method-card"
            href="https://www.instagram.com/pinhas_aviho_judaica/"
            target="_blank"
            rel="noreferrer"
          >
            <div className="contact-method-icon instagram-icon">
              <FaInstagram />
            </div>

            <div>
              <h3>Instagram</h3>

              <p>{t("contactPage.instagramText")}</p>

              <span>{t("contactPage.instagramAction")}</span>
            </div>
          </a>

          <a
            className="contact-method-card"
            href="https://www.facebook.com/profile.php?id=61558005151115"
            target="_blank"
            rel="noreferrer"
          >
            <div className="contact-method-icon facebook-icon">
              <FaFacebookF />
            </div>

            <div>
              <h3>Facebook</h3>

              <p>{t("contactPage.facebookText")}</p>

              <span>{t("contactPage.facebookAction")}</span>
            </div>
          </a>
        </div>
      </section>

      <section className="contact-bottom-grid">
        <div className="contact-info-card">
          <div className="contact-card-title">
            <FaClock />
            <h2>{t("contactPage.businessHours")}</h2>
          </div>

          <div className="business-hours">
            <div className="business-hours-row">
              <span>{t("contactPage.sundayThursday")}</span>
              <strong>08:00 – 18:00</strong>
            </div>

            <div className="business-hours-row">
              <span>{t("contactPage.friday")}</span>
              <strong>08:00 – 13:00</strong>
            </div>

            <div className="business-hours-row">
              <span>{t("contactPage.saturday")}</span>
              <strong>{t("contactPage.closed")}</strong>
            </div>
          </div>
        </div>

        <div className="contact-info-card personalized-orders-card">
          <h2>{t("contactPage.personalizedOrders")}</h2>

          <p>{t("contactPage.personalizedOrdersText")}</p>

          <ul>
            <li>{t("contactPage.personalized1")}</li>
            <li>{t("contactPage.personalized2")}</li>
            <li>{t("contactPage.personalized3")}</li>
            <li>{t("contactPage.personalized4")}</li>
            <li>{t("contactPage.personalized5")}</li>
            <li>{t("contactPage.personalized6")}</li>
          </ul>

          <small>
            {t("contactPage.additionalCharges")}
          </small>
        </div>
      </section>

      <section className="contact-closing">
        <p>{t("contactPage.closingText")}</p>

        <span>{t("contactPage.replyTime")}</span>
      </section>
    </div>
  );
}

export default ContactPage;