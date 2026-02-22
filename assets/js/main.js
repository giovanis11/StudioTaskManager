console.log("Yo mama's so fat, she stepped on a scale and it said, 'To be continued'");

$(function () {

  const header = `
<!-- HEADER -->
  <header class="stm-navbar fixed-top border-bottom" style="background:rgba(255,255,255,0.85);">
    <div class="container-xl px-3 px-md-4">
      <div class="d-flex align-items-center justify-content-between" style="height:70px;">

        <a href="/index.html" class="fw-bold text-dark text-decoration-none fs-6">STM</a>

        <!-- Desktop Menu -->
        <nav class="d-none d-lg-flex gap-4">
          <a href="/index.html"     class="text-secondary text-decoration-none small fw-medium">Home</a>
          <a href="/tasks.html"     class="text-secondary text-decoration-none small fw-medium">Tasks</a>
          <a href="/about.html"     class="text-secondary text-decoration-none small fw-medium">About</a>
          <a href="/analytics.html" class="text-secondary text-decoration-none small fw-medium">Analytics</a>
          <a href="/contact.html"   class="text-secondary text-decoration-none small fw-medium">Contact</a>
        </nav>

        <!-- Mobile menu -->
        <button class="navbar-toggler d-lg-none border-0" type="button" 
                data-bs-toggle="collapse" data-bs-target="#mobileMenu"
                aria-controls="mobileMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon navbar navbar-light"></span>
        </button>

        <!-- Button -->
        <div class="d-none d-lg-block">
          <a href="./contact.html" class="btn btn-outline-dark rounded-pill px-4 py-2 small fw-medium">
            Let's Connect
          </a>
        </div>

      </div>

      <!-- Mobile Dropdown Menu -->
      <div class="collapse d-lg-none" id="mobileMenu">
        <nav class="d-flex flex-column gap-2 pb-3">
          <a href="/index.html"     class="text-secondary text-decoration-none small fw-medium py-1">Home</a>
          <a href="/tasks.html"     class="text-secondary text-decoration-none small fw-medium py-1">Tasks</a>
          <a href="/about.html"     class="text-secondary text-decoration-none small fw-medium py-1">About</a>
          <a href="/analytics.html" class="text-secondary text-decoration-none small fw-medium py-1">Analytics</a>
          <a href="/contact.html"   class="text-secondary text-decoration-none small fw-medium py-1">Contact</a>
          <a href="./contact.html"  class="btn btn-outline-dark rounded-pill px-4 py-2 small fw-medium mt-2 w-100">
            Let's Connect
          </a>
        </nav>
      </div>
    </div>
  </header>
  `;

  $("#header-placeholder").html(header);

});

$(function () {

  const footer = `
  <footer class="bg-black text-white py-5 mt-5">

    <div class="container-fluid px-5">

      <div class="mb-4">
        <h2 class="fw-bold display-1">
          LET’S BUILD SOMETHING <br>
          GREAT. TOGETHER.
        </h2>
      </div>

      <div class="d-flex flex-wrap gap-3 mb-4">

        <a href="mailto:your@email.com" class="btn btn-outline-light px-4">
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
          class="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
          style="width:45px;height:45px;">
          <i class="bi bi-github"></i>
        </a>

        <a href="https://www.linkedin.com/in/nikos-giovanis-141916253"
          target="_blank"
          class="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
          style="width:45px;height:45px;">
          <i class="bi bi-linkedin"></i>
        </a>

        <a href="https://www.instagram.com/nikos.giovaniss"
          target="_blank"
          class="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
          style="width:45px;height:45px;">
          <i class="bi bi-instagram"></i>
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



$(document).ready(function () {

    function fetchWeather() {

        const latitude = 37.98;
        const longitude = 23.72;

        const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

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

                    $("#weatherContent").html(`
                        <div class="mb-3">
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
        $("#weatherError").removeClass("d-none");
    }

    fetchWeather();
});


/* contact script for  */
$(function () {

  $('.needs-validation').on('submit', function (event) {

    if (!this.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      $(this).addClass('was-validated');
      return;
    }

    event.preventDefault();

    // Get values
    const name = $('#fullName').val();
    const email = $('#email').val();
    const message = $('#message').val();

    // Inject into modal
    $('#modalName').text(name);
    $('#modalEmail').text(email);
    $('#modalMessage').text(message);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();

    // Reset form
    this.reset();
    $(this).removeClass('was-validated');

  });

});

