import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function BackgroundMedia() {
  const videoRef = useRef(null);
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/login';
  const isAssessmentPage = location.pathname === '/assessment';

  useEffect(() => {
    if (isAssessmentPage) return; // No video on assessment page

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
  }, [location.pathname, isAssessmentPage]);

  // Dedicated Serene Static Image Background for Health Assessment
  if (isAssessmentPage) {
    return (
      <div className="assessment-bg-image-container" aria-hidden="true">
        <img
          src="/assets/images/assessment-sunrise-mountains.png"
          alt="Meditation at Sunrise in the Misty Mountains"
          className="assessment-bg-image"
        />
        <div className="assessment-bg-image-overlay"></div>
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <div className="auth-bg-video-container" aria-hidden="true">
        <video
          ref={videoRef}
          key="auth-bg-video"
          id="auth-bg-video-stream"
          className="auth-bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/assets/videos/102377-659979931_medium.mp4" type="video/mp4" />
          <source src="/assets/videos/wellness-bg.mp4" type="video/mp4" />
          <source src="/290916_medium.mp4" type="video/mp4" />
        </video>
        <div className="auth-bg-video-overlay"></div>
      </div>
    );
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
          <source src="/assets/videos/wellness-bg.mp4" type="video/mp4" />
          <source src="/290916_medium.mp4" type="video/mp4" />
        </video>
        <div className="site-bg-video-overlay"></div>
      </div>
    </>
  );
}
