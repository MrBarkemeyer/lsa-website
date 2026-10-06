import { Suspense, useRef } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import "./PageTransition.scss";

function RoutedPage({ cacheRef, pathname }) {
  const outlet = useOutlet();

  // Keep the last successfully rendered page for the Suspense fallback
  // so navigations never flash to a blank screen while lazy chunks load.
  cacheRef.current = outlet;

  return (
    <div key={pathname} className="page-transition">
      {outlet}
    </div>
  );
}

/**
 * Animates page enters on pathname changes, while holding the previous
 * page on screen until the next route is ready to render.
 */
export default function PageTransition() {
  const { pathname } = useLocation();
  const cacheRef = useRef(null);

  return (
    <Suspense
      fallback={
        <div className="page-transition page-transition--hold" aria-busy="true">
          {cacheRef.current}
        </div>
      }
    >
      <RoutedPage cacheRef={cacheRef} pathname={pathname} />
    </Suspense>
  );
}
