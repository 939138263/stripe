// This is your test publishable API key.
const stripe = Stripe("pk_test_51PHiN6Dri5WDYGz2vq0zglnpyKAIdA54PFYYrQGKO6GHJSAcqcAwcDzQJDPSBWxMpToFWPGsXCo8XLoDb7oavuO700PjbYnMKM");

let elements;


checkStatus();

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;
//
//  setTimeout(function () {
//    messageContainer.classList.add("hidden");
//    messageContainer.textContent = "";
//  }, 4000);
}