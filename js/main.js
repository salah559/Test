```javascript
// Language toggle logic
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("lang-toggle");
  const allElements = document.querySelectorAll("[data-en][data-ar]");

  let currentLang = "en";

  function switchLang() {
    currentLang = currentLang === "en" ? "ar" : "en";
    allElements.forEach(el => {
      el.textContent = el.getAttribute(`data-${currentLang}`);
    });
    toggleBtn.textContent = currentLang === "en" ? "AR" : "EN";

    // Direction change for Arabic
    if (currentLang === "ar") {
      document.body.style.direction = "rtl";
      document.body.style.textAlign = "right";
    } else {
      document.body.style.direction = "ltr";
      document.body.style.textAlign = "left";
    }
  }

  toggleBtn.addEventListener("click", switchLang);
});
```
