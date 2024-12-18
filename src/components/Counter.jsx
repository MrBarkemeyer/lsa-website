import { useState, useEffect, useRef } from "react";

export default function Counter({ start = 0, end = 100, duration = 2000 }) {
  const [count, setCount] = useState(start);
  const [statState, setStatState] = useState(false);
  const statsRef = useRef(null);

  //A number counter Component
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setStatState(entry.isIntersecting);
      },
      { threshold: 0.3 } // Trigger when at least 30% of the element is visible
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current); // Cleanup
    };
  }, []);

  useEffect(() => {
    if (!statState) return; // Only run the counter when visible

    const increment = (end - start) / (duration / 50); // How much to increment each interval
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= end) {
          clearInterval(timer); // Stop the timer
          return end; // Ensure it stops exactly at end
        }
        return prev + increment;
      });
    }, 50); // Update every 50 milliseconds

    return () => clearInterval(timer); // Cleanup
  }, [statState, start, end, duration]);

  return <h2 ref={statsRef}>{statState ? `${Math.floor(count)}+` : null}</h2>;
}