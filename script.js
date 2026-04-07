(() => {
  "use strict";

  const FLASHLIGHT_RADIUS = 180; // px — radius of the revealed circle
  const EDGE_FEATHER = 80; // px — soft edge around the circle

  // --- State ---
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let lightsOn = false;
  let rafId = null;

  // --- DOM ---
  const overlay = document.getElementById("flashlight-overlay");
  const toggle = document.getElementById("light-switch");

  // --- Smooth lerp animation loop ---
  const LERP_FACTOR = 0.15; // lower = smoother / laggier, higher = snappier

  function animate() {
    currentX += (mouseX - currentX) * LERP_FACTOR;
    currentY += (mouseY - currentY) * LERP_FACTOR;

    overlay.style.setProperty("--mx", `${currentX}px`);
    overlay.style.setProperty("--my", `${currentY}px`);

    rafId = requestAnimationFrame(animate);
  }

  // --- Mouse tracking (passive for perf) ---
  document.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true }
  );

  // Touch support for mobile
  document.addEventListener(
    "touchmove",
    (e) => {
      const touch = e.touches[0];
      mouseX = touch.clientX;
      mouseY = touch.clientY;
    },
    { passive: true }
  );

  // --- Light switch toggle ---
  function setLights(on) {
    lightsOn = on;
    overlay.classList.toggle("lights-on", on);
    toggle.classList.toggle("active", on);
    toggle.setAttribute("aria-pressed", on);
    toggle.title = on ? "Turn off lights" : "Turn on lights";

    if (on) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else {
      // Reset position so there's no jump
      currentX = mouseX;
      currentY = mouseY;
      overlay.style.setProperty("--mx", `${currentX}px`);
      overlay.style.setProperty("--my", `${currentY}px`);
      rafId = requestAnimationFrame(animate);
    }
  }

  toggle.addEventListener("click", () => setLights(!lightsOn));

  // Keyboard shortcut: press "L" to toggle
  document.addEventListener("keydown", (e) => {
    if (e.key === "l" || e.key === "L") {
      // Don't fire if user is typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      setLights(!lightsOn);
    }
  });

  // --- Set CSS custom properties for radius ---
  overlay.style.setProperty("--fr", `${FLASHLIGHT_RADIUS}px`);
  overlay.style.setProperty("--ff", `${FLASHLIGHT_RADIUS + EDGE_FEATHER}px`);

  // --- Kick off ---
  overlay.style.setProperty("--mx", `${currentX}px`);
  overlay.style.setProperty("--my", `${currentY}px`);
  rafId = requestAnimationFrame(animate);
})();
