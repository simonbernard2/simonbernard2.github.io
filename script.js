const WORKER_URL = "https://contact.simonbernard.workers.dev";
const SITEVERIFY_URL = "https://turnstile-siteverify-simonbernard-ca.simonbernard.workers.dev";

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitButton = form.querySelector("button");

let turnstileVerified = false;

function updateSubmitButton() {
  submitButton.disabled = !turnstileVerified || !form.checkValidity();
}

window.onTurnstileSuccess = () => {
  turnstileVerified = true;
  updateSubmitButton();
};

window.onTurnstileExpired = () => {
  turnstileVerified = false;
  updateSubmitButton();
};

form.addEventListener("input", updateSubmitButton);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value,
    email: form.email.value,
    message: form.message.value,
  };

  submitButton.disabled = true;
  status.textContent = "Envoi en cours...";
  status.className = "";

  try {
    const token = form.querySelector('[name="cf-turnstile-response"]').value;
    const verifyResponse = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      throw new Error("Verification failed");
    }

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
    turnstile.reset();
    turnstileVerified = false;
    updateSubmitButton();
  }
});
