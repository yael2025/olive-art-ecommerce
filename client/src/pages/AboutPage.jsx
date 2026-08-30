import "../styles/about.css";
import { useTranslation } from "react-i18next";

function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-content">
          <span className="abour-label">
            {t("aboutPage.storyLabel")}
          </span>

          <h1>{t("aboutPage.heroTitle")}</h1>

          <p>
            {t("aboutPage.heroText")}
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-card">
          <h2>{t("aboutPage.journeyTitle")}</h2>

          <p>{t("aboutPage.journeyText1")}</p>

          <p>{t("aboutPage.journeyText2")}</p>
        </div>

        <div className="about-family-card">
          <h2>{t("aboutPage.familyTitle")}</h2>

          <p>{t("aboutPage.familyText1")}</p>

          <p>{t("aboutPage.familyText2")}</p>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;