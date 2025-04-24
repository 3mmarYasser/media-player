        {/* Controls bar */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white",
            !showControls && "opacity-0 pointer-events-none"
          )}
          style={{ transition: "opacity 0.3s ease" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center mb-2">
            <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-red-500"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlay()
                }}
                className="p-1 rounded-full hover:bg-white/20"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? (
                  <Icon icon="mdi:pause" width={20} height={20} />
                ) : (
                  <Icon icon="mdi:play" width={20} height={20} />
                )}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleMute()
                  }}
                  className="p-1 rounded-full hover:bg-white/20"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted || volume === 0 ? (
                    <Icon icon="mdi:volume-off" width={20} height={20} />
                  ) : (
                    <Icon icon="mdi:volume-high" width={20} height={20} />
                  )}
                </button>

                <div className="w-20 h-1 bg-white/30 rounded-full overflow-hidden relative">
                  <div className="h-full bg-white" style={{ width: `${volume * 100}%` }} />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={handleVolumeChange}
                    onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFullscreen()
                }}
                className="p-1 rounded-full hover:bg-white/20"
                aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                <Icon icon="mdi:fullscreen" width={20} height={20} />
              </button>
            </div>
          </div>
        </div> 