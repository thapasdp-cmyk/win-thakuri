import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import BurstS from './soundfx/burst.mp3';

interface Balloon {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  sway: number; // Swaying motion for realism
  type: 'normal' | 'star' | 'smiley';
}

interface PopEffect {
  id: string;
  x: number;
  y: number;
}

interface RoomProps {
  onComplete: () => void;
}

const REWARD_THRESHOLD = 6;

export const Room: React.FC<RoomProps> = ({ onComplete }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [popEffects, setPopEffects] = useState<PopEffect[]>([]);
  const [score, setScore] = useState(0);
  const audioContext = useRef<AudioContext | null>(null);

  // Initialize AudioContext for burst sound
  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  // Generate new balloons periodically, with random type variation
  useEffect(() => {
    const balloonInterval = setInterval(() => {
      const types: Balloon['type'][] = ['normal', 'star', 'smiley'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const newBalloon: Balloon = {
        id: `balloon-${Date.now()}`,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 100, // Start below the screen
        size: Math.random() * 40 + 60,
        color: `hsl(${Math.random() * 360}, 100%, 75%)`,
        rotation: Math.random() * 360,
        sway: Math.random() * 20 - 10,
        type: randomType,
      };
      setBalloons(prev => [...prev, newBalloon]);
    }, 1000);
    return () => clearInterval(balloonInterval);
  }, []);

  // Animate balloons flying upward and updating position
  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons(prev =>
        prev
          .map(balloon => ({
            ...balloon,
            y: balloon.y - 2, // Move upward
            x: balloon.x + Math.sin(balloon.sway) * 0.5,
            sway: balloon.sway + 0.05,
          }))
          .filter(balloon => balloon.y > -100)
      );
    }, 16); // ~60 FPS
    return () => clearInterval(interval);
  }, []);

  const playBurstSound = () => {
    if (!audioContext.current) return;
    const burstSound = new Audio(BurstS);
    burstSound.play();
  };

  const handleBalloonClick = (id: string, x: number, y: number) => {
    playBurstSound();
    // Add a pop effect at the balloon's position
    const popId = `pop-${Date.now()}`;
    setPopEffects(prev => [...prev, { id: popId, x, y }]);
    setTimeout(() => {
      setPopEffects(prev => prev.filter(pop => pop.id !== popId));
    }, 600);
    // Remove the balloon and increase score
    setBalloons(prev => prev.filter(balloon => balloon.id !== id));
    setScore(prev => prev + 1);
  };

  return (
    <motion.div
      className="w-full h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        // Fixed, soft gradient background without dynamic elements
        background: "linear-gradient(135deg, #FFF7E6, #FFE4E1)",
        fontFamily: "Comic Neue, Comic Sans MS, cursive",
      }}
    >
      {/* Heading & Score */}
      <div className="absolute top-4 left-4 z-20">
        <h1 className="text-3xl font-bold text-red-500 drop-shadow-lg">Let's see how many balloons you can pop!</h1>
        <p className="text-xl text-purple-600">Your Score: {score}</p>
      </div>

      {/* Reward Message */}
      {score >= REWARD_THRESHOLD && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 p-6 rounded-2xl shadow-2xl border-4 border-dashed border-yellow-400 z-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2 className="text-4xl font-bold text-yellow-600 text-center">
            Bonus Reward Unlocked!
          </h2>
          <p className="mt-4 text-lg text-gray-800 text-center">
            Fried Momos For You Yeyey!
          </p>
        </motion.div>
      )}

      {/* Balloons */}
      {balloons.map((balloon) => (
        <motion.div
          key={balloon.id}
          className="absolute cursor-pointer"
          style={{
            left: balloon.x,
            top: balloon.y,
            width: balloon.size,
            height: balloon.size * 1.2,
            transform: `rotate(${balloon.rotation}deg)`,
            backgroundColor: balloon.color,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            border: "2px solid white",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => handleBalloonClick(balloon.id, balloon.x, balloon.y)}
        >
          {/* Balloon string */}
          <div
            style={{
              position: "absolute",
              bottom: "-50%",
              left: "50%",
              width: "2px",
              height: "50%",
              backgroundColor: "#666",
              transform: "translateX(-50%)",
            }}
          />
          {/* Additional doodle overlays based on type */}
          {balloon.type === "star" && (
            <div
              className="absolute w-6 h-6"
              style={{
                top: "10%",
                right: "10%",
                backgroundImage:
                  "url('https://em-content.zobj.net/thumbs/120/apple/354/star_2b50.png')",
                backgroundSize: "cover",
              }}
            />
          )}
          {balloon.type === "smiley" && (
            <div
              className="absolute w-6 h-6"
              style={{
                bottom: "10%",
                left: "10%",
                backgroundImage:
                  "url('https://em-content.zobj.net/thumbs/120/apple/354/smiling-face-with-sunglasses_1f60e.png')",
                backgroundSize: "cover",
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Pop Effects */}
      {popEffects.map((pop) => (
        <motion.div
          key={pop.id}
          className="absolute pointer-events-none"
          style={{ left: pop.x, top: pop.y }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-2xl font-bold text-red-500 drop-shadow-xl">POP!</span>
        </motion.div>
      ))}

      {/* Continue Button */}
      {score >= REWARD_THRESHOLD && (
        <motion.button
          className="fixed bottom-8 right-8 bg-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-red-600 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
        >
          <Sparkles className="w-5 h-5" />
          Continue to Cake Ceremony →
        </motion.button>
      )}
    </motion.div>
  );
};

export default Room;
