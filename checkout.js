// This is your test publishable API key.
const stripe = Stripe("pk_test_51PSbDP069fI52UxylVoga7Eq1bR6CYbgV5MWYnb1s3YrwHAOgwA4lgpNdNySq8hLxJrJzv60A6T4l0JMiMhDSeYi000D8CLhe7");

// The items the customer wants to buy
// const items = [{ id: "xl-tshirt" }];

let elements;

initialize();
checkStatus();

document
  .querySelector("#payment-form")
  .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
  // const response = await fetch("http://aigtd.51smartsafe.com/user/auth/user/buy", {
  //   method: "POST", // *GET, POST, PUT, DELETE, etc.
  //   headers: {
  //     "Content-Type": "application/json",
  //     "aigtd-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBaUd0ZCIsImV4cCI6MTcyMzUyNzk0MiwidXNlcklkIjoiMTgwMjUzMDU2MzczNTc4OTU2OSJ9.mNHXbK90Kg7r03RVqZ4FHy36kMftgN9_KNiRexl8-u8"
  //   },
  //   body: JSON.stringify({ skuId: 1 }), // body data type must match "Content-Type" header
  // });
  // const { data } = await response.json();
  const searchStr = window.location.search;
  // URLSearchParams() 构造函数可以接受一个查询字符串作为参数，用于初始化 URLSearchParams 对象。
  const searchParams = new URLSearchParams(searchStr);
  const appearance = {
    theme: 'stripe',
  };
elements = stripe.elements({ appearance, clientSecret: searchParams.get('clientSecret') });
  const paymentElementOptions = {
    layout: "tabs",
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: " https://939138263.github.io/stripe/complete.html",
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

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

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}
