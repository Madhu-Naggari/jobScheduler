async function sendWebhook(payload) {
  if (!process.env.WEBHOOK_URL) {
    console.warn("⚠️ WEBHOOK_URL not set, skipping webhook");
    return;
  }

  try {
    const response = await fetch(process.env.WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("✅ Webhook sent:", response.status);
  } catch (error) {
    console.error("❌ Webhook failed:", error.message);
  }
}

module.exports = { sendWebhook };
