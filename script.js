// ============================================
// KONÉ DÉPOU H'LIE — GÉNIE CIVIL
// i18n + interactions
// ============================================

const SUPPORTED_LANGS = ["fr", "en", "es"];
const DEFAULT_LANG = "fr";
let translations = {};

async function loadLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
  try {
    const res = await fetch(`lang/${lang}.json`);
    translations = await res.json();
    applyTranslations();
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem("kdh_lang", lang);
    updateActiveLangButton(lang);
  } catch (err) {
    console.error("Translation load failed:", err);
  }
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });
  if (translations.meta_title) {
    document.title = translations.meta_title;
  }
  // Update WhatsApp prefill placeholder/message base with translated text
  updateWaPrefillBase();
}

function updateActiveLangButton(lang) {
  document.querySelectorAll("#langSwitch button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function detectInitialLang() {
  const saved = localStorage.getItem("kdh_lang");
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  const browserLang = navigator.language.slice(0, 2).toLowerCase();
  if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;
  return DEFAULT_LANG;
}

// Language switch buttons
document.querySelectorAll("#langSwitch button").forEach((btn) => {
  btn.addEventListener("click", () => {
    loadLang(btn.dataset.lang);
    document.getElementById("navLinks").classList.remove("open");
  });
});

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ============================================
// WhatsApp form — builds a prefilled wa.me link
// ============================================
const WHATSAPP_NUMBER = "2250749567890"; // no + or spaces

function updateWaPrefillBase() {
  // no-op placeholder hook in case future dynamic placeholder text is needed
}

const waForm = document.getElementById("whatsappForm");
waForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("waName").value.trim();
  const projectMsg = document.getElementById("waMessage").value.trim();

  const prefill = translations.contact_whatsapp_prefill || "Bonjour, j'ai vu votre portfolio et je suis intéressé(e) par :";
  const fullMessage = `${prefill} ${projectMsg} — (${name})`;

  const encoded = encodeURIComponent(fullMessage);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  window.open(url, "_blank", "noopener");
});

// Reveal on scroll
function initReveal() {
  const targets = document.querySelectorAll(
    ".service-card, .project-card, .client-tag, .about-grid > div"
  );
  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  targets.forEach((el) => observer.observe(el));
}

// Init
loadLang(detectInitialLang());
initReveal();
