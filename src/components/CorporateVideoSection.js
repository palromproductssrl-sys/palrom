'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function CorporateVideoSection({ lang = 'nl' }) {
  const [videoLang, setVideoLang] = useState(lang || 'nl');
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(56);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const progressRef = useRef(null);
  const hideControlsTimerRef = useRef(null);

  useEffect(() => {
    if (lang && ['nl', 'en', 'de', 'ro'].includes(lang)) {
      setVideoLang(lang);
    }
  }, [lang]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const resetControlsTimer = () => {
    setControlsVisible(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    hideControlsTimerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setControlsVisible(false);
      }
    }, 2500);
  };

  const togglePlayPause = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsVideoPlaying(true);
      resetControlsTimer();
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
      setControlsVisible(true);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    if (!progressRef.current || !videoRef.current || !videoDuration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = pct * videoDuration;
    videoRef.current.currentTime = targetTime;
    setVideoCurrentTime(targetTime);
    resetControlsTimer();
  };

  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (!document.fullscreenElement) {
      if (wrapper.requestFullscreen) wrapper.requestFullscreen();
      else if (wrapper.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      setIsFullscreen(false);
    }
    resetControlsTimer();
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleVideoSound = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsVideoMuted(nextMuted);
    if (!nextMuted && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    }
  };

  const copy = {
    nl: {
      badge: 'FSC® 100% Beukenhout • Brad, Roemenië',
      title: 'Ontdek Onze Zagerij & Productie in 1 Minuut',
      sub: 'Bekijk onze officiële bedrijfsvideo: van verantwoorde beukenoogst en geavanceerd zagen tot natuurlijke luchtdroging en maatwerk meubelcomponenten.',
      soundOn: 'Geluid Aan',
      soundOff: 'Geluid & Muziek',
      studio: 'Video Studio (Scènes & Teksten Aanpassen) →',
      pause: 'Pauzeren',
      play: 'Afspelen',
      fullscreen: 'Volledig scherm'
    },
    en: {
      badge: 'FSC® 100% Beechwood • Brad, Romania',
      title: 'Discover Our Sawmill & Manufacturing in 1 Minute',
      sub: 'Watch our official corporate video: from sustainable beech harvesting and precision sawing to natural air drying and custom furniture components.',
      soundOn: 'Sound On',
      soundOff: 'Sound & Music',
      studio: 'Video Studio (Customize Scenes & Copy) →',
      pause: 'Pause',
      play: 'Play',
      fullscreen: 'Fullscreen'
    },
    de: {
      badge: 'FSC® 100% Buchenholz • Brad, Rumänien',
      title: 'Erleben Sie Unser Sägewerk & Fertigung in 1 Minute',
      sub: 'Sehen Sie unser offizielles Unternehmensvideo: von nachhaltigem Bucheneinschlag und Präzisionszuschnitt bis hin zu Freilufttrocknung und B2B-Möbelkomponenten.',
      soundOn: 'Ton An',
      soundOff: 'Ton & Musik',
      studio: 'Video Studio (Szenen & Texte anpassen) →',
      pause: 'Pausieren',
      play: 'Abspielen',
      fullscreen: 'Vollbild'
    },
    ro: {
      badge: 'Lemn de Fag Certificat FSC® 100% • Brad, România',
      title: 'Descoperiți Fabrica & Producția Noastră într-un Minut',
      sub: 'Urmăriți videoclipul nostru de prezentare: de la recoltarea sustenabilă a fagului și debitarea precisă până la uscarea naturală la aer și elemente finite pentru mobilier.',
      soundOn: 'Sunet Activat',
      soundOff: 'Sunet & Muzică',
      studio: 'Video Studio (Personalizare Scenariu) →',
      pause: 'Pauză',
      play: 'Redare',
      fullscreen: 'Ecran complet'
    }
  };

  const c = copy[lang] || copy.nl;

  return (
    <section className="section-padding" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <span 
            className="section-badge" 
            style={{ 
              backgroundColor: 'rgba(231, 177, 36, 0.15)', 
              color: '#e7b124', 
              borderColor: 'rgba(231, 177, 36, 0.3)',
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '0.75rem'
            }}
          >
            {c.badge}
          </span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            {c.title}
          </h2>
          <p style={{ color: '#a3a3a3', maxWidth: '750px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
            {c.sub}
          </p>
        </div>

        {/* Video Player Card */}
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div 
            ref={wrapperRef}
            className="gallery-video-wrapper"
            onClick={togglePlayPause}
            onMouseMove={resetControlsTimer}
            onMouseEnter={resetControlsTimer}
            onMouseLeave={() => {
              if (videoRef.current && !videoRef.current.paused) {
                setControlsVisible(false);
              }
            }}
            style={{ 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)' 
            }}
          >
            <video
              ref={videoRef}
              key={`${videoLang}-v5.10.60`}
              className="gallery-video"
              src={`/images/palrom-corporate-video-${videoLang}.mp4?v=5.10.60`}
              autoPlay
              loop
              muted={isVideoMuted}
              playsInline
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setVideoCurrentTime(videoRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current && videoRef.current.duration) {
                  setVideoDuration(videoRef.current.duration);
                }
              }}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />

            {/* Center Play Overlay when Paused */}
            <div className={`video-center-play-overlay ${!isVideoPlaying ? 'paused' : ''}`}>
              <i className="fa-solid fa-play"></i>
            </div>

            {/* Bottom Controls Bar */}
            <div 
              className={`video-controls-bottom ${controlsVisible || !isVideoPlaying ? 'visible' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress Bar / Scrubber */}
              <div 
                ref={progressRef}
                className="video-progress-container" 
                onClick={handleSeek}
                title="Klik om te spoelen"
              >
                <div className="video-progress-bg">
                  <div 
                    className="video-progress-fill" 
                    style={{ width: `${(videoCurrentTime / (videoDuration || 1)) * 100}%` }}
                  />
                  <div 
                    className="video-progress-thumb" 
                    style={{ left: `${(videoCurrentTime / (videoDuration || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Buttons Row */}
              <div className="video-controls-row">
                <div className="video-controls-left">
                  <button 
                    type="button" 
                    className="video-ctrl-btn" 
                    onClick={togglePlayPause} 
                    aria-label={isVideoPlaying ? c.pause : c.play}
                    title={isVideoPlaying ? c.pause : c.play}
                  >
                    <i className={`fa-solid ${isVideoPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                  </button>

                  <button 
                    type="button" 
                    className="video-ctrl-btn" 
                    onClick={(e) => {
                      toggleVideoSound(e);
                      resetControlsTimer();
                    }} 
                    aria-label={isVideoMuted ? c.soundOn : c.soundOff}
                    title={isVideoMuted ? c.soundOn : c.soundOff}
                  >
                    <i className={`fa-solid ${isVideoMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                  </button>

                  <span className="video-time-display">
                    {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                  </span>
                </div>

                <div className="video-controls-right">
                  <button 
                    type="button" 
                    className="video-ctrl-btn" 
                    onClick={toggleFullscreen} 
                    aria-label={c.fullscreen}
                    title={c.fullscreen}
                  >
                    <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
