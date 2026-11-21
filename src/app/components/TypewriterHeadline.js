"use client";

import { useEffect, useState } from "react";

const phrase = "Make your next\ndigital move matter.";
const highlightLength = "digital move".length;

export default function TypewriterHeadline() {
  // Render the complete heading on the server for accessibility and SEO,
  // then animate it in once the page hydrates.
  const [visibleCount, setVisibleCount] = useState(phrase.length);

  useEffect(() => {
    let timer;
    let position = 0;
    setVisibleCount(0);

    const type = () => {
      if (position < phrase.length) {
        position += 1;
        setVisibleCount(position);
        timer = window.setTimeout(type, 62);
      } else {
        timer = window.setTimeout(() => {
          position = 0;
          setVisibleCount(0);
          timer = window.setTimeout(type, 420);
        }, 2200);
      }
    };

    timer = window.setTimeout(type, 320);
    return () => window.clearTimeout(timer);
  }, []);

  const visible = phrase.slice(0, visibleCount);
  const [firstLine = "", secondLine = ""] = visible.split("\n");

  return (
    <h1 aria-label="Make your next digital move matter.">
      {firstLine}
      <br />
      <span>{secondLine.slice(0, highlightLength)}</span>
      {secondLine.slice(highlightLength)}
      <span className="typewriter-caret" aria-hidden="true" />
    </h1>
  );
}
