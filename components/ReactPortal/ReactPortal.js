import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ReactPortal = ({ children }) => {
  const ref = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.getElementById("react-portal");
    setMounted(true);
  }, []);

  console.log(ref.current, document.getElementById("react-portal"), mounted, children);
  return mounted ? createPortal(children, ref.current) : null;
};

export default ReactPortal