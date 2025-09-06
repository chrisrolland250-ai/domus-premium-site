const nodemailer = require("nodemailer");

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});

exports.handler = async (event) => {
  const origin = process.env.ALLOWED_ORIGIN || "*";

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders(origin), body: "ok" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders(origin), body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    if (data.website) return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ ok: true }) };
    if (!data.ts || Date.now() - Number(data.ts) < 1000)
      return { statusCode: 400, headers: corsHeaders(origin), body: "Submission too fast" };

    const { from_name, reply_to, phone, subject, message } = data;
    if (!from_name || !reply_to || !message)
      return { statusCode: 422, headers: corsHeaders(origin), body: "Missing required fields" };

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });

    const fromEmail = process.env.FROM_EMAIL || "no-reply@domuspremium.fr";
    const toEmail = process.env.TO_EMAIL || "contact@domuspremium.fr";

    const text = [
      "Nouveau message depuis domuspremium.fr",
      "",
      `Nom      : ${from_name}`,
      `Email    : ${reply_to}`,
      phone ? `Téléphone: ${phone}` : null,
      `Sujet    : ${subject || "Message du site"}`,
      "",
      "Message :",
      message,
    ].filter(Boolean).join("\n");

    await transporter.sendMail({
      from: `Domus Premium <${fromEmail}>`,
      to: toEmail,
      replyTo: `${from_name} <${reply_to}>`,
      subject: `Domus Premium • ${subject || "Contact"}`,
      text,
    });

    return { statusCode: 200, headers: corsHeaders(origin), body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error("Send error:", err);
    return { statusCode: 500, headers: corsHeaders(origin), body: "Internal Server Error" };
  }
};
