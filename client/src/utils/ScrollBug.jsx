// App.jsx or _app.jsx (Next.js) or index.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom"; // If using React Router
// OR useNavigate if Next.js

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
