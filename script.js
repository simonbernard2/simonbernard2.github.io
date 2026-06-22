const WORKER_URL = "https://contact.simonbernard.workers.dev";

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitButton = form.querySelector("button");
  const data = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value,
  };

  submitButton.disabled = true;
  status.textContent = "Envoi en cours...";
  status.className = "";

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    status.textContent = "Message envoyé. Merci!";
    status.className = "success";
    form.reset();
  } catch (err) {
    status.textContent = "Une erreur est survenue. Veuillez réessayer.";
    status.className = "error";
  } finally {
    submitButton.disabled = false;
  }
});
