"use client"
import React, { useState, useRef, useEffect } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import type { Video } from "@/data/videos"
import type { VideoProgress } from "@/hooks/use-video-progress"
import { motion, AnimatePresence } from "framer-motion"

interface VideoPlayerProps {
  video: Video
  onProgress: (currentTime: number, duration: number) => void
  videoProgress: VideoProgress
  onEnded: () => void
  onNext: () => void
  onPrevious: () => void
  hasNext: boolean
  hasPrevious: boolean
  isWideMode: boolean
  onToggleWideMode: () => void
  nextVideo?: Video | null
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  onProgress,
  videoProgress,
  onEnded,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  isWideMode,
  onToggleWideMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const isYoutubeVideo = video.url.includes('youtube.com') || video.url.includes('youtu.be');
  
  const getYoutubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };
  
  const youtubeVideoId = isYoutubeVideo ? getYoutubeVideoId(video.url) : null;
  
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [seeking, setSeeking] = useState(false);
  const [clientSide, setClientSide] = useState(false);
  
  useEffect(() => {
    setClientSide(true);
  }, []);

  useEffect(() => {
    if (!clientSide) return;
    
    if (isYoutubeVideo) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsBuffering(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
    
    if (!videoRef.current) return;
    
    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");
    
    const handleLoadedMetadata = () => {
      setIsLoading(false);
      
      if (videoRef.current && videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
      
      if (videoProgress.lastPosition > 0 && videoRef.current) {
        videoRef.current.currentTime = videoProgress.lastPosition;
        setCurrentTime(videoProgress.lastPosition);
      }
    };
    
    const handleLoadedData = () => {
      setIsLoading(false);
      setIsBuffering(false);
      
      if (playing && videoRef.current) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Autoplay prevented:', error);
            setPlaying(false);
          });
        }
      }
    };
    
    const handleCanPlay = () => {
      setIsLoading(false);
      setIsBuffering(false);
    };
    
    const handleError = () => {
      setIsLoading(false);
      setIsBuffering(false);
      setHasError(true);
      
      if (videoRef.current && videoRef.current.error) {
        const videoError = videoRef.current.error;
        let message = "Unknown error occurred";
        
        switch (videoError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            message = "Video playback aborted";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            message = "Network error occurred while loading the video";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            message = "Video decoding failed";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            message = "Video format not supported by your browser";
            break;
        }
        
        setErrorMessage(message);
      } else {
        setErrorMessage("Failed to load video");
      }
    };
    
    const videoElement = videoRef.current;
    
    videoElement.volume = volume;
    videoElement.muted = muted;
    
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('loadeddata', handleLoadedData);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);
    
    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
    };
  }, [clientSide, videoProgress.lastPosition, volume, muted, playing, video.url, isYoutubeVideo]);
  
  useEffect(() => {
    if (!clientSide || isYoutubeVideo || !videoRef.current) return;
    
    const videoElement = videoRef.current;
    
    const handlePlay = () => {
      setPlaying(true);
      setIsBuffering(false);
    };
    
    const handlePause = () => {
      setPlaying(false);
      setIsLoading(false);
      setIsBuffering(false);
    };
    
    const handleWaiting = () => {
      setIsBuffering(true);
    };
    
    const handlePlaying = () => {
      setIsBuffering(false);
    };
    
    const handleEnded = () => {
      setPlaying(false);
      if (onEnded) onEnded();
    };
    
    const handleStalled = () => {
      setIsBuffering(true);
    };
    
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('waiting', handleWaiting);
    videoElement.addEventListener('playing', handlePlaying);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('stalled', handleStalled);
    
    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('waiting', handleWaiting);
      videoElement.removeEventListener('playing', handlePlaying);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('stalled', handleStalled);
    };
  }, [clientSide, onEnded, isYoutubeVideo]);
  
  useEffect(() => {
    if (!clientSide || !isYoutubeVideo) return;
    
    const handleYouTubeMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          
          if (data.event === 'onStateChange') {
            switch (data.info) {
              case 0: // ended
                setPlaying(false);
                if (onEnded) onEnded();
                break;
              case 1: // playing
                setPlaying(true);
                setIsBuffering(false);
                break;
              case 2: // paused
                setPlaying(false);
                break;
              case 3: // buffering
                setIsBuffering(true);
                break;
            }
          } else if (data.event === 'onError') {
            setHasError(true);
            setErrorMessage("YouTube video playback error");
          }
        }
      } catch  {
      }
    };
    
    window.addEventListener('message', handleYouTubeMessage);
    
    return () => {
      window.removeEventListener('message', handleYouTubeMessage);
    };
  }, [clientSide, isYoutubeVideo, onEnded]);

  useEffect(() => {
    if (!clientSide) return;
    
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [clientSide]);
  
  useEffect(() => {
    if (!clientSide || hasError) return;
    
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    const updateProgress = () => {
      if (isYoutubeVideo) {
        if (playing) {
          setCurrentTime(prev => {
            const newTime = prev + 0.25; 
            if (onProgress && duration > 0) {
              onProgress(newTime, duration);
            }
            return newTime;
          });
        }
      } else if (videoRef.current !== null) {
        const time = videoRef.current.currentTime;
        const videoDuration = videoRef.current.duration || 0;
        
        if (!isNaN(time)) {
          setCurrentTime(time);
          
          if (videoRef.current.buffered && videoRef.current.buffered.length > 0) {
            try {
              const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
              setBuffered(bufferedEnd / (videoDuration || 1));
            } catch  {
            }
          }
          
          if (onProgress && !isNaN(videoDuration)) {
            onProgress(time, videoDuration);
          }
        }
      }
    };
    
    progressIntervalRef.current = setInterval(updateProgress, 250);
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [clientSide, onProgress, hasError, isYoutubeVideo, playing, duration]);
  
  useEffect(() => {
    if (!clientSide || isYoutubeVideo || !videoRef.current || hasError) return;
    
    try {
      if (playing) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => {
            console.error("Play prevented:", e);
            setPlaying(false);
          });
        }
      } else {
        videoRef.current.pause();
      }
    } catch (e) {
      console.error("Error controlling playback:", e);
    }
  }, [clientSide, playing, hasError, isYoutubeVideo]);
  
  useEffect(() => {
    if (!clientSide || !isYoutubeVideo || !youtubeRef.current) return;
    
    try {
      const iframe = youtubeRef.current;
      const message = playing
        ? '{"event":"command","func":"playVideo","args":""}'
        : '{"event":"command","func":"pauseVideo","args":""}';
      
      iframe.contentWindow?.postMessage(message, '*');
    } catch (e) {
      console.error("Error controlling YouTube playback:", e);
    }
  }, [clientSide, playing, isYoutubeVideo]);
  
  // Handle volume
  useEffect(() => {
    if (!clientSide) return;
    
    if (!isYoutubeVideo && videoRef.current) {
      try {
        videoRef.current.volume = volume;
      } catch  {
      }
    } else if (isYoutubeVideo && youtubeRef.current) {
      try {
        const message = `{"event":"command","func":"setVolume","args":[${Math.round(volume * 100)}]}`;
        youtubeRef.current.contentWindow?.postMessage(message, '*');
      } catch (e) {
        console.error("Error setting YouTube volume:", e);
      }
    }
  }, [clientSide, volume, isYoutubeVideo]);

  useEffect(() => {
    if (!clientSide) return;
    
    if (!isYoutubeVideo && videoRef.current) {
      try {
        videoRef.current.muted = muted;
      } catch  {
      }
    } else if (isYoutubeVideo && youtubeRef.current) {
      try {
        const message = muted
          ? '{"event":"command","func":"mute","args":""}'
          : '{"event":"command","func":"unMute","args":""}';
        
        youtubeRef.current.contentWindow?.postMessage(message, '*');
      } catch (e) {
        console.error("Error controlling YouTube mute:", e);
      }
    }
  }, [clientSide, muted, isYoutubeVideo]);
  
  useEffect(() => {
    setHasError(false);
    setErrorMessage("");
    
    setIsLoading(true);
    
    if (isYoutubeVideo) {
    } else if (videoRef.current) {
      videoRef.current.load();
      
      if (!isLoading) {
        setPlaying(true);
      }
    }
  }, [video.url, isYoutubeVideo]);
  
  useEffect(() => {
    if (!clientSide) return;
    
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      setShowControls(true);
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (playing && !seeking && !isBuffering && !isLoading && !hasError) {
          setShowControls(false);
        }
      }, 3000);
    };

    resetControlsTimeout();
    
    if (!playing || isBuffering || isLoading || hasError) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [clientSide, playing, seeking, isBuffering, isLoading, hasError]);

  const togglePlay = () => {
    if (hasError) return;
    
    if (playing) {
      setIsLoading(false);
      setIsBuffering(false);
    }
    
    setPlaying(!playing);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    if (!clientSide) return;
    
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
      }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value) || hasError) return;
    
    setCurrentTime(value);
    
    if (!isYoutubeVideo && videoRef.current) {
      videoRef.current.currentTime = value;
    } else if (isYoutubeVideo && youtubeRef.current) {
      try {
        const message = `{"event":"command","func":"seekTo","args":[${value},true]}`;
        youtubeRef.current.contentWindow?.postMessage(message, '*');
      } catch (e) {
        console.error("Error seeking YouTube video:", e);
      }
    }
  };
  
  const handleSeekMouseDown = () => {
    setSeeking(true);
    setPlaying(false);
  };
  
  const handleSeekMouseUp = () => {
    setSeeking(false);
    if (!hasError) {
      setPlaying(true);
    }
  };
  
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration || hasError) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    
    const newTime = position * duration;
    
    setCurrentTime(newTime);
    
    if (!isYoutubeVideo && videoRef.current) {
      videoRef.current.currentTime = newTime;
    } else if (isYoutubeVideo && youtubeRef.current) {
      try {
        const message = `{"event":"command","func":"seekTo","args":[${newTime},true]}`;
        youtubeRef.current.contentWindow?.postMessage(message, '*');
      } catch (e) {
        console.error("Error seeking YouTube video:", e);
      }
    }
  };
  
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleFullscreen();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (isNaN(newVolume)) return;
    
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setMuted(true);
    } else if (muted) {
      setMuted(false);
    }
  };

  const handleMouseMove = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setShowControls(true);
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing && !seeking && !isBuffering && !isLoading && !hasError) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  const handleRetry = () => {
    setHasError(false);
    setErrorMessage("");
    
    setIsLoading(true);
    
    if (!isYoutubeVideo && videoRef.current) {
      videoRef.current.load();
    }
    
    setPlaying(true);
  };
  
  useEffect(() => {
    if (!clientSide || !isYoutubeVideo || !youtubeRef.current) return;

    const handleYoutubeIframeLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
        setIsBuffering(false);
      }, 500);
    };
    
    if (youtubeRef.current) {
      youtubeRef.current.addEventListener('load', handleYoutubeIframeLoad);
      
      return () => {
        youtubeRef.current?.removeEventListener('load', handleYoutubeIframeLoad);
      };
    }
  }, [clientSide, isYoutubeVideo]);

  const isCurrentPositionBuffered = (): boolean => {
    if (isYoutubeVideo || !videoRef.current || !videoRef.current.buffered || videoRef.current.buffered.length === 0) {
      return false;
    }
    
    const currentTime = videoRef.current.currentTime;
    
    for (let i = 0; i < videoRef.current.buffered.length; i++) {
      const start = videoRef.current.buffered.start(i);
      const end = videoRef.current.buffered.end(i);
      
      if (currentTime >= start && currentTime <= end) {
        return true;
      }
    }
    
    return false;
  };

  if (!clientSide) {
    return (
      <div className={cn(
        "relative overflow-hidden bg-black rounded-lg",
        isWideMode ? "w-full h-full min-h-[360px] flex items-center justify-center" : "aspect-video max-w-4xl",
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon icon="line-md:loading-twotone-loop" className="text-white w-16 h-16" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-black rounded-lg",
        isWideMode ? "w-full flex items-center justify-center" : "aspect-video max-w-4xl",
        fullscreen ? "h-screen w-screen" : "",
      )}
      onMouseMove={handleMouseMove}
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          togglePlay();
        }
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
      layout
    >
      <div 
        className={cn(
          isWideMode && !fullscreen 
            ? "w-full h-auto max-h-[calc(100vh-160px)] aspect-video" 
            : "w-full h-full"
        )} 
        onDoubleClick={handleDoubleClick}
      >
        {isYoutubeVideo && youtubeVideoId ? (
          <iframe
            ref={youtubeRef}
            className="w-full h-full object-contain"
            src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}&controls=0&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            src={video.url}
            preload="auto"
            playsInline
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
          />
        )}
      </div>
      
      <AnimatePresence>
        {((isLoading || isBuffering) && !hasError && playing && (!isCurrentPositionBuffered() || buffered < 0.05)) && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{
                rotate: 360,
                transition: {
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "linear",
                },
              }}
            >
              <Icon icon="line-md:loading-twotone-loop" className="text-white w-16 h-16" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {hasError && (
          <motion.div
            className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon icon="line-md:alert-circle" className="text-red-500 w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Video Error</h3>
            <p className="text-white/80 mb-6">{errorMessage}</p>
            <button
              onClick={handleRetry}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-full 
                        flex items-center justify-center transition-all transform hover:scale-105"
            >
              <Icon icon="line-md:reload" className="mr-2" />
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!playing && !isLoading && !isBuffering && !hasError && (
          <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
        >
            <motion.div
              className="w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1}}
                transition={{ delay: 0.05, type: "spring", stiffness: 300, damping: 15 }}
              >
                <Icon icon="mdi:play" className="text-red-500" width={36} height={36} />
              </motion.div>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>

      <div 
        className={cn(
          "absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent text-white",
          !showControls && "opacity-0",
        )}
        style={{ transition: "opacity 0.3s ease" }}
      >
        <h2 className="text-lg font-medium">{video.title}</h2>
      </div>

      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white transition-all duration-300",
          !showControls && "opacity-0 translate-y-5",
          hasError && "opacity-0",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center mb-2">
          <div 
            className={cn(
              "w-full bg-white/30 h-1 rounded-full overflow-hidden relative group hover:h-2 transition-all",
              hasError ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            )}
            onClick={handleProgressBarClick}
          >
            <div 
              className="h-full bg-white/50 absolute top-0 left-0"
              style={{ width: `${buffered * 100}%` }}
            />
            <div
              className="h-full bg-red-500 absolute top-0 left-0"
              style={{ width: `${((currentTime || 0) / Math.max(duration || 1, 1)) * 100}%` }}
            />
            <div className="absolute top-0 bottom-0 w-1 bg-white/80 opacity-0 group-hover:opacity-100 -translate-x-1/2" 
              style={{ 
                left: `${((currentTime || 0) / Math.max(duration || 1, 1)) * 100}%`,
                transition: 'opacity 0.2s ease' 
              }}
            />
          <input
            type="range"
            min={0}
            max={duration || 100}
              step={0.1}
              value={isNaN(currentTime) ? 0 : currentTime}
            onChange={handleSeek}
              onMouseDown={handleSeekMouseDown}
              onMouseUp={handleSeekMouseUp}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              disabled={hasError}
          />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className={cn(
                "p-1 rounded-full transition-all",
                hasError
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/20 hover:scale-110 active:scale-95"
              )}
              aria-label={playing ? "Pause" : "Play"}
              disabled={hasError}
            >
              {playing ? (
                <Icon icon="mdi:pause" width={20} height={20} />
              ) : (
                <Icon icon="mdi:play" width={20} height={20} />
              )}
            </button>

            <button
              onClick={onPrevious}
              disabled={!hasPrevious || hasError}
              className={cn(
                "p-1 rounded-full transition-all", 
                hasPrevious && !hasError
                  ? "hover:bg-white/20 hover:scale-110 active:scale-95"
                  : "opacity-50 cursor-not-allowed"
              )}
              aria-label="Previous video"
            >
              <Icon icon="mdi:skip-previous" width={20} height={20} />
            </button>

            <button
              onClick={onNext}
              disabled={!hasNext || hasError}
              className={cn(
                "p-1 rounded-full transition-all", 
                hasNext && !hasError
                  ? "hover:bg-white/20 hover:scale-110 active:scale-95"
                  : "opacity-50 cursor-not-allowed"
              )}
              aria-label="Next video"
            >
              <Icon icon="mdi:skip-next" width={20} height={20} />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-1 rounded-full hover:bg-white/20 hover:scale-110 active:scale-95 transition-all"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? (
                  <Icon icon="mdi:volume-off" width={20} height={20} />
                ) : (
                  <Icon icon="mdi:volume-high" width={20} height={20} />
                )}
              </button>
              
              <div className="w-20 h-1 bg-white/30 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-white"
                  style={{ width: `${volume * 100}%` }}
                />
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleVolumeChange}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
              </div>
            </div>

            <div className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleWideMode}
              className="hidden md:block p-1 rounded-full hover:bg-white/20 hover:scale-110 active:scale-95 transition-all"
              aria-label={isWideMode ? "Exit wide mode" : "Enter wide mode"}
            >
              {isWideMode ? (
                <Icon icon="mdi:arrow-collapse" width={20} height={20} />
              ) : (
                <Icon icon="mdi:arrow-expand" width={20} height={20} />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1 rounded-full hover:bg-white/20 hover:scale-110 active:scale-95 transition-all"
              aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Icon icon="mdi:fullscreen" width={20} height={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
