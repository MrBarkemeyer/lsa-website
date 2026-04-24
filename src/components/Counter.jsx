import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function Counter({
  start = 0,
  end = 100,
  duration = 2000,
  color = "#861212",
  children,
  ...rest
}) {
  const [count, setCount] = useState(start);
  const [statState, setStatState] = useState(false);
  const statsRef = useRef(null);

  // when start/end change we reset the count (otherwise it looks stuck)
  useEffect(() => {
    setCount(start);
  }, [start, end]);

  // animate the number when this thing scrolls into view
  useEffect(() => {
    const currentRef = statsRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setStatState(entry.isIntersecting);
      },
      { threshold: 0.3 } // Trigger when at least 30% of the element is visible
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!statState) return; // Only run the counter when visible

    const increment = (end - start) / (duration / 50); // How much to increment each interval
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= end) {
          clearInterval(timer); // Stop the timer
          return end;
        }
        return prev + increment;
      });
    }, 50); // Update every 50 milliseconds

    return () => clearInterval(timer); // Cleanup
  }, [statState, start, end, duration]);

  return (
    <h2 style={{ color: color }} ref={statsRef} {...rest}>
      {statState ? `${Math.floor(count)}` : null}
      {children}
    </h2>
  );
}

Counter.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  duration: PropTypes.number,
  color: PropTypes.string,
  children: PropTypes.node,
};
