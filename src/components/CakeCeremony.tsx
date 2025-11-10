import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

interface CakeCeremonyProps {
  onComplete: () => void;
}

interface Theme {
  cakeBaseGradient: string;
  cakeLayerGradient: string;
  frostingDripColor: string;
  confettiColor: string;
  sliceGradient: string;
}

const themes: Theme[] = [
  {
    cakeBaseGradient: 'bg-gradient-to-b from-pink-300 to-pink-400',
    cakeLayerGradient: 'bg-gradient-to-b from-pink-400 to-pink-500',
    frostingDripColor: 'bg-pink-200',
    confettiColor: '#FBBF24',
    sliceGradient: 'linear-gradient(to bottom, #ffccd5, #ff6f69)',
  },
  {
    cakeBaseGradient: 'bg-gradient-to-b from-blue-300 to-blue-400',
    cakeLayerGradient: 'bg-gradient-to-b from-blue-400 to-blue-500',
    frostingDripColor: 'bg-blue-200',
    confettiColor: '#60A5FA',
    sliceGradient: 'linear-gradient(to bottom, #cce7ff, #60a5fa)',
  },
  {
    cakeBaseGradient: 'bg-gradient-to-b from-green-300 to-green-400',
    cakeLayerGradient: 'bg-gradient-to-b from-green-400 to-green-500',
    frostingDripColor: 'bg-green-200',
    confettiColor: '#34D399',
    sliceGradient: 'linear-gradient(to bottom, #d1fae5, #34d399)',
  }
];

interface StickyNote {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface HeartEffect {
  id: number;
  x: number;
  y: number;
}

export const CakeCeremony: React.FC<CakeCeremonyProps> = ({ onComplete }) => {
  const [isCut, setIsCut] = React.useState(false);
  const [knifePosition, setKnifePosition] = React.useState({ x: 0, y: 0 });
  const [confetti, setConfetti] = React.useState<{ x: number; y: number }[]>([]);
  const [sliceOffset, setSliceOffset] = React.useState(0);
  const [candlesLit, setCandlesLit] = React.useState<boolean[]>(Array(3).fill(false));
  const [isDragging, setIsDragging] = React.useState(false);
  const [startPosition, setStartPosition] = React.useState({ x: 0, y: 0 });
  const lastTimeRef = React.useRef(Date.now());
  const lastPositionRef = React.useRef({ y: 0 });
  const animationFrameRef = React.useRef<number | null>(null);
  const pendingMousePos = React.useRef<{ clientX: number; clientY: number } | null>(null);

  // New state for theme customization, sticky notes, and tap hearts
  const [themeIndex, setThemeIndex] = React.useState(0);
  const [easterEggFound, setEasterEggFound] = React.useState(false);
  const currentTheme = themes[themeIndex];
  // Place sticky notes at fixed positions outside the cake area
  const [stickyNotes] = React.useState<StickyNote[]>([
    { id: 0, text: 'Stay Awesome!', x: 20, y: 20 },
    { id: 1, text: 'You Rock!', x: window.innerWidth - 140, y: window.innerHeight - 140 },
  ]);
  const [hearts, setHearts] = React.useState<HeartEffect[]>([]);

  // Handler to add a heart effect at tap position
  const handleScreenTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid triggering when clicking on interactive elements (if needed)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newHeart: HeartEffect = { id: Date.now(), x, y };
    setHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id));
    }, 1000);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isCut && candlesLit.every((lit) => lit)) {
      setIsDragging(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      setStartPosition({ x: clientX, y: clientY });
      lastTimeRef.current = Date.now();
      lastPositionRef.current = { y: clientY };
    }
  };

  const processMouseMove = (clientX: number, clientY: number) => {
    const deltaX = clientX - startPosition.x;
    const deltaY = clientY - startPosition.y;
    setKnifePosition({ x: deltaX, y: deltaY });
    if (deltaY > 100) {
      setSliceOffset(Math.min(100, deltaY - 100));
    }
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTimeRef.current;
    if (deltaTime > 0) {
      const velocity = (clientY - lastPositionRef.current.y) / deltaTime;
      if (deltaY > 200 && velocity > 0.5) {
        setIsCut(true);
        createConfetti();
        setTimeout(onComplete, 3000);
      }
    }
    lastTimeRef.current = currentTime;
    lastPositionRef.current = { y: clientY };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging && !isCut) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      pendingMousePos.current = { clientX, clientY };
      if (animationFrameRef.current === null) {
        animationFrameRef.current = requestAnimationFrame(() => {
          if (pendingMousePos.current) {
            processMouseMove(pendingMousePos.current.clientX, pendingMousePos.current.clientY);
            pendingMousePos.current = null;
          }
          animationFrameRef.current = null;
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      pendingMousePos.current = null;
    }
  };

  const createConfetti = () => {
    const newConfetti = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setConfetti(newConfetti);
  };

  const lightCandle = (index: number) => {
    if (!candlesLit[index]) {
      const newCandlesLit = [...candlesLit];
      newCandlesLit[index] = true;
      setCandlesLit(newCandlesLit);
    }
  };

  // Cycle through cake themes
  const changeTheme = () => {
    setThemeIndex((prev) => (prev + 1) % themes.length);
  };

  // Easter Egg handler: clicking on the hidden icon reveals a secret message
  const handleEasterEggClick = () => {
    setEasterEggFound(true);
  };

  return (
    <motion.div
      className="w-full h-screen bg-pink-50 flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={handleScreenTap}
      style={{ fontFamily: 'Comic Neue, Comic Sans MS, cursive' }}
    >
      <div className="text-3xl mb-8 text-pink-600 font-semibold text-center">
        {!isCut ? (
          <span>✨ Click the candles to light them, then drag down to cut the cake! ✨</span>
        ) : (
          <span>🎉 Happy Birthday My SUKI ! 🎉</span>
        )}
      </div>

      {/* Theme selector button with hover effect */}
      <motion.button
        className="mb-4 px-4 py-2 bg-yellow-300 text-black rounded-full shadow-lg"
        onClick={changeTheme}
        whileHover={{ scale: 1.1, backgroundColor: '#FDE68A' }}
      >
        Change Cake Theme
      </motion.button>

      {/* Sticky Notes repositioned (top-left and bottom-right) */}
      {stickyNotes.map((note) => (
        <motion.div
          key={note.id}
          className="absolute p-2 bg-yellow-200 rounded shadow-lg text-sm font-bold"
          style={{ top: note.y, left: note.x }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.95, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {note.text}
        </motion.div>
      ))}

      <div 
        className="relative w-80 h-80" 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        style={{ touchAction: 'none' }}
      >
        {/* Cake Base */}
        <motion.div
          className={`absolute bottom-0 w-full h-48 ${currentTheme.cakeBaseGradient} rounded-lg shadow-lg`}
          style={{
            transformOrigin: 'center bottom',
            transform: isCut ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          {/* Cake Layers */}
          <div className="absolute bottom-0 w-full">
            <div className={`h-32 ${currentTheme.cakeLayerGradient} rounded-t-lg`}>
              {/* Frosting drips */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute top-0 w-6 h-8 ${currentTheme.frostingDripColor}`}
                  style={{
                    left: `${i * 14.28}%`,
                    borderRadius: '0 0 12px 12px',
                  }}
                  initial={{ y: -8 }}
                  animate={{ y: [-8, -6, -8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>

          {/* Cake Slice (appears when cutting) using themed gradient */}
          {sliceOffset > 0 && (
            <motion.div
              className="absolute w-full"
              style={{
                height: `${sliceOffset}%`,
                bottom: 0,
                clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
                background: currentTheme.sliceGradient,
                transformOrigin: 'bottom center',
              }}
              animate={isCut ? { y: 20, opacity: 0 } : {}}
            />
          )}

          {/* Enhanced Candles */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-full cursor-pointer"
              style={{
                left: `${30 + i * 20}%`,
                width: '12px',
                height: '40px',
                background: 'linear-gradient(to bottom, #fcd34d 30%, #fbbf24 70%, #d97706 100%)',
                borderRadius: '2px',
                transformOrigin: 'bottom center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              animate={isCut ? { scaleY: 0 } : { rotate: [0, 2, -2, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              onClick={() => lightCandle(i)}
            >
              <div
                className="absolute top-0 left-1/2 w-1 h-3 bg-gray-800"
                style={{ transform: 'translateX(-50%)' }}
              />
              {candlesLit[i] && (
                <>
                  <motion.div
                    className="absolute top-0 left-1/2"
                    style={{
                      width: '14px',
                      height: '24px',
                      transform: 'translate(-50%, -100%)',
                      background: 'radial-gradient(circle at bottom, #fff 0%, #fef08a 40%, #fbbf24 70%, #ea580c 100%)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'blur(0.5px)',
                    }}
                    animate={{ scale: [1, 1.2, 0.9, 1], rotate: [-2, 2, -1, 1, -2] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute top-0 left-1/2"
                    style={{
                      width: '24px',
                      height: '32px',
                      transform: 'translate(-50%, -95%)',
                      background: 'radial-gradient(circle at bottom, rgba(254, 240, 138, 0.4) 0%, rgba(251, 191, 36, 0.2) 40%, rgba(234, 88, 12, 0) 70%)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'blur(1px)',
                    }}
                    animate={{ scale: [1, 1.3, 0.95, 1], rotate: [-1, 1, -2, 2, -1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="absolute top-0 left-1/2"
                    style={{
                      width: '32px',
                      height: '40px',
                      transform: 'translate(-50%, -90%)',
                      background: 'radial-gradient(circle at bottom, rgba(254, 240, 138, 0.15) 0%, rgba(251, 191, 36, 0.1) 30%, rgba(234, 88, 12, 0) 60%)',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                      filter: 'blur(2px)',
                    }}
                    animate={{ scale: [1, 1.2, 0.9, 1], rotate: [1, -1, 2, -2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Hidden Easter Egg Icon */}
        {!easterEggFound && (
          <motion.div
            className="absolute cursor-pointer"
            style={{ bottom: 10, right: 10 }}
            onClick={handleEasterEggClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            whileHover={{ scale: 1.2 }}
          >
            <Heart size={24} className="text-red-500" />
          </motion.div>
        )}

        {easterEggFound && (
          <motion.div
            className="absolute bottom-0 w-full text-center text-lg text-purple-600 font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Wow you saw this! So extra kisses for you.
          </motion.div>
        )}

        {/* Enhanced Knife */}
        {!isCut && candlesLit.every((lit) => lit) && (
          <motion.div
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              width: 40,
              height: 160,
              x: knifePosition.x,
              y: knifePosition.y,
              rotate: Math.min(45, Math.max(-45, knifePosition.x * 0.2)),
            }}
          >
            <div 
              className="w-full h-24"
              style={{
                background: 'linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #d1d5db 100%)',
                borderRadius: '4px 4px 2px 2px',
                boxShadow: '2px 2px 4px rgba(0,0,0,0.1), -1px -1px 2px rgba(255,255,255,0.5)',
              }}
            >
              <div 
                className="absolute bottom-0 w-full h-1"
                style={{
                  background: 'linear-gradient(to right, #9ca3af, #d1d5db, #9ca3af)',
                }}
              />
            </div>
            <div 
              className="w-6 h-48 mx-auto"
              style={{
                background: 'linear-gradient(90deg, #4b5563 0%, #6b7280 50%, #4b5563 100%)',
                borderRadius: '0 0 8px 8px',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.2), inset -2px -2px 4px rgba(255,255,255,0.1)',
              }}
            >
              <div className="w-full h-full flex flex-col justify-around px-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-1 bg-gray-500 rounded-full"
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)' }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Confetti */}
        {isCut && confetti.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ x: pos.x, y: pos.y, scale: 0 }}
            animate={{
              y: [pos.y, pos.y - 200],
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <Sparkles className="text-yellow-500" size={24} />
          </motion.div>
        ))}

        {/* Render tap hearts */}
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute pointer-events-none"
            style={{ left: heart.x, top: heart.y }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Heart size={20} className="text-pink-500" />
          </motion.div>
        ))}
      </div>

      {isCut && (
        <motion.div
          className="mt-8 text-2xl text-pink-600 font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Close your eyes and make a wish!⭐️
        </motion.div>
      )}
    </motion.div>
  );
};

export default CakeCeremony;
