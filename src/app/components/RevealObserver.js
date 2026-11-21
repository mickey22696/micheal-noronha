"use client";

import { useEffect } from "react";

export default function RevealObserver() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".service-card, .service-list article, .steps article, .about-panel, .contact-panel"
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => {
      element.classList.add("reveal");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
