$(function () {

const header = `

<header class="stm-navbar fixed-top border-bottom bg-body" role="banner">
  <div class="container-xl px-3 px-md-4">

    <div class="bg-body d-flex align-items-center justify-content-between" style="height:70px;">

      <!-- LEFT -->
      <a href="/index.html" class="fw-bold text-body text-decoration-none fs-6" aria-label="Studio Task Manager home">
        STM
      </a>

      <!-- CENTER (Desktop Nav) -->
      <nav class="d-none d-lg-flex gap-4" aria-label="Primary">
        <a href="/index.html" class="text-body-secondary small fw-medium text-decoration-none">Home</a>
        <a href="/tasks.html" class="text-body-secondary small fw-medium text-decoration-none">Tasks</a>
        <a href="/about.html" class="text-body-secondary small fw-medium text-decoration-none">About</a>
        <a href="/analytics.html" class="text-body-secondary small fw-medium text-decoration-none">Analytics</a>
        <a href="/services.html" class="text-body-secondary small fw-medium text-decoration-none">Services</a>
        <a href="/contact.html" class="text-body-secondary small fw-medium text-decoration-none">Contact</a>
        <a href="/submissions.html" class="text-body-secondary small fw-medium text-decoration-none">Submissions</a>
      </nav>

      <!-- RIGHT SIDE -->
      <div class="d-flex align-items-center gap-2">

        <!-- DARK MODE TOGGLE -->
        <button id="themeToggle" class="btn btn-outline-secondary btn-sm rounded-pill" type="button" aria-label="Switch to dark theme" aria-pressed="false">
          <i class="bi bi-moon" aria-hidden="true"></i>
        </button>

        <!-- Desktop CTA -->
        <a href="./contact.html"
          class="btn btn-outline-secondary rounded-pill px-4 py-2 small fw-medium d-none d-lg-inline-block">
          Let's Connect
        </a>

        <!-- Mobile menu button -->
        <button class="btn d-lg-none p-0 border-0 text-body"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mobileMenu"
          aria-controls="mobileMenu"
          aria-expanded="false"
          aria-label="Toggle navigation">

          <i class="bi bi-list fs-2" aria-hidden="true"></i>

        </button>


      </div>

    </div>

    <!-- Mobile menu -->
    <div class="collapse d-lg-none bg-body border-top shadow-sm" id="mobileMenu">
      <nav class="d-flex flex-column gap-2 pb-3 decoration-none" aria-label="Mobile">
        <a href="/index.html" class="text-body-secondary small fw-medium py-1 text-decoration-none">Home</a>
        <a href="/tasks.html" class="text-body-secondary small fw-medium py-1 text-decoration-none">Tasks</a>
        <a href="/about.html" class="text-body-secondary small fw-medium py-1 text-decoration-none">About</a>
        <a href="/analytics.html" class="text-body-secondary small fw-medium py-1 text-decoration-none">Analytics</a>
        <a href="/services.html" class="text-body-secondary small fw-medium py-1 text-decoration-none">Services</a>
        <a href="/contact.html" class="text-body-secondary small fw-medium py-1 text-decoration-none">Contact</a>
        <a href="/submissions.html" class="text-body-secondary small fw-medium py-1 text-decoration-none">Submissions</a>
      </nav>
    </div>

  </div>
</header>
`;


  $("#header-placeholder").html(header);
  syncCurrentNavLinks();
  setThemeToggleState(loadTheme());

});

$(function () {

  const footer = `
  <footer class="bg-black text-white py-5 mt-5" role="contentinfo">

    <div class="container-fluid px-5">

      <div class="mb-4">
        <h2 class="fw-bold display-1">
          LET’S BUILD SOMETHING <br>
          GREAT. TOGETHER.
        </h2>
      </div>

      <div class="d-flex flex-wrap gap-3 mb-4">

        <a href="/contact.html" class="btn btn-outline-light px-4">
          Get in touch
        </a>

        <a href="/tasks.html" class="btn btn-outline-light px-4">
          View Tasks
        </a>

        <a href="/about.html" class="btn btn-outline-light px-4">
          About Us
        </a>

        <a href="https://github.com/giovanis11"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profile (opens in a new tab)"
          class="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
          style="width:45px;height:45px;">
          <i class="bi bi-github" aria-hidden="true"></i>
        </a>

        <a href="https://www.linkedin.com/in/nikos-giovanis-141916253"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile (opens in a new tab)"
          class="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
          style="width:45px;height:45px;">
          <i class="bi bi-linkedin" aria-hidden="true"></i>
        </a>

        <a href="https://www.instagram.com/nikos.giovaniss"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram profile (opens in a new tab)"
          class="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
          style="width:45px;height:45px;">
          <i class="bi bi-instagram" aria-hidden="true"></i>
        </a>

      </div>

      <div class="d-flex flex-column flex-md-row justify-content-between border-top pt-3 small">
        <span>© 2026 Nikolaos Giovanis-ITC4214</span>
        <span>Built with <b>Love</b></span>
      </div>

    </div>

  </footer>
  `;

  $("#footer-placeholder").html(footer);

});


  /* Api */
$(document).ready(function () {

    function fetchWeather() {

        const latitude = 37.98;
        const longitude = 23.72;
        const weatherCard = $("#weatherCard");

        const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        weatherCard.attr("aria-busy", "true");

        $.ajax({
            url: apiURL,
            method: "GET",

            success: function (data) {

                if (data && data.current_weather) {

                    const temp = data.current_weather.temperature;
                    const wind = data.current_weather.windspeed;
                    const time = data.current_weather.time;

                    $("#weatherLoader").addClass("d-none");
                    $("#weatherContent").removeClass("d-none");
                    weatherCard.attr("aria-busy", "false");

                    $("#weatherContent").html(`
                        <div class="mb-3" role="status" aria-live="polite">
                            <h3 class="display-5 fw-bold text-white">${temp}°C</h3>
                            <p class="text-white-50 mb-1">Athens, Greece</p>
                            <small class="text-white-50">Updated: ${time}</small>
                        </div>

                        <div class="d-flex justify-content-center gap-5 mt-4">
                            <div>
                                <p class="text-white-50 small mb-1">Wind</p>
                                <h6 class="fw-semibold">${wind} km/h</h6>
                            </div>
                        </div>
                    `);

                } else {
                    showError();
                }
            },

            error: function () {
                showError();
            }
        });
    }

    function showError() {
        $("#weatherLoader").addClass("d-none");
        $("#weatherError").removeClass("d-none").attr("role", "alert");
        $("#weatherCard").attr("aria-busy", "false");
    }

    fetchWeather();
});


/* contact script for  */
$(function () {
  const modalNamePreviewLimit = 60;
  const modalMessagePreviewLimit = 180;
  let fullModalName = "";
  let shortModalName = "";
  let fullModalMessage = "";
  let shortModalMessage = "";

  function setModalName(expanded) {
    const nameEl = document.querySelector("#modalName");
    const toggleEl = document.querySelector("#modalNameToggle");
    if (!nameEl || !toggleEl) return;

    nameEl.classList.toggle("expanded", expanded);
    nameEl.textContent = expanded ? fullModalName : shortModalName;
    toggleEl.textContent = expanded ? "Show less" : "Read more";
    toggleEl.setAttribute("aria-expanded", String(expanded));
  }

  function setModalMessage(expanded) {
    const messageEl = document.querySelector("#modalMessage");
    const toggleEl = document.querySelector("#modalMessageToggle");
    if (!messageEl || !toggleEl) return;

    messageEl.classList.toggle("expanded", expanded);
    messageEl.textContent = expanded ? fullModalMessage : shortModalMessage;
    toggleEl.textContent = expanded ? "Show less" : "Read more";
    toggleEl.setAttribute("aria-expanded", String(expanded));
  }

  $("#modalNameToggle").on("click", function () {
    const isExpanded = $(this).attr("aria-expanded") === "true";
    setModalName(!isExpanded);
  });

  $("#modalMessageToggle").on("click", function () {
    const isExpanded = $(this).attr("aria-expanded") === "true";
    setModalMessage(!isExpanded);
  });

  $('.needs-validation').on('submit', function (event) {

    if (!this.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      $(this).addClass('was-validated');
      return;
    }

    event.preventDefault();

    // Get values
    const name = $('#fullName').val().trim();
    const email = $('#email').val().trim();
    const message = $('#message').val().trim();

    // Save submission in localStorage
    const contactStorageKey = "stm_contact_submissions_v1";
    const submissions = JSON.parse(localStorage.getItem(contactStorageKey) || "[]");

    submissions.push({
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    });

    localStorage.setItem(contactStorageKey, JSON.stringify(submissions));

    // Inject into modal
    const nameToggle = $("#modalNameToggle");
    const nameNeedsReadMore = name.length > modalNamePreviewLimit;
    fullModalName = name;
    shortModalName = nameNeedsReadMore
      ? `${name.slice(0, modalNamePreviewLimit)}...`
      : name;

    if (nameNeedsReadMore) {
      nameToggle.removeClass("d-none");
      setModalName(false);
    } else {
      nameToggle.addClass("d-none");
      $("#modalName").removeClass("expanded").text(name);
    }

    $('#modalEmail').text(email);

    const messageToggle = $("#modalMessageToggle");
    const needsReadMore = message.length > modalMessagePreviewLimit;
    fullModalMessage = message;
    shortModalMessage = needsReadMore
      ? `${message.slice(0, modalMessagePreviewLimit)}...`
      : message;

    if (needsReadMore) {
      messageToggle.removeClass("d-none");
      setModalMessage(false);
    } else {
      messageToggle.addClass("d-none");
      $("#modalMessage").removeClass("expanded").text(message);
    }

    // Show modal
    const modal = new bootstrap.Modal(document.querySelector('#successModal'));
    modal.show();

    // Reset form
    this.reset();
    $(this).removeClass('was-validated');

  });

});


//dark mode toggle

const THEME_KEY = "stm_theme";

function applyTheme(theme) {

  // switch
  document.documentElement.setAttribute("data-bs-theme", theme);
  setThemeToggleState(theme);

}

function loadTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

// apply saved theme on load
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(loadTheme());
});

// toggle 
$(document).on("click", "#themeToggle", function () {

  const current = document.documentElement.getAttribute("data-bs-theme");

  const newTheme = current === "dark" ? "light" : "dark";

  applyTheme(newTheme);
  saveTheme(newTheme);

});

function setThemeToggleState(theme) {
  const toggle = document.querySelector("#themeToggle");
  if (!toggle) return;

  const isDark = theme === "dark";
  toggle.setAttribute("aria-pressed", String(isDark));
  toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");

  const icon = toggle.querySelector("i");
  if (!icon) return;

  icon.className = isDark ? "bi bi-sun" : "bi bi-moon";
  icon.setAttribute("aria-hidden", "true");
}

function syncCurrentNavLinks() {
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/index.html";
  const normalizedCurrentPath = currentPath === "/" ? "/index.html" : currentPath;
  const links = document.querySelectorAll("header nav a[href]");

  links.forEach(link => {
    const href = (link.getAttribute("href") || "").replace(/\/+$/, "") || "/index.html";
    const normalizedHref = href === "/" ? "/index.html" : href;
    const isCurrent =
      normalizedCurrentPath === normalizedHref ||
      normalizedCurrentPath.endsWith(normalizedHref);

    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}


//latest 

function loadTasksForActivity() {

  const STORAGE_KEY = "stm_tasks_v3";
  const raw = localStorage.getItem(STORAGE_KEY);

  return raw ? JSON.parse(raw) : [];

}

function renderLatestActivity() {

  const tasks = loadTasksForActivity();

  const addedContainer = document.querySelector("#latestAdded");
  const completedContainer = document.querySelector("#latestCompleted");

  if (!addedContainer || !completedContainer) return;

  addedContainer.innerHTML = "";
  completedContainer.innerHTML = "";

  if (tasks.length === 0) {

    addedContainer.innerHTML = `
      <p class="text-body-secondary small mb-0">No tasks yet.</p>
    `;

    completedContainer.innerHTML = `
      <p class="text-body-secondary small mb-0">No completed tasks yet.</p>
    `;

    return;
  }

  const latestAdded = [...tasks].reverse().slice(0, 5);

  latestAdded.forEach(task => {

    addedContainer.innerHTML += `
      <div class="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3" role="listitem">

        <div class="flex-grow-1 me-3">

          <div class="fw-medium text-break">
            ${task.title}
          </div>

          <div class="text-body-secondary small">
            Added task
          </div>

        </div>

        <span class="badge bg-primary-subtle text-primary border border-primary-subtle flex-shrink-0">
          NEW
        </span>

      </div>
    `;

  });


  //Latest Completed 

  const latestCompleted = tasks
    .filter(t => t.status === "completed")
    .reverse()
    .slice(0, 5);

  if (latestCompleted.length === 0) {

    completedContainer.innerHTML = `
      <p class="text-body-secondary small mb-0">
        No completed tasks yet.
      </p>
    `;

  } else {

    latestCompleted.forEach(task => {

      completedContainer.innerHTML += `
        <div class="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3" role="listitem">

          <div class="flex-grow-1 me-3">

            <div class="fw-medium text-break">
              ${task.title}
            </div>

            <div class="text-success small">
              Completed
            </div>

          </div>

          <span class="badge bg-success-subtle text-success border border-success-subtle flex-shrink-0">
            ✓
          </span>

        </div>
      `;

    });

  }

}

document.addEventListener("DOMContentLoaded", renderLatestActivity);
