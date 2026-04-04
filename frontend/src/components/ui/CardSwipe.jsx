"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion"; // Changed to framer-motion for standard compatibility
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  Brain02Icon,
  DropletFreeIcons,
  RunningShoesIcon,
  SwimmingIcon,
} from "@hugeicons/core-free-icons";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DEFAULT_CARDS = [
  { id: 1, title: "Reading", description: "Sharpen your mind & escape to new adventures.", icon: (size) => <HugeiconsIcon icon={Book02Icon} size={size} strokeWidth={1.5} /> },
  { id: 2, title: "Drink Water", description: "Stay hydrated & energized.", icon: (size) => <HugeiconsIcon icon={DropletFreeIcons} size={size} strokeWidth={1.5} /> },
  { id: 3, title: "Running", description: "Feel the endorphins!", icon: (size) => <HugeiconsIcon icon={RunningShoesIcon} size={size} strokeWidth={1.5} /> },
  { id: 4, title: "Swimming", description: "Low-impact workout.", icon: (size) => <HugeiconsIcon icon={SwimmingIcon} size={size} strokeWidth={1.5} /> },
  { id: 5, title: "Meditation", description: "Find inner peace.", icon: (size) => <HugeiconsIcon icon={Brain02Icon} size={size} strokeWidth={1.5} /> },
];

const GAP = 16;
const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 500;

const SPRING_OPTIONS = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

function CarouselCard({ item, index, x, itemCount, cardWidth }) {
  const containerWidth = cardWidth + GAP;
  const range = [
    -(index + 1) * containerWidth,
    -index * containerWidth,
    -(index - 1) * containerWidth,
  ];

  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange);

  return (
    <motion.div
      style={{
        width: cardWidth,
        height: cardWidth > 300 ? 420 : 380, // Slightly shorter on mobile
        rotateY,
        flexShrink: 0,
      }}
      transition={SPRING_OPTIONS}
      className="flex flex-col p-6 md:p-8 border border-gray-100 rounded-[2.5rem] shadow-xl bg-white transition-colors dark:bg-zinc-900 dark:border-zinc-800"
    >
      <div className="mb-6 p-4 bg-gray-50 dark:bg-zinc-800 w-fit rounded-2xl">
        {item.icon(cardWidth > 300 ? 52 : 40)}
      </div>

      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 dark:text-white">{item.title}</h2>
      <p className="text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">{item.description}</p>

      <button className="mt-auto w-full md:w-fit px-8 py-3 bg-black dark:bg-white dark:text-black text-white rounded-full font-bold text-sm transition-transform active:scale-95">
        Get Started
      </button>
    </motion.div>
  );
}

export function CardSwipe({ items = DEFAULT_CARDS }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      // 320px on laptop, 90% of screen (with a 320px max) on mobile
      const availableWidth = window.innerWidth - 48;
      setCardWidth(Math.min(320, availableWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  const containerWidth = cardWidth + GAP;

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const leftConstraint = -(containerWidth * (items.length - 1));

  return (
    <div className="flex flex-col items-center w-full overflow-hidden px-4 py-10">
      <div
        className="relative"
        style={{ 
            width: cardWidth, 
            height: cardWidth > 300 ? 420 : 380,
            perspective: "1000px" 
        }}
      >
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{ left: leftConstraint, right: 0 }}
          style={{ gap: GAP, x }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(currentIndex * containerWidth) }}
          transition={SPRING_OPTIONS}
        >
          {items.map((item, index) => (
            <CarouselCard
              key={item.id}
              item={item}
              index={index}
              x={x}
              itemCount={items.length}
              cardWidth={cardWidth}
            />
          ))}
        </motion.div>
      </div>

      {/* Pagination Dots */}
      <div className="mt-8 flex gap-3">
        {items.map((_, i) => (
          <button
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              currentIndex === i ? "w-8 bg-black dark:bg-white" : "w-1.5 bg-gray-300 hover:bg-gray-400"
            )}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default CardSwipe;