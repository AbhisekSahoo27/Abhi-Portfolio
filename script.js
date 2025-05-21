document.addEventListener("DOMContentLoaded", () => {
  // Check if GSAP is loaded
  if (typeof gsap === "undefined") {
    console.error("GSAP library not loaded!");
    return;
  }
  if (typeof ScrollTrigger === "undefined") {
    console.error("ScrollTrigger plugin not loaded!");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const myNameElement = document.querySelector(".my-name");
  const mainPhoto = document.querySelector(".main-photo");
  const bg1 = document.querySelector(".bg-1");
  const bg2 = document.querySelector(".bg-2");
  const navButtons = document.querySelectorAll(".nav-button");
  const sections = document.querySelectorAll("section");
  const homeSection = document.getElementById("home");

  let isProgrammaticScroll = false;

  // --- Initial Page Load Animation with GSAP ---
  const tl = gsap.timeline();

  tl.to(myNameElement, {
    opacity: 1,
    duration: 1.5,
    ease: "power4.out",
  }).to(
    mainPhoto,
    {
      scale: 1,
      opacity: 1,
      duration: 1.5,
      ease: "expo.out",
    },
    "-=1"
  ); // Start photo animation 1 second before name animation ends

  // Optional: Mobile specific animation for name
  if (window.matchMedia("(max-width: 768px)").matches) {
    tl.to(
      myNameElement,
      {
        y: -20,
        duration: 2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      },
      "+=0.5"
    );
  }

  // --- Mouse Follow Effect for Name and Backgrounds ---
  const handleMouseMove = (e) => {
    // Get mouse coordinates relative to the center of the viewport
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2; // Normalize to -1 to 1
    const y = (e.clientY / innerHeight - 0.5) * 2; // Normalize to -1 to 1

    // Animate background 1 (moves less, creating depth)
    gsap.to(bg1, {
      x: x * 20, // Adjust sensitivity for bg1
      y: y * 20, // Adjust sensitivity for bg1
      duration: 0.6, // Smooth transition
      ease: "power2.out",
    });

    // Animate background 2 (moves more, closer to viewer)
    gsap.to(bg2, {
      x: x * 40, // Adjust sensitivity for bg2
      y: y * 40, // Adjust sensitivity for bg2
      duration: 0.6, // Smooth transition
      ease: "power2.out",
    });

    // Animate 'my-name' (moves most, closest to viewer)
    gsap.to(myNameElement, {
      x: x * 60, // Adjust sensitivity for name
      y: y * 30, // Adjust sensitivity for name
      duration: 0.4, // Faster transition for name
      ease: "power2.out",
    });

    // Text Glow Effect (Desktop Only)
    if (window.matchMedia("(min-width: 769px)").matches) {
      const nameAbhisek = document.querySelector(".name-abhisek");
      const nameSahoo = document.querySelector(".name-sahoo");
      const center = innerWidth / 2;
      const distance = e.clientX - center;
      const maxDistance = center;
      const ratio = Math.min(Math.abs(distance) / maxDistance, 1);

      if (distance < 0) {
        // Mouse is to the left of center, glow Abhisek
        gsap.to(nameAbhisek, {
          textShadow: `0 0 ${20 * ratio}px rgba(255,255,255,${0.8 * ratio})`,
          opacity: 0.2 + 0.8 * ratio,
          duration: 0.3,
        });
        gsap.to(nameSahoo, {
          textShadow: "none",
          opacity: 0.2,
          duration: 0.3,
        });
      } else {
        // Mouse is to the right of center, glow Sahoo
        gsap.to(nameSahoo, {
          textShadow: `0 0 ${20 * ratio}px rgba(255,255,255,${0.8 * ratio})`,
          opacity: 0.2 + 0.8 * ratio,
          duration: 0.3,
        });
        gsap.to(nameAbhisek, {
          textShadow: "none",
          opacity: 0.2,
          duration: 0.3,
        });
      }
    }
  };

  // Attach mousemove listener to the home section
  // This limits the parallax effect to the first section
  if (homeSection) {
    homeSection.addEventListener("mousemove", handleMouseMove);
  } else {
    // Fallback if homeSection is not found, attach to window
    window.addEventListener("mousemove", handleMouseMove);
  }

  // --- ScrollTrigger for Section Navigation ---

  // Function to activate navigation button
  const setActiveNavButton = (sectionId) => {
    navButtons.forEach((button) => {
      if (button.dataset.section === sectionId) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  };

  // Handle navigation clicks
  navButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      isProgrammaticScroll = true; // Set flag to true
      const sectionId = e.currentTarget.dataset.section;
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      // Timeout to reset flag after scroll is likely complete
      setTimeout(() => {
        isProgrammaticScroll = false;
      }, 1000); // Adjust time based on your scroll speed
    });
  });

  // Create ScrollTriggers for each section
  ScrollTrigger.create({
    trigger: homeSection,
    start: "top top",
    end: "bottom top",
    onEnter: () => {
      if (!isProgrammaticScroll) setActiveNavButton("home");
    },
    onLeaveBack: () => {
      if (!isProgrammaticScroll) setActiveNavButton("home");
    },
  });

  sections.forEach((section) => {
    if (section.id === "home") return; // Skip home as it's handled separately

    ScrollTrigger.create({
      trigger: section,
      start: "top center", // When the top of the section hits the center of the viewport
      end: "bottom center", // When the bottom of the section leaves the center of the viewport
      onToggle: (self) => {
        if (self.isActive && !isProgrammaticScroll) {
          setActiveNavButton(section.id);
        }
      },
    });
  });

  // --- Project Card Hover Effect ---
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    const mouseLight = card.querySelector(".mouse-light-blob");

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseLight.style.left = `${x}px`;
      mouseLight.style.top = `${y}px`;
      mouseLight.style.opacity = "0.7"; // Ensure it's visible on move
    });

    card.addEventListener("mouseleave", () => {
      mouseLight.style.opacity = "0";
      // Optionally reset position for a cleaner exit
      mouseLight.style.left = "-100%";
      mouseLight.style.top = "-100%";
    });
  });
});
