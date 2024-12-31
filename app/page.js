"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion"; // Import framer-motion

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isFinalSeconds, setIsFinalSeconds] = useState(false);
  const [isCountdownFinished, setIsCountdownFinished] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); // State untuk mengontrol overlay
  // const targetDate = new Date("2024-12-31T17:03:00"); // Target Date: 31 Desember 2024
  const targetDate = new Date("2025-01-01T00:00:00"); // Target Date: 1 Jan 2025

  const getTimeLeft = () => {
    const now = Date.now();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const timeRemaining = getTimeLeft();
      setTimeLeft(timeRemaining);

      // Check if we're in the final seconds for styling purposes
      if (timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds <= 10) {
        setIsFinalSeconds(true);
        setShowOverlay(true); // Show overlay when time is <= 10 seconds
      } else {
        setIsFinalSeconds(false);
        setShowOverlay(false); // Hide overlay when time is more than 10 seconds
      }

      // Trigger fireworks when the countdown hits zero
      if (timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
        clearInterval(interval);
        triggerFireworks();
        setIsCountdownFinished(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const duration = 15 * 1000; // Duration for fireworks animation
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 21,
  };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const triggerFireworks = () => {
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 20 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <div
      className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: 'url(/images/newyear-background.png)', // Ganti dengan path gambar Anda
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      {/* Logo Header Kiri dan Kanan dengan Posisi Absolute */}
      <div className="flex left-0 top-0 flex justify-between w-full px-12 py-12 sm:px-20 z-20">
        <motion.div
          className="dark"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/images/logo-header-kiri.png"
            alt="Serenata logo kiri"
            width={300}
            height={0}
            priority
            layout="intrinsic"
          />
        </motion.div>

        <motion.div
          className="dark"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/images/logo-header-kanan.png"
            alt="Serenata logo kanan"
            width={250}
            height={0}
            priority
            layout="intrinsic"
          />
        </motion.div>
      </div>

      <main className="flex flex-col gap-4 row-start-2 items-center sm:items-center">
      {!showOverlay && (
      <Image
          aria-hidden
          src="/images/logo-title.png"
          alt="footer image"
          width={300}
          height={0}
          priority
          layout="intrinsic"
        />
      )}

        {/* Countdown Display */}
        {!showOverlay && (
          <motion.div
            className="text-center text-white text-4xl sm:text-5xl flex gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="countdown-box">
              <span>{timeLeft.days}</span>
              <div className="label">Days</div>
            </div>
            <div className="countdown-box">
              <span>{timeLeft.hours}</span>
              <div className="label">Hours</div>
            </div>
            <div className="countdown-box">
              <span>{timeLeft.minutes}</span>
              <div className="label">Minutes</div>
            </div>
            <div className="countdown-box">
              <span>{timeLeft.seconds}</span>
              <div className="label">Seconds</div>
            </div>
          </motion.div>
        )}

        {timeLeft.days == 0 && timeLeft.hours == 0 && timeLeft.minutes == 0 && timeLeft.seconds == 0 && (
          <motion.div
            className="dark z-20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
              <div className="nyetext">
              <span>Happy New Year!</span>
            </div>
          </motion.div>
        )}

      </main>

      {/* Overlay */}
      {showOverlay && (
        <div className="overlay fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
          {/* Menyembunyikan angka 0 jika fireworks muncul */}
          {timeLeft.seconds !== 0 ? (
            <motion.div
              key={timeLeft.seconds} // Menambahkan key untuk memicu animasi ulang saat detik berubah
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }} // Menambahkan animasi keluar untuk transisi
              transition={{ duration: 0.5 }}
              className="countdown-10 text-white text-6xl"
            >
              {timeLeft.seconds}
            </motion.div>
          ) : null}
        </div>
      )}

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <div
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 z-20"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/images/logo-footer.png"
            alt="footer image"
            width={300}
            height={0}
            priority
            layout="intrinsic"
          />
        </div>
      </footer>
    </div>
  );
};

export default Countdown;