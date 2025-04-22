import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { Volume2, VolumeX, Maximize, Minimize, Pause, Play } from "lucide-react";
import { Slider } from "@radix-ui/react-slider";
import { Button } from "./ui/button.tsx";
import { useLocation } from "react-router-dom"; // If you're using React Router for navigation
import React from "react";

interface VideoPlayerProps {
  src: string;
  poster: string;
}

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation(); // To detect route changes (e.g., for navigation)

  useEffect(() => {
    if (!videoRef.current) return;
    console.log('Initializing player...')
  
    const initializePlayer = () => {
      const videoElement = videoRef.current;
  
      // Reset control states
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setVolume(1);
      setIsMuted(false);
  
      const options = {
        autoplay: false,
        controls: false,
        responsive: true,
        fluid: true,
        sources: [
          {
            src,
            type: "video/mp4",
          },
        ],
        poster,
      };
  
      playerRef.current = videojs(videoElement, options, () => {
        const player = playerRef.current;
  
        player.on("play", () => setIsPlaying(true));
        player.on("pause", () => setIsPlaying(false));
        player.on("timeupdate", () => setCurrentTime(player.currentTime()));
        player.on("loadedmetadata", () => {
          setDuration(player.duration());
          setCurrentTime(player.currentTime());
        });
        player.on("volumechange", () => {
          setVolume(player.volume());
          setIsMuted(player.muted());
        });
        player.on("fullscreenchange", () => {
          setIsFullscreen(document.fullscreenElement !== null);
        });
      });
    };
  
    // Slight delay to ensure DOM is ready
    const timeout = setTimeout(() => {
      initializePlayer();
    }, 50);
  
    return () => {
      clearTimeout(timeout);
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src]);

  useEffect(() => {
    resetControlsTimeout();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    setShowControls(true);

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handlePlayPause = () => {
    const player = playerRef.current;
    const videoplayer = videoRef.current;
    if (!player && !videoplayer) return;

    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const player = playerRef.current;
    if (!player) return;

    const newVolume = value[0];
    player.volume(newVolume);

    if (newVolume === 0) {
      player.muted(true);
    } else if (isMuted) {
      player.muted(false);
    }
  };

  const handleMuteToggle = () => {
    const player = playerRef.current;
    if (!player) return;

    player.muted(!isMuted);
  };

  const handleSeek = (value: number[]) => {
    const player = playerRef.current;
    if (!player) return;

    player.currentTime(value[0]);
  };

  const handleFullscreenToggle = () => {
    const player = playerRef.current;
    if (!player) return;

    if (!isFullscreen) {
      player.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div key={location.key} className="relative aspect-video bg-black rounded-md overflow-hidden" onMouseMove={resetControlsTimeout}>
      <div data-vjs-player>
        <video
          ref={(node) => {
            videoRef.current = node;
          }}
          className="video-js vjs-big-play-centered"
          playsInline
        />
      </div>

      {showControls && (
        <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/50 via-transparent to-black/50">
          <div className="flex justify-end">{/* Top controls can go here if needed */}</div>

          <div className="space-y-4">
            {/* Seekbar */}
            <Slider
  value={[currentTime]}
  max={duration}
  step={0.1}
  onValueChange={handleSeek}
  className="cursor-pointer w-full h-2 rounded-lg kavi"
  style={{
    position: 'absolute', // Position absolute
    left: '0',            // Align to the left of the container
    right: '0',           // Align to the right of the container
    // bottom: '20px',       // Adjust the position from the bottom (you can change this value)
    // marginBottom: '12px', // Optional margin for spacing
    background: `linear-gradient(to right, #4CAF50 ${((currentTime / duration) * 100).toFixed(2)}%, #B0BEC5 0%)`, // Dynamic color change
    transition: 'background 0.3s ease', // Smooth transition for color change
  }}
/>




            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={handlePlayPause} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={handleMuteToggle} className="text-white hover:bg-white/20">
                    {isMuted || volume === 0 ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                  </Button>

                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                </div>

                <div className="text-sm text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={handleFullscreenToggle} className="text-white hover:bg-white/20">
                {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
