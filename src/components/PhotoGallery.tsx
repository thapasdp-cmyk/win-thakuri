import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Pic1 from "./img/pic1.jpg";
import Pic2 from "./img/pic2.jpg";
import Pic3 from "./img/pic3.jpg";
import Pic4 from "./img/extra1.jpg"; // Extra small photo
import Pic5 from "./img/extra2.jpg"; // Extra small photo

// Import local playlist music files
import songA from "./music/music1.mp3";
import songB from "./music/music2.mp3";
import songC from "./music/music3.mp3";

interface Photo {
  url: string;
  caption: string;
}

const photos: Photo[] = [
  {
    url: Pic1,
    caption: "Happy Birthday, My Light - In blak you shine so Bright!",
  },
  {
    url: Pic2,
    caption: "In White you shine, Soft and Divine !",
  },
  {
    url: Pic3,
    caption: "You Run so Light, My heart takes Flight ! "
  },
];

// Extra photos for a sticky note gallery
const extraPhotos: Photo[] = [
  { url: Pic4, caption: "Extra Memory 1" },
  { url: Pic5, caption: "Extra Memory 2" },
];

// Playlist song names and corresponding local music files
const playlist = ["Abhi Kuch Dino Se", "Co2", "Kaalpanik"];
const songFiles = [songA, songB, songC];

interface PhotoGalleryProps {
  onComplete: () => void;
  stopBgMusic: () => void;
}

// TimelineComponent based on your timeline example
const TimelineComponent: React.FC<{ onProceed: () => void }> = ({ onProceed }) => {
  const timelineEvents = [
    { icon: "🌟", title: "Starting From Here", desc: "I texted first.. never knowing that one msg would mean so much."},
    { icon: "💌", title: "We talked", desc: "From Morning to late Night talks, Ur story filled my days n Your words became my fav part." },
    { icon: "🎵", title: "U Opened Up", desc: "You trusted me with ur past, ur laughs, n that means more than words." } ,
    { icon: "✨", title: "A Day Just For Her", desc: "Miles apart, yet close at heart, Ours story's a beautiful start."}
  ];

  return (
    <div className="min-h-screen px-4 sm:px-8 md:px-10 py-10 bg-white animate-fade-in"
         style={{ fontFamily: "Comic Neue, Comic Sans MS, cursive" }}>
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#FF6F6F]">
        📖 Our Story
      </h2>
      <div
        className="relative w-full max-w-4xl mx-auto p-8 rounded-2xl shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #FFB4B4, #FF6F6F)' }}
      >
        {/* Central timeline line */}
        <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-white opacity-75"></div>
        {timelineEvents.map((event, index) => (
          <div
            key={index}
            className={`relative mb-12 sm:w-1/2 ${index % 2 === 0 ? 'sm:ml-auto sm:pl-8' : 'sm:mr-auto sm:pr-8'}`}
            style={{ animationDelay: `${index * 300}ms` }}
          >
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <span className="text-3xl animate-bounce">{event.icon}</span>
                <div>
                  <h3 className="font-semibold text-xl text-[#FF6F6F]">{event.title}</h3>
                  <p className="text-base text-[#FFB4B4]">{event.desc}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <button
          onClick={onProceed}
          className="px-8 py-4 bg-white text-black rounded-full hover:bg-[#FFB4B4] hover:text-white transition-transform duration-300 transform hover:scale-105 shadow-lg font-semibold"
        >
          Continueee! 🎵
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onComplete, stopBgMusic }) => {
  const [showTimeline, setShowTimeline] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false); // For polaroid flip
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Change main photo every 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
      setIsFlipped(false); // reset flip when photo changes
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Cleanup any playing audio when the component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSongClick = (index: number) => {
    // Stop any currently playing playlist music
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Ensure the background music is stopped
    stopBgMusic(); 
    setCurrentSongIndex(index);
    // Create a new Audio instance and play the selected song
    const newAudio = new Audio(songFiles[index]);
    audioRef.current = newAudio;
    newAudio.play().catch((error) =>
      console.log("Playlist audio playback failed:", error)
    );
  };

  // Current displayed photo
  const currentPhoto = photos[currentIndex];

  return (
    <>
      {showTimeline ? (
        <TimelineComponent onProceed={() => setShowTimeline(false)} />
      ) : (
        <motion.div
          className="min-h-screen p-8 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontFamily: "Comic Neue, Comic Sans MS, cursive" }}
        >
          {/* Animated Gradient Background */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "linear-gradient(135deg, #FF7E5F, #FEB47B)", zIndex: -3 }}
          />

          {/* Floating Pink Circle */}
          <motion.div
            className="absolute w-40 h-40 rounded-full bg-pink-500"
            initial={{ x: -150, y: -150, scale: 0.8, opacity: 0.7 }}
            animate={{ x: [-150, 20, -150], y: [-150, 50, -150] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{ zIndex: -2 }}
          />

          {/* Floating Purple Circle */}
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-purple-500"
            initial={{ x: 300, y: 250, scale: 0.8, opacity: 0.7 }}
            animate={{ x: [300, 100, 300], y: [250, 80, 250] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            style={{ zIndex: -2 }}
          />

          {/* Header */}
          <h2 className="text-5xl text-center font-extrabold mb-12 bg-clip-text bg-white text-transparent bg drop-shadow-2xl">
            Your Memories!
          </h2>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Main Photo Polaroid with Flip */}
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex} // Re-trigger animation on index change
                  className="absolute w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8, x: -100 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 100 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{ perspective: 1000 }} // For 3D flip
                >
                  {/* Polaroid container with flip animation */}
                  <motion.div
                    className="relative w-[500px] h-[500px]"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{
                      transformStyle: "preserve-3d",
                      cursor: "pointer",
                    }}
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    {/* Polaroid Front */}
                    <motion.div
                      className="absolute inset-0 bg-white shadow-2xl rounded-sm p-2 pb-6 flex flex-col polaroid transform rotate-1"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      {/* Hand-drawn overlays on the front */}
                      <div className="absolute top-2 left-2 w-8 h-8 bg-no-repeat bg-contain"
                        style={{
                          backgroundImage: "url('https://raw.githubusercontent.com/gist/remarkablemark/2e8c2c04923c077e8c85fbe88336e18f/raw/27335df5fe9b4f2232a3c35071c27d4bb9fce4ad/star-doodle.png')",
                        }}
                      />
                      <div className="absolute bottom-2 right-2 w-10 h-10 bg-no-repeat bg-contain"
                        style={{
                          backgroundImage: "url('https://raw.githubusercontent.com/gist/remarkablemark/c8c2862b993e704f4198142498fc49c2/raw/a16551cbd98f52b5963047d0a6d223ec4df8f860/scribble-doodle.png')",
                        }}
                      />
                      <div className="flex-1 overflow-hidden rounded-sm">
                        <img
                          src={currentPhoto.url}
                          alt={`Memory ${currentIndex + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="mt-2 text-center text-gray-700 text-xs font-semibold mb-8">
                        {currentPhoto.caption}
                      </div>
                    </motion.div>

                    {/* Polaroid Back */}
                    <motion.div
                      className="absolute inset-0 bg-white shadow-2xl rounded-sm p-4 flex flex-col items-center justify-center"
                      style={{
                        rotateY: "180deg",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <h4 className="text-lg font-bold text-pink-600 mb-3">
                        A Special Note
                      </h4>
                      <p className="text-gray-700 text-sm text-center px-2">
                        Your talks, Your laugh, Your care , Your chaos.
                         Don't ever lose the magic that makes you, YOU..!
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        (Click again to flip back)
                      </p>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column - Playlist and Completion Button */}
            <div cl 
            ssName="flex flex-col justify-center space-y-10">
              {/* Playlist Section */}
              <div className="backdrop-blur-lg bg-white/40 rounded-2xl p-8 shadow-2xl border-2 border-orange-300">
                <h3 className="text-3xl font-bold text-orange-800 mb-6 flex items-center">
                  <span className="mr-3">🎶</span> Our Playlist
                </h3>
                <div className="space-y-4">
                  {playlist.map((song, i) => (
                    <motion.div
                      key={i}
                      onClick={() => handleSongClick(i)}
                      className={`flex items-center p-4 rounded-xl transition-all cursor-pointer ${
                        currentSongIndex === i
                          ? "bg-white/60 border-2 border-pink-400"
                          : "hover:bg-white/60"
                      }`}
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-lg font-bold mr-4 drop-shadow-lg">
                        {i + 1}
                      </div>
                      <span className="text-gray-800 text-xl font-semibold">
                        {song}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Completion Button with layered glow */}
              <div className="relative mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-3xl opacity-40"></div>
                <motion.button
                  className="relative px-10 py-5 bg-gradient-to-r from-orange-700 to-red-700 rounded-full text-2xl font-bold text-white shadow-2xl transform hover:-translate-y-1 hover:shadow-3xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onComplete}
                >
                  I wrote something for you, My Suki ❤️
                </motion.button>
              </div>
            </div>
          </div>

          {/* Extra Photo Sticky Note */}
          <div className="absolute top-8 right-8 bg-yellow-200 p-4 rounded-lg shadow-2xl transform rotate-2">
            <h4 className="text-lg font-bold text-gray-800 mb-2">More Memories</h4>
            <div className="flex space-x-2">
              {extraPhotos.map((photo, idx) => (
                <motion.div
                  key={idx}
                  className="w-16 h-16 rounded-lg overflow-hidden shadow-md border-2 border-white"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default PhotoGallery;
