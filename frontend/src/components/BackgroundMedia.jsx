import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function BackgroundMedia() {
  const videoRef = useRef(null);
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/login';
  const isAssessmentPage = location.pathname === '/assessment';
  const isContactPage = location.pathname === '/contact';

  useEffect(() => {
    if (isAssessmentPage || isAuthPage || isContactPage) return; // No video on assessment, auth, or contact pages

    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const applySlowMotion = () => {
      video.playbackRate = 0.65;
    };

    applySlowMotion();
    video.addEventListener('loadedmetadata', applySlowMotion);
    video.addEventListener('play', applySlowMotion);
    video.addEventListener('playing', applySlowMotion);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const retryPlay = () => {
          applySlowMotion();
          video.play().catch(() => {});
          window.removeEventListener('click', retryPlay);
          window.removeEventListener('scroll', retryPlay);
          window.removeEventListener('touchstart', retryPlay);
        };
        window.addEventListener('click', retryPlay, { once: true });
        window.addEventListener('scroll', retryPlay, { once: true });
        window.addEventListener('touchstart', retryPlay, { once: true });
      });
    }

    return () => {
      video.removeEventListener('loadedmetadata', applySlowMotion);
      video.removeEventListener('play', applySlowMotion);
      video.removeEventListener('playing', applySlowMotion);
    };
  }, [location.pathname, isAssessmentPage, isAuthPage, isContactPage]);

  // Dedicated Serene Static Image Background for Health Assessment
  if (isAssessmentPage) {
    return (
      <div className="assessment-bg-image-container" aria-hidden="true">
        <img
          src="/assets/images/assessment-reshmi-meditation.jpg"
          alt="Reshmi Verma Meditating in White Marble Sanctuary"
          className="assessment-bg-image"
        />
        <div className="assessment-bg-image-overlay"></div>
      </div>
    );
  }

  // Clean simple backgrounds for Sign In & Contact Us (No video)
  if (isAuthPage || isContactPage) {
    return null;
  }

  return (
    <>
      {/* Ambient Breathing Spheres */}
      <div className="ambient-breathing-sphere orb-1" aria-hidden="true"></div>
      <div className="ambient-breathing-sphere orb-2" aria-hidden="true"></div>

      {/* Fixed Ambient Background Video */}
      <div className="site-bg-video-container" aria-hidden="true">
        <video
          ref={videoRef}
          key="site-bg-video"
          id="bg-video-stream"
          className="site-bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/assets/videos/reshmi-bg-video.mp4" type="video/mp4" />
          <source src="/assets/videos/wellness-bg.mp4" type="video/mp4" />
        </video>
        <div className="site-bg-video-overlay"></div>
      </div>
    </>
  );
}
