import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/userService";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const data = await loginUser(formData.email, formData.password);
      login(data);
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || t("loginPage.loginFailed")
      );
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{t("loginPage.title")}</h2>

        {errorMessage && (
          <p style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder={t("loginPage.email")}
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder={t("loginPage.password")}
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">
          {t("loginPage.signIn")}
        </button>

        <p>
          {t("loginPage.noAccount")}{" "}
          <Link to="/register">
            {t("loginPage.signUp")}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;