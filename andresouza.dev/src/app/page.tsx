"use client";

import logos from "./database/logos.json";
import { Instagram, Linkedin, Github, ArrowDown } from "lucide-react";
import Image from "next/image";
import { motion, useMotionValue, animate } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

// Lista de componentes das suas seções
const SECTIONS = ["header", "about", "projects"];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  // pageIndex rastreia qual seção estamos
  const [pageIndex, setPageIndex] = useState(0);
  // Usa useMotionValue para rastrear a posição Y do contêiner (a "janela" de scroll)
  const scrollY = useMotionValue(0);

  // Calcula a altura da tela (altura de cada "página")
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 0;

  // Função para animar a transição para uma nova página
  const scrollToPage = useCallback(
    (newIndex: number) => {
      // Garante que o índice esteja dentro dos limites
      const safeIndex = Math.max(0, Math.min(newIndex, SECTIONS.length - 1));
      setPageIndex(safeIndex);

      // Calcula o deslocamento Y para a página desejada
      const targetY = safeIndex * screenHeight;

      // Anima a MotionValue scrollY para a nova posição
      animate(scrollY, -targetY, {
        type: "spring",
        stiffness: 100,
        damping: 20,
        // Quanto mais longo, mais suave
        velocity: 5,
      });
    },
    [screenHeight, scrollY]
  );

  // Efeito para lidar com eventos de scroll (roda do mouse)
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Impede o scroll nativo (caso não tenha sido desabilitado no CSS)
      event.preventDefault();

      // Define a tolerância para evitar transições múltiplas com um único giro da roda
      const SCROLL_TOLERANCE = 10;

      // Só avança ou volta se o delta for significativo e não estiver em transição
      if (Math.abs(event.deltaY) > SCROLL_TOLERANCE) {
        const direction = event.deltaY > 0 ? 1 : -1; // 1 = descer, -1 = subir

        // Evita transições múltiplas
        const isScrolling = scrollY.get() % screenHeight !== 0;

        if (!isScrolling) {
          scrollToPage(pageIndex + direction);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [pageIndex, scrollToPage, scrollY, screenHeight]);

  return (
    // O container principal, que terá sua posição Y animada (deslocando as seções)
    // Aplicando overflow-hidden para garantir que o scroll nativo não apareça.
    <main
      ref={containerRef}
      className="flex flex-col gap-10 h-screen overflow-hidden"
    >
      {/* O motion.div é o elemento que se move para cima/baixo */}
      <motion.div style={{ y: scrollY }} className="flex flex-col gap-10">
        {/* SEÇÃO 1: Header */}
        <motion.header
          // Não precisa de animação de entrada, pois será sempre a primeira tela
          className="flex flex-col gap-2 items-center justify-center h-screen"
        >
          {/* ... Conteúdo do Header ... */}
          <div className="flex flex-col gap-4 items-center">
            <Image
              alt="André Souza"
              src="/assets/images/eu.jpg"
              width={180}
              height={180}
              objectFit="cover"
              className="rounded-full border-4 border-foreground"
            />
            <div className="text-center">
              <h1 className="font-extrabold text-5xl">André Souza</h1>
              <h3 className="font-bold text-2xl">Programador</h3>
            </div>
          </div>

          <footer className="flex items-center gap-2">
            <Instagram width={30} height={70} />
            <Linkedin width={30} height={70} />
            <Github width={30} height={30} />
          </footer>
          {/* Botão de navegação (Opcional) */}
          <motion.div
            onClick={() => scrollToPage(pageIndex + 1)}
            className="cursor-pointer mt-4"
          >
            <ArrowDown width={30} height={30} className="animate-bounce" />
          </motion.div>
        </motion.header>

        {/* SEÇÃO 2: Sobre Mim */}
        <section className="flex flex-col h-screen p-20 gap-4">
          <h3 className="font-bold text-4xl mb-6"> Sobre Mim</h3>
          {/* ... restante do conteúdo ... */}
          <p className="font-medium text-xl">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum
            atque alias praesentium iure voluptas aut ipsa id, modi aliquam
            facilis? Dolore rerum iste, non nesciunt enim voluptatum dolores
            minima at.
          </p>
          {/* ... logos e outros textos ... */}
          <div className="grid grid-cols-10 gap-5">
            {logos.map((logo) => (
              <Image
                className="p-2 bg-white/60 rounded-lg"
                src={logo.source}
                width={60}
                height={60}
                alt={logo.name}
                key={logo.name}
              />
            ))}
          </div>
        </section>

        {/* SEÇÃO 3: Meus Projetos */}
        <section className="flex flex-col h-screen p-20 gap-4">
          <h3 className="font-bold text-4xl mb-6"> Meus Projetos</h3>
        </section>
      </motion.div>
    </main>
  );
}
