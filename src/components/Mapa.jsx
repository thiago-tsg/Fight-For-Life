import { useEffect, useRef, useState } from "react";

const Mapa = () => {
  const ref = useRef(null);
  const [mostrarMapa, setMostrarMapa] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMostrarMapa(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "300px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="cg-mapa"
      style={{ minHeight: "500px" }}
    >
      {mostrarMapa && (
        <iframe
          src="https://www.google.com/maps/embed?pb=!4v1763492853172!6m8!1m7!1sBHr9iXxsybv5OLAGJPndtg!2m2!1d-23.51703523873262!2d-46.51618812175126!3f215.29421746319335!4f3.9289814036784634!5f0.7820865974627469"
          width="100%"
          height="500"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          title="Mapa Academia"
        />
      )}
    </section>
  );
};

export default Mapa;