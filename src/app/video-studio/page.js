'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function VideoStudioPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState('nl');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(181.2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [renderLang, setRenderLang] = useState('nl');
  const [renderStatus, setRenderStatus] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const videoRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const logBoxRef = useRef(null);

  // Fetch initial config & status
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/video-studio');
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (json.job) {
          setRenderStatus(json.job);
        }
      }
    } catch (e) {
      console.error('Error fetching video studio data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Polling when job is running
  useEffect(() => {
    if (renderStatus?.running) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch('/api/video-studio');
          const json = await res.json();
          if (json.success && json.job) {
            setRenderStatus(json.job);
            if (!json.job.running) {
              clearInterval(pollIntervalRef.current);
              fetchStatus(); // refresh video URLs with timestamp
              if (json.job.status === 'completed') {
                setShowResultModal(true);
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 1500);
    } else {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [renderStatus?.running]);

  // Auto scroll logs
  useEffect(() => {
    if (logBoxRef.current) {
      logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
    }
  }, [renderStatus?.logs]);

  // Video time tracking
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const seekTo = (sec) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, sec));
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const stepTime = (delta) => {
    if (videoRef.current) {
      seekTo(videoRef.current.currentTime + delta);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Helper format time mm:ss.s
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  // Set scene start timestamp from current player position
  const setSceneTimestamp = (sceneKey, timeVal) => {
    if (!data?.config) return;
    const rounded = Math.round(timeVal * 10) / 10;
    const updatedClips = { ...data.config.clips };
    
    if (sceneKey === 'scene1_drone_start') updatedClips.scene1_drone_start = rounded;
    if (sceneKey === 'scene3_drone_start') updatedClips.scene3_drone_start = rounded;
    if (sceneKey === 'scene4_drone_start') updatedClips.scene4_drone_start = rounded;

    const updatedScenes = data.config.scenes.map((s) => {
      if (sceneKey === 'scene1_drone_start' && s.id === 1) return { ...s, drone_start_sec: rounded };
      if (sceneKey === 'scene3_drone_start' && s.id === 3) return { ...s, drone_start_sec: rounded };
      if (sceneKey === 'scene4_drone_start' && s.id === 4) return { ...s, drone_start_sec: rounded };
      return s;
    });

    setData({
      ...data,
      config: {
        ...data.config,
        clips: updatedClips,
        scenes: updatedScenes
      }
    });

    setSaveStatus('Tijdstip gewijzigd (nog niet opgeslagen)');
  };

  // Text inputs handler
  const handleTextChange = (sceneId, field, value) => {
    if (!data?.config) return;
    const updatedScenes = data.config.scenes.map((s) => {
      if (s.id === sceneId) {
        return {
          ...s,
          texts: {
            ...s.texts,
            [activeLang]: {
              ...s.texts[activeLang],
              [field]: value
            }
          }
        };
      }
      return s;
    });

    setData({
      ...data,
      config: {
        ...data.config,
        scenes: updatedScenes
      }
    });

    setSaveStatus('Tekst gewijzigd (nog niet opgeslagen)');
  };

  // Save changes
  const saveConfig = async () => {
    try {
      setSaveStatus('Opslaan...');
      const res = await fetch('/api/video-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', config: data.config })
      });
      const json = await res.json();
      if (json.success) {
        setSaveStatus('✓ Instellingen opgeslagen!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus(`Fout: ${json.error || json.message}`);
      }
    } catch (e) {
      setSaveStatus(`Fout: ${e.message}`);
    }
  };

  // Start video rendering
  const triggerRender = async () => {
    try {
      // Auto save first
      await fetch('/api/video-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', config: data.config })
      });

      const res = await fetch('/api/video-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'render', lang: renderLang, config: data.config })
      });
      const json = await res.json();
      if (json.success && json.job) {
        setRenderStatus(json.job);
      } else {
        alert(json.message || 'Kon render niet starten');
      }
    } catch (e) {
      alert(`Fout bij starten render: ${e.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#e7b124] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Palrom Video Studio initialiseren...</p>
        </div>
      </div>
    );
  }

  const clips = data?.config?.clips || {};
  const chapters = data?.config?.chapters || [];
  const scenes = data?.config?.scenes || [];
  const currentCorpVideo = data?.corporateVideos?.[activeLang]?.url;

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#292929]/95 backdrop-blur px-6 py-4 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/about"
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#e7b124] transition-colors bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700 hover:border-[#e7b124]/40"
          >
            ← Naar Over Ons
          </Link>
          <div className="h-6 w-px bg-gray-800"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e7b124] shadow-[0_0_8px_#e7b124]"></span>
              <h1 className="text-lg font-bold text-white tracking-wide">
                Palrom Video Studio <span className="text-[#e7b124] font-normal text-sm ml-1">v2.0</span>
              </h1>
            </div>
            <p className="text-xs text-gray-400">
              Selecteer drone-scènes, pas teksten aan en render de meertalige bedrijfsfilm
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-3">
          {saveStatus && (
            <span className="text-xs font-medium text-[#e7b124] animate-pulse">
              {saveStatus}
            </span>
          )}

          <button
            onClick={saveConfig}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-semibold rounded-lg border border-gray-600 transition-all flex items-center gap-2"
          >
            <span>💾</span>
            <span>Instellingen Opslaan</span>
          </button>

          <button
            onClick={triggerRender}
            disabled={renderStatus?.running}
            className={`px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg transition-all ${
              renderStatus?.running
                ? 'bg-amber-700/60 text-amber-200 cursor-not-allowed border border-amber-500/40 animate-pulse'
                : 'bg-gradient-to-r from-[#e7b124] to-[#f59e0b] text-[#292929] hover:brightness-110 border border-yellow-300'
            }`}
          >
            <span>🎬</span>
            <span>
              {renderStatus?.running
                ? 'Bezig met Renderen...'
                : `Genereer Bedrijfsvideo (${renderLang.toUpperCase()})`}
            </span>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 max-w-[1720px] w-full mx-auto p-6 grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Source Video Player & Chapter Scrubbing */}
        <div className="xl:col-span-6 flex flex-col gap-6">
          <div className="bg-[#292929] rounded-2xl border border-gray-800 p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-red-500">●</span> Originele 3-Minuten Dronevideo (Bron)
                </h2>
                <p className="text-xs text-gray-400">
                  Speel af, navigeer naar een fragment en koppel het startpunt aan een scène
                </p>
              </div>
              <div className="text-xs bg-black/60 px-3 py-1.5 rounded-lg border border-gray-700 font-mono text-[#e7b124]">
                Huidige tijd: <span className="font-bold">{formatTime(currentTime)}</span> / {formatTime(duration)}
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-gray-700 shadow-inner group">
              <video
                ref={videoRef}
                src="/videos/palrom_drone_source.mp4"
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => {
                  if (videoRef.current) setDuration(videoRef.current.duration || 181.2);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls={false}
              />

              {/* Watermark preview overlay */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/20 text-xs font-bold text-[#e7b124] tracking-widest pointer-events-none">
                PALROM WATERMARK PREVIEW
              </div>

              {/* Center Play/Pause button on hover */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-14 h-14 rounded-full bg-[#e7b124] text-black flex items-center justify-center text-xl font-bold shadow-xl">
                  {isPlaying ? '❚❚' : '▶'}
                </div>
              </button>
            </div>

            {/* Custom Scrubbing Bar */}
            <div className="flex flex-col gap-2">
              <input
                type="range"
                min="0"
                max={duration || 181}
                step="0.1"
                value={currentTime}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#e7b124]"
              />

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => stepTime(-5)}
                    className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300"
                  >
                    -5s
                  </button>
                  <button
                    onClick={() => stepTime(-1)}
                    className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300"
                  >
                    -1s
                  </button>
                  <button
                    onClick={togglePlay}
                    className="px-3 py-1 bg-[#e7b124] text-black font-bold rounded text-xs hover:brightness-110"
                  >
                    {isPlaying ? 'Pauzeer' : 'Afspelen'}
                  </button>
                  <button
                    onClick={() => stepTime(1)}
                    className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300"
                  >
                    +1s
                  </button>
                  <button
                    onClick={() => stepTime(5)}
                    className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300"
                  >
                    +5s
                  </button>
                </div>

                <div className="font-mono text-gray-300">
                  {formatTime(currentTime)}
                </div>
              </div>
            </div>

            {/* One-Click Link Current Timestamp to Scenes */}
            <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-700 flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Koppel huidige tijd ({formatTime(currentTime)}) aan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setSceneTimestamp('scene1_drone_start', currentTime)}
                  className="px-3 py-2 bg-gray-800 hover:bg-[#e7b124]/20 hover:border-[#e7b124] border border-gray-700 rounded-lg text-xs font-medium text-left transition-colors flex items-center justify-between"
                >
                  <span>Scène 1 (Intro)</span>
                  <span className="text-[#e7b124] font-mono text-[10px] font-bold">
                    {formatTime(clips.scene1_drone_start || 0)}
                  </span>
                </button>

                <button
                  onClick={() => setSceneTimestamp('scene3_drone_start', currentTime)}
                  className="px-3 py-2 bg-gray-800 hover:bg-[#e7b124]/20 hover:border-[#e7b124] border border-gray-700 rounded-lg text-xs font-medium text-left transition-colors flex items-center justify-between"
                >
                  <span>Scène 3 (Zagerij)</span>
                  <span className="text-[#e7b124] font-mono text-[10px] font-bold">
                    {formatTime(clips.scene3_drone_start || 21)}
                  </span>
                </button>

                <button
                  onClick={() => setSceneTimestamp('scene4_drone_start', currentTime)}
                  className="px-3 py-2 bg-gray-800 hover:bg-[#e7b124]/20 hover:border-[#e7b124] border border-gray-700 rounded-lg text-xs font-medium text-left transition-colors flex items-center justify-between"
                >
                  <span>Scène 4 (Droogkamers)</span>
                  <span className="text-[#e7b124] font-mono text-[10px] font-bold">
                    {formatTime(clips.scene4_drone_start || 101.5)}
                  </span>
                </button>
              </div>
            </div>

            {/* Predefined Chapter Navigation */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Hoofdstukken in de 3-minuten video (klik om te springen)
              </span>
              <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
                {chapters.map((ch, idx) => {
                  const isCurrent = Math.abs(currentTime - ch.time) < 5;
                  return (
                    <button
                      key={idx}
                      onClick={() => seekTo(ch.time)}
                      className={`px-3 py-2 rounded-lg text-left text-xs transition-all flex items-center justify-between border ${
                        isCurrent
                          ? 'bg-[#e7b124]/15 border-[#e7b124] text-white'
                          : 'bg-gray-800/40 border-gray-800 hover:bg-gray-800 text-gray-300'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{ch.label}</span>
                        <span className="text-[11px] text-gray-400">{ch.desc}</span>
                      </div>
                      <span className="font-mono text-[#e7b124] bg-black/40 px-2 py-0.5 rounded text-[11px]">
                        {formatTime(ch.time)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Rendered Video Preview Box */}
          <div className="bg-[#292929] rounded-2xl border border-gray-800 p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-500">●</span> Huidige Bedrijfsvideo ({activeLang.toUpperCase()})
                </h3>
                <p className="text-xs text-gray-400">
                  Zoals nu gepubliceerd op de website (inclusief voice-over & ondertitels)
                </p>
              </div>
              {data?.corporateVideos?.[activeLang] && (
                <span className="text-xs text-gray-400 bg-gray-800/60 px-2 py-1 rounded">
                  {data.corporateVideos[activeLang].sizeMb} MB
                </span>
              )}
            </div>

            {currentCorpVideo ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-gray-700">
                <video
                  key={currentCorpVideo}
                  src={currentCorpVideo}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-44 bg-gray-900 rounded-xl flex items-center justify-center text-xs text-gray-500">
                Nog geen video gegenereerd voor {activeLang.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scenes Editor (1 to 7) & Live Render Status */}
        <div className="xl:col-span-6 flex flex-col gap-6">
          {/* Language Selector Tabs */}
          <div className="bg-[#292929] rounded-2xl border border-gray-800 p-5 flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white">Bedrijfsfilm Scènebeheer</h2>
                <p className="text-xs text-gray-400">
                  Bekijk of bewerk de ondertitels en drone-tijdscodes voor elke taal
                </p>
              </div>

              {/* Language Pills */}
              <div className="flex items-center bg-gray-900 p-1 rounded-xl border border-gray-700">
                {[
                  { code: 'nl', name: 'Nederlands' },
                  { code: 'en', name: 'English' },
                  { code: 'de', name: 'Deutsch' },
                  { code: 'ro', name: 'Română' }
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setActiveLang(l.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeLang === l.code
                        ? 'bg-[#e7b124] text-black shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Controls Panel */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl border border-gray-700 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-300">Te renderen taal:</span>
                <select
                  value={renderLang}
                  onChange={(e) => setRenderLang(e.target.value)}
                  className="bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-600 focus:border-[#e7b124] outline-none"
                >
                  <option value="nl">Alleen Nederlands (Snel, ~12 sec)</option>
                  <option value="en">Alleen Engels (~12 sec)</option>
                  <option value="de">Alleen Duits (~12 sec)</option>
                  <option value="ro">Alleen Roemeens (~12 sec)</option>
                  <option value="all">Alle 4 Talen tegelijk (~35 sec)</option>
                </select>
              </div>

              <button
                onClick={triggerRender}
                disabled={renderStatus?.running}
                className="px-4 py-2 bg-[#e7b124] hover:bg-[#d89f18] text-black font-bold text-xs rounded-lg transition-all shadow disabled:opacity-50"
              >
                {renderStatus?.running ? 'Rendering draait...' : 'Start Render & Update Video'}
              </button>
            </div>

            {/* Live Terminal / Log Box if rendering or recently finished */}
            {renderStatus && (
              <div className="bg-black/90 rounded-xl border border-gray-800 p-4 flex flex-col gap-2 font-mono text-xs">
                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        renderStatus.running
                          ? 'bg-amber-400 animate-ping'
                          : renderStatus.status === 'completed'
                          ? 'bg-emerald-400'
                          : 'bg-red-400'
                      }`}
                    ></span>
                    <span className="text-white font-semibold">
                      Render Status: {renderStatus.status?.toUpperCase()}
                    </span>
                  </div>
                  {renderStatus.startedAt && (
                    <span className="text-[10px] text-gray-500">
                      Gestart: {new Date(renderStatus.startedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                <div
                  ref={logBoxRef}
                  className="h-28 overflow-y-auto bg-gray-950 p-2.5 rounded border border-gray-900 text-gray-300 text-[11px] leading-relaxed flex flex-col gap-1"
                >
                  {renderStatus.logs?.length ? (
                    renderStatus.logs.map((log, i) => (
                      <div
                        key={i}
                        className={
                          log.startsWith('✓')
                            ? 'text-emerald-400 font-bold'
                            : log.startsWith('✖')
                            ? 'text-red-400 font-bold'
                            : log.includes('SUCCESS')
                            ? 'text-[#e7b124] font-semibold'
                            : 'text-gray-400'
                        }
                      >
                        {log}
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-600">Geen actieve log</span>
                  )}
                </div>
              </div>
            )}

            {/* Scenes List (1 to 7) */}
            <div className="flex flex-col gap-4 mt-2">
              {scenes.map((scene) => {
                const currentText = scene.texts?.[activeLang] || {};
                const isDrone = scene.type === 'drone' || scene.type === 'drone_saw';

                return (
                  <div
                    key={scene.id}
                    className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-colors flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-[#e7b124]/20 text-[#e7b124] text-xs font-bold flex items-center justify-center border border-[#e7b124]/30">
                          {scene.id}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{scene.label}</h4>
                          <p className="text-[11px] text-gray-400">{scene.description}</p>
                        </div>
                      </div>

                      {/* Visual Badge */}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-gray-800 text-gray-300 border border-gray-700">
                        {scene.type}
                      </span>
                    </div>

                    {/* If drone scene: start timestamp config */}
                    {isDrone && (
                      <div className="bg-black/40 p-2.5 rounded-lg border border-gray-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Starttijd droneclip:</span>
                          <span className="font-mono font-bold text-[#e7b124]">
                            {formatTime(scene.drone_start_sec || 0)} ({scene.drone_start_sec}s)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => seekTo(scene.drone_start_sec || 0)}
                            className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-[11px]"
                          >
                            Bekijk in speler
                          </button>
                          <button
                            onClick={() => {
                              const key =
                                scene.id === 1
                                  ? 'scene1_drone_start'
                                  : scene.id === 3
                                  ? 'scene3_drone_start'
                                  : 'scene4_drone_start';
                              setSceneTimestamp(key, currentTime);
                            }}
                            className="px-2.5 py-1 bg-[#e7b124]/20 hover:bg-[#e7b124]/40 border border-[#e7b124] text-[#e7b124] rounded text-[11px] font-semibold"
                          >
                            Huidige tijd instellen
                          </button>
                        </div>
                      </div>
                    )}

                    {/* If Scene 6 (Team & Certificering): Visual Team Photo Preview */}
                    {scene.id === 6 && (
                      <div className="bg-black/50 p-3 rounded-lg border border-gray-800 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-200 font-semibold flex items-center gap-1.5">
                            <span>👥</span> Huidige Teamfoto (Palrom Zwart #292929 & Officiële Logo's)
                          </span>
                          <a
                            href="/images/team_group_photo.png"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-[#e7b124] hover:underline font-medium"
                          >
                            Open in origineel formaat ↗
                          </a>
                        </div>
                        <div className="relative rounded-lg overflow-hidden border border-gray-700/60 bg-[#292929] aspect-video">
                          <img
                            src="/images/team_group_photo.png"
                            alt="Palrom Team Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Title & Subtitle Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-gray-400 font-medium">
                          Titel ({activeLang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={currentText.title || ''}
                          onChange={(e) => handleTextChange(scene.id, 'title', e.target.value)}
                          className="bg-black/60 border border-gray-700 focus:border-[#e7b124] rounded-lg px-3 py-1.5 text-white outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-gray-400 font-medium">
                          Subtitel ({activeLang.toUpperCase()})
                        </label>
                        <input
                          type="text"
                          value={currentText.sub || ''}
                          onChange={(e) => handleTextChange(scene.id, 'sub', e.target.value)}
                          className="bg-black/60 border border-gray-700 focus:border-[#e7b124] rounded-lg px-3 py-1.5 text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#292929] border border-[#e7b124] rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center text-xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Bedrijfsvideo succesvol bijgewerkt!</h3>
                <p className="text-xs text-gray-400">
                  De nieuwe montage is direct actief op de website en klaar voor gebruik.
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed bg-gray-900/80 p-3 rounded-xl border border-gray-800">
              Alle geselecteerde tijdscodes, voice-over synchronisaties en ondertitels zijn opnieuw gerenderd in haarscherpe 1080p kwaliteit.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResultModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold rounded-lg text-gray-300"
              >
                Sluiten
              </button>
              <Link
                href="/about"
                className="px-5 py-2 bg-[#e7b124] text-black font-bold text-xs rounded-lg hover:brightness-110 shadow"
              >
                Bekijk op Over Ons Pagina →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
