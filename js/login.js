document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Redirect ke halaman utama
    window.location.href = "Home.html";
  });
});