const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Olive Art Creations <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log("EMAIL SENT:", data?.id);

    return data;
  } catch (error) {
    console.error("EMAIL SEND ERROR:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};