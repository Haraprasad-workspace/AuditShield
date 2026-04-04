'use client';
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion'; // Changed from motion/react for standard compatibility
import { HugeiconsIcon } from '@hugeicons/react';
import { useTheme } from 'next-themes';
import {
  Book02Icon,
  Brain02Icon,
  DropletFreeIcons,
  RunningShoesIcon,
  SwimmingIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

const DEFAULT_CARDS = [
  { id: 1, title: 'Reading', description: 'Sharpen your mind & escape to new adventures.', icon: (theme, size) => <HugeiconsIcon icon={Book02Icon} size={size} color={theme === 'light' ? '#000000' : '#ffffff'} strokeWidth={1.5} /> },
  { id: 2, title: 'Drink Water', description: 'Stay hydrated & energized. Your body will thank you!', icon: (theme, size) => <HugeiconsIcon icon={DropletFreeIcons} size={size} color={theme === 'light' ? '#000000' : '#ffffff'} strokeWidth={1.5} /> },
  { id: 3, title: 'Running', description: 'Feel the endorphins! Get a quick energy boost.', icon: (theme, size) => <HugeiconsIcon icon={RunningShoesIcon} size={size} color={theme === 'light' ? '#000000' : '#ffffff'} strokeWidth={1.5} /> },
  { id: 4, title: 'Swimming', description: 'Low-impact workout. Refreshing & invigorating.', icon: (theme, size) => <HugeiconsIcon icon={SwimmingIcon} size={size} color={theme === 'light' ? '#000000' : '#ffffff'} strokeWidth={1.5} /> },
  { id: 5, title: 'Meditation', description: 'Find inner peace. Just 5 minutes can de-stress.', icon: (theme, size) => <HugeiconsIcon icon={Brain02Icon} size={size} color={theme === 'light' ? '#000000' : '#ffffff'} strokeWidth={1.5} /> },
];

const GAP = 16;
const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 500;

const SPRING_OPTIONS = {
  type: 'spring',
  stiffness: 330,
  damping: 30,
};

const CarouselCard = ({ item, index, x, itemCount, currentTheme, cardWidth }) => {
  const containerWidth = cardWidth + GAP;
  
  const range = [
    (-(index + 1) * containerWidth),
    (-index * containerWidth),
    (-(index - 1) * containerWidth),
  ];
  
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  return (
    <motion.div
      style={{
        width: cardWidth,
        height: '100%',
        rotateY,
        flexShrink: 0,
      }}
      transition={SPRING_OPTIONS}
      className="flex cursor-grab flex-col items-start rounded-[32px] md:rounded-[40px] border-[1.6px] border-[#ECECEC] bg-[#FEFEFE] p-6 md:p-10 transition-colors active:cursor-grabbing dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-6 flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-[16px] md:rounded-[24px] border-[1.6px] border-[#ECECEC] bg-[#FEFEFE] shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-colors dark:border-zinc-800 dark:bg-zinc-900">
        {item.icon(currentTheme, typeof window !== 'undefined' && window.innerWidth < 768 ? 32 : 52)}
      </div>
      <h2 className="mb-2 text-xl font-bold text-[#010101] md:text-[32px] dark:text-zinc-100">
        {item.title}
      </h2>
      <p className="mb-5 text-sm md:text-[22px] text-[#77767B] dark:text-zinc-400 leading-tight md:leading-normal">
        {item.description}
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-auto rounded-full bg-[#262626] px-5 py-2 text-xs text-[#F2F2F2] shadow-sm md:px-7 md:py-3 md:text-base dark:bg-zinc-100 dark:text-zinc-900"
      >
        Get Started
      </motion.button>
    </motion.div>
  );
};

export const CardSwipe = ({ items = DEFAULT_CARDS }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [cardWidth, setCardWidth] = useState(320);
  const { resolvedTheme } = useTheme();
  const x = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      // 320px on Laptop, responsive on mobile (max 90vw or 320px)
      const width = Math.min(320, window.innerWidth - 48);
      setCardWidth(width);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
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
    <div className="flex w-full flex-col items-center justify-center overflow-hidden px-4">
      <div
        className="relative"
        style={{ 
          width: cardWidth, 
          height: typeof window !== 'undefined' && window.innerWidth < 768 ? 340 : 420 
        }}>
        <motion.div
          className="flex h-full"
          drag="x"
          dragConstraints={{ left: leftConstraint, right: 0 }}
          style={{
            gap: GAP,
            perspective: 1000,
            perspectiveOrigin: currentIndex * containerWidth + cardWidth / 2,
            x,
          }}
          onDragEnd={handleDragEnd}
          animate={{ x: -(currentIndex * containerWidth) }}
          transition={SPRING_OPTIONS}>
          {items.map((item, index) => (
            <CarouselCard
              key={item.id}
              item={item}
              index={index}
              x={x}
              cardWidth={cardWidth}
              itemCount={items.length}
              currentTheme={currentTheme} />
          ))}
        </motion.div>
      </div>
      
      {/* Pagination Dots */}
      <div className="mt-8 flex gap-2 sm:mt-10">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to card ${i + 1}`}
            className={cn(
              'h-1.5 w-1.5 md:h-2 md:w-2 cursor-pointer rounded-full bg-zinc-200 transition-all duration-300',
              currentIndex === i ? 'w-4 md:w-6 bg-zinc-500 dark:bg-zinc-400' : 'hover:bg-zinc-300'
            )}
            onClick={() => setCurrentIndex(i)} />
        ))}
      </div>
    </div>
  );
};

export default CardSwipe;