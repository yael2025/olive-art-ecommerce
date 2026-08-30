import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!formData.username || !formData.email || !formData.password) {
        toast.error(t("registerPage.fillAllFields"));
        return;
      }

      await api.post("/users/register", formData);

      toast.success(t("registerPage.registrationSuccessful"));
      navigate("/login");
    } catch (error) {
      console.error("Register failed", error);

      toast.error(
        error.response?.data?.message ||
        t("registerPage.registerFailed")
      );
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={submitHandler}>
        <h2>{t("registerPage.title")}</h2>

        <input
          type="text"
          name="username"
          placeholder={t("registerPage.username")}
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder={t("registerPage.email")}
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder={t("registerPage.password")}
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">
          {t("registerPage.signUp")}
        </button>

        <p>
          {t("registerPage.alreadyHaveAccount")}{" "}
          <Link to="/login">
            {t("registerPage.signIn")}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;