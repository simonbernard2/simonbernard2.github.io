const ALLOWED_ORIGIN = "https://simonbernard.ca";
const TO_EMAIL = "info@simonbernard.ca";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sanitizeHeaderValue(str) {
  return str.replace(/[\r\n<>,"]/g, "").trim();
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders(),
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", {
        status: 400,
        headers: corsHeaders(),
      });
    }

    const { name, email, message } = body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return new Response("Invalid input", {
        status: 400,
        headers: corsHeaders(),
      });
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${sanitizeHeaderValue(name)} via simonbernard.ca <contact@contact.simonbernard.ca>`,
        to: TO_EMAIL,
        reply_to: email,
        subject: `Demande de réservation — ${name}`,
        html: `
          <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
          <p><strong>Courriel :</strong> ${escapeHtml(email)}</p>
          <p><strong>Message :</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!resendResponse.ok) {
      return new Response("Failed to send email", {
        status: 502,
        headers: corsHeaders(),
      });
    }

    return new Response("OK", { status: 200, headers: corsHeaders() });
  },
};
