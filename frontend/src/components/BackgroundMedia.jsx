import React from 'react';

/**
 * BackgroundMedia Component
 * Renders serene, light luxury ambient breathing atmosphere without any heavy videos.
 */
export default function BackgroundMedia() {
  return (
    <div className="clean-serene-theme-bg" aria-hidden="true">
      {/* Ambient Breathing Spheres matching medical luxury theme */}
      <div className="ambient-breathing-sphere orb-1" style={{ opacity: 0.55 }}></div>
      <div className="ambient-breathing-sphere orb-2" style={{ opacity: 0.45 }}></div>
    </div>
  );
}
