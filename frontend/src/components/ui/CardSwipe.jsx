import React, { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  Brain02Icon,
  DropletFreeIcons,
  RunningShoesIcon,
  SwimmingIcon,
} from "@hugeicons/core-free-icons";

// simple cn replacement
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DEFAULT_CARDS = [
  {
    id: 1,
    title: "Reading",
    description: "Sharpen your mind & escape to new adventures.",
    icon: () => (
      <HugeiconsIcon icon={Book02Icon} size={52} strokeWidth={1.5} />
    ),
  },
  {
    id: 2,
    title: "Drink Water",
    description: "Stay hydrated & energized.",
    icon: () => (
      <HugeiconsIcon icon={DropletFreeIcons} size={52} strokeWidth={1.5} />
    ),
  },
  {
    id: 3,
    title: "Running",
    description: "Feel the endorphins!",
    icon: () => (
      <HugeiconsIcon icon={RunningShoesIcon} size={52} strokeWidth={1.5} />
    ),
  },
  {
    id: 4,
    title: "Swimming",
    description: "Low-impact workout.",
    icon: () => (
      <HugeiconsIcon icon={SwimmingIcon} size={52} strokeWidth={1.5} />
    ),
  },
  {
    id: 5,
    title: "Meditation",
    description: "Find inner peace.",
    icon: () => (
      <HugeiconsIcon icon={Brain02Icon} size={52} strokeWidth={1.5} />
    ),
  },
];

const ITEM_WIDTH = 320;
const GAP = 16;
const CONTAINER_WIDTH = ITEM_WIDTH + GAP;
const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 500;

const SPRING_OPTIONS = {
  type: "spring",
  stiffness: 330,
  damping: 30,
};

function CarouselCard({ item, index, x, itemCount }) {
  const nextIndex = Math.min(index + 1, itemCount - 1);
  const prevIndex = Math.max(index - 1, 0);

  const range = [
    -(index + 1) * CONTAINER_WIDTH,
    -index * CONTAINER_WIDTH,
    -(index - 1) * CONTAINER_WIDTH,
  ];

  const outputRange = [90, 0, -90];

  const rotateY = useTransform(x, range, outputRange);

  return (
    <motion.div
      style={{
        width: ITEM_WIDTH,
        height: 420,
        rotateY,
        flexShrink: 0,
      }}
      transition={SPRING_OPTIONS}
      className="flex flex-col p-6 border rounded-2xl shadow bg-white"
    >
      <div className="mb-4">{item.icon()}</div>

      <h2 className="text-xl font-bold">{item.title}</h2>
      <p className="text-gray-500">{item.description}</p>

      <button className="mt-4 px-4 py-2 bg-black text-white rounded-full">
        Get Started
      </button>
    </motion.div>
  );
}

export function CardSwipe({ items = DEFAULT_CARDS }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const x = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const leftConstraint = -((ITEM_WIDTH + GAP) * (items.length - 1));

  return (
    <div className="flex flex-col items-center">
      <div
        className="overflow-hidden"
        style={{ width: ITEM_WIDTH, height: 420 }}
      >
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{ left: leftConstraint, right: 0 }}
          style={{
            gap: GAP,
            x,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(currentIndex * CONTAINER_WIDTH) }}
          transition={SPRING_OPTIONS}
        >
          {items.map((item, index) => (
            <CarouselCard
              key={item.id}
              item={item}
              index={index}
              x={x}
              itemCount={items.length}
            />
          ))}
        </motion.div>
      </div>

      <div className="mt-4 flex gap-2">
        {items.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-2 rounded-full bg-gray-300 cursor-pointer",
              currentIndex === i && "bg-black"
            )}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default CardSwipe;