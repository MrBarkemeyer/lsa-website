import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top of the page every time the route changes
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

export default ScrollToTop;