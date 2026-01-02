document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     NAVBAR SCROLL EFFECT
  ========================== */
  const nav = document.querySelector(".ghost");

  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    });
  }

  /* =========================
     MOBILE MENU TOGGLE
  ========================== */
 

  /* =========================
     TRACKING FORM
  ========================== */
  const form = document.getElementById("trackingForm");
  const resultDiv = document.getElementById("trackingResult");

  if (form && resultDiv) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const trackingInput = document.getElementById("trackingId");
      const trackingId = trackingInput ? trackingInput.value.trim() : "";

      if (!trackingId) {
        resultDiv.innerHTML =
          `<div class="bg-red-100 text-red-700 p-4 rounded-md">
            Please enter a tracking ID
          </div>`;
        return;
      }

      resultDiv.innerHTML = `<p class="text-gray-600">Tracking package...</p>`;

      try {
        const response = await fetch("https://cargoship.onrender.com/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackingId }),
        });

        const data = await response.json();

        if (!response.ok) {
          resultDiv.innerHTML =
            `<div class="bg-red-100 text-red-700 p-4 rounded-md">
              ${data.message || "Tracking not found"}
            </div>`;
          return;
        }

        /* =========================
           PROGRESS LOGIC
        ========================== */
        let percentage = 50;
        let statusColor = "bg-blue-500";

        if (data.progressStage === "picked_up") percentage = 25;
        else if (data.progressStage === "in_transit") percentage = 60;
        else if (data.progressStage === "out_for_delivery") percentage = 85;
        else if (data.progressStage === "delivered") {
          percentage = 100;
          statusColor = "bg-green-500";
        }

        resultDiv.innerHTML = `
          <div class="bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl transition-all duration-700">

            <!-- Progress bar -->
            <div class="relative w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
              <div id="progressBar"
                   class="${statusColor} h-4 rounded-full transition-all duration-[2000ms]"
                   style="width: 0%;">
              </div>
            </div>
            <p class="text-sm text-gray-600 text-right mb-4">${percentage}% complete</p>

            <h2 class="text-lg font-bold text-gray-800 mb-3">Shipment Details</h2>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Current Location:</strong> ${data.location}</p>
            <p><strong>ETA:</strong> ${data.eta}</p>

            <hr class="my-4">

            <h3 class="font-semibold mb-2">Sender</h3>
            <p>${data.senderName}</p>
            <p>${data.senderEmail}</p>
            <p>${data.senderPhone}</p>
            <p>${data.senderAddress}</p>

            <hr class="my-4">

            <h3 class="font-semibold mb-2">Receiver</h3>
            <p>${data.receiverName}</p>
            <p>${data.receiverEmail}</p>
            <p>${data.receiverPhone}</p>
            <p>${data.receiverAddress}</p>

            <hr class="my-4">

            <h3 class="font-semibold mb-2">Package</h3>
            <p>${data.packageDescription}</p>
            <p>${data.packageWeight} kg</p>

            <hr class="my-6">

            <!-- Timeline -->
            <div class="flex justify-between text-sm text-gray-600">
              ${["picked_up","in_transit","out_for_delivery","delivered"].map(stage => `
                <div class="flex flex-col items-center">
                  <div class="w-4 h-4 rounded-full mb-1 ${
                    ["picked_up","in_transit","out_for_delivery","delivered"]
                      .indexOf(data.progressStage) >=
                    ["picked_up","in_transit","out_for_delivery","delivered"]
                      .indexOf(stage)
                    ? "bg-green-500"
                    : "bg-gray-300"
                  }"></div>
                  ${stage.replaceAll("_"," ")}
                </div>
              `).join("")}
            </div>
          </div>
        `;

        setTimeout(() => {
          const bar = document.getElementById("progressBar");
          if (bar) bar.style.width = percentage + "%";
        }, 300);

      } catch (err) {
        resultDiv.innerHTML =
          `<div class="bg-red-100 text-red-700 p-4 rounded-md">
            Error connecting to server
          </div>`;
      }
    });
  }

  /* =========================
     MOBILE CARD SLIDER
  ========================== */
  const cards = document.querySelectorAll(".card");
  const next = document.getElementById("next");
  const prev = document.getElementById("prev");

  let index = 0;

  function updateSlider() {
    if (window.innerWidth >= 1024) return;

    cards.forEach((card, i) => {
     card.style.transform = `translateX(-${index * 100}%)`;
      card.style.transition = "transform 0.4s ease";
    });
  }

  if (cards.length && next && prev) {
    next.addEventListener("click", () => {
      index = (index + 1) % cards.length;
      updateSlider();
    });

    prev.addEventListener("click", () => {
      index = (index - 1 + cards.length) % cards.length;
      updateSlider();
    });

    window.addEventListener("resize", updateSlider);
    updateSlider();
  }

});
 const counters = document.querySelectorAll('.counter');

  const animateCounter = (el) => {
    const start = Number(el.dataset.start);
    const end = Number(el.dataset.end);
    const suffix = el.dataset.suffix || '';
    const duration = 800;

    let startTime = null;

    const update = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      el.textContent = value + suffix;

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target); // run once
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach(counter => observer.observe(counter));

  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  let isOpen = false;

  menuBtn.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) {
      mobileMenu.classList.remove("-translate-y-full", "opacity-0");
      mobileMenu.classList.add("translate-y-0", "opacity-100");
    } else {
      mobileMenu.classList.add("-translate-y-full", "opacity-0");
      mobileMenu.classList.remove("translate-y-0", "opacity-100");
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-testimonials");
  const grid = document.querySelector(".grid");

  // Initially hide the grid (or show it – change based on preference)
  // grid.classList.add("hidden");

  toggleBtn.addEventListener("click", () => {
    grid.classList.toggle("hidden");
    if (grid.classList.contains("hidden")) {
      toggleBtn.textContent = "Show Testimonials";
    } else {
      toggleBtn.textContent = "Hide Testimonials";
    }
  });
});