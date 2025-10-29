async function sendOTP() {
  const email = document.getElementById("email").value;
  const res = await fetch("/api/otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  const msg = document.getElementById("message");
  if (res.ok) {
    msg.innerHTML = "<span class='access-granted'>OTP Sent Successfully!</span>";
    document.getElementById("otp-section").style.display = "block";
  } else {
    msg.innerHTML = `<span class='glitch'>Error: ${data.error}</span>`;
  }
}

async function verifyOTP() {
  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;
  const res = await fetch("/api/otp/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  const msg = document.getElementById("message");
  if (res.ok) {
    msg.innerHTML = "<span class='access-granted'>Access Granted</span>";
    setTimeout(() => (window.location = "dashboard.html"), 1500);
  } else {
    msg.innerHTML = `<span class='glitch'>Access Denied: ${data.error}</span>`;
  }
}
