import { useTranslation } from "react-i18next";

function NotFoundPage() {
  const { t } = useTranslation();

  return <h2>{t("notFoundPage.title")}</h2>;
}

export default NotFoundPage;