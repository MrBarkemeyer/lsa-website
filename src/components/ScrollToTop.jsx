import { useEffect } from "react";
import { useLocation } from "react-router-dom";


//Scroll to top whenever Route changes
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

export default ScrollToTop;