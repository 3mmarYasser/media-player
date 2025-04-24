"use client"

import type React from "react"
import { useRef } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import type { Video, CourseSection } from "@/data/videos"
import type { VideoProgress } from "@/hooks/use-video-progress"
import { motion, AnimatePresence, useInView } from "framer-motion"

interface VideoListProps {
  sections: CourseSection[]
  onSelectVideo: (video: Video) => void
  currentVideo: Video | null
  getVideoProgress: (videoId: string) => VideoProgress
  onOpenPDF?: (url: string, title: string) => void
  onOpenExam?: (examData: NonNullable<Video["resources"]>["exam"]) => void
}

const VideoList: React.FC<VideoListProps> = ({
  sections,
  onSelectVideo,
  currentVideo,
  getVideoProgress,
  onOpenPDF,
  onOpenExam,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const handleResourceClick = (e: React.MouseEvent, video: Video) => {
    e.stopPropagation()

    if (video.resources?.pdf && onOpenPDF) {
      onOpenPDF(video.resources.pdf.url, video.resources.pdf.title)
    } else if (video.resources?.exam && onOpenExam) {
      onOpenExam(video.resources.exam)
    }
  }

  const handleResourceKeyDown = (e: React.KeyboardEvent, video: Video) => {
    if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation()

      if (video.resources?.pdf && onOpenPDF) {
        onOpenPDF(video.resources.pdf.url, video.resources.pdf.title)
      } else if (video.resources?.exam && onOpenExam) {
        onOpenExam(video.resources.exam)
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: i * 0.1,
        staggerChildren: 0.05,
        delayChildren: 0.1 + i * 0.1,
      },
    }),
  }

  const videoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: i * 0.05,
      },
    }),
  }

  return (
    <motion.div
      ref={ref}
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {sections.map((section, sectionIndex) => (
        <motion.div
          key={section.id}
          custom={sectionIndex}
          variants={sectionVariants}
          className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
          whileHover={{
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            y: -5,
            transition: { duration: 0.3 },
          }}
        >
          <motion.div
            className="p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{ delay: 0.2 + sectionIndex * 0.1, duration: 0.5 }}
          >
            <motion.h3
              className="text-lg font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.3 + sectionIndex * 0.1, duration: 0.5 }}
            >
              {section.title}
            </motion.h3>
            <motion.p
              className="text-sm text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.4 + sectionIndex * 0.1, duration: 0.5 }}
            >
              Advanced story telling techniques for writers: Personas, Characters & Plots
            </motion.p>
          </motion.div>

          <div className="divide-y">
            <AnimatePresence>
              {section.videos.map((video, videoIndex) => {
                const progress = getVideoProgress(video.id)
                const isActive = currentVideo?.id === video.id
                const hasResources = video.resources?.pdf || video.resources?.exam

                return (
                  <motion.div
                    key={video.id}
                    custom={videoIndex}
                    variants={videoVariants}
                    className="border-t border-gray-100"
                  >
                    <motion.div
                      whileHover={{
                        backgroundColor: "rgba(243, 244, 246, 0.8)",
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "w-full flex items-center p-4 transition-colors text-left cursor-pointer",
                        isActive && "bg-blue-50",
                      )}
                      onClick={() => onSelectVideo(video)}
                      initial={isActive ? { backgroundColor: "rgba(219, 234, 254, 0)" } : {}}
                      animate={
                        isActive
                          ? {
                              backgroundColor: "rgba(219, 234, 254, 1)",
                              transition: { duration: 0.3 },
                            }
                          : {}
                      }
                    >
                      <motion.div
                        className="flex-shrink-0 mr-3"
                        animate={
                          progress.watched
                            ? {
                                scale: [1, 1.3, 1],
                                rotate: [0, 10, 0],
                                transition: { duration: 0.5, delay: 0.1 },
                              }
                            : {}
                        }
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        {progress.watched ? (
                          <Icon icon="mdi:checkbox-multiple-marked-circle-outline" className="h-5 w-5 text-green-500" />
                        ) : progress.progress > 0 ? (
                          <Icon icon="mdi:clock-time-four-outline" className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Icon icon="eva:file-text-outline" className="h-5 w-5 text-gray-400" />
                        )}
                      </motion.div>

                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <motion.span className="font-medium text-gray-700" whileHover={{ color: "#1d4ed8" }}>
                            {video.title}
                          </motion.span>

                          <div className="flex items-center space-x-3">
                            {video.metadata && (
                              <div className="flex gap-2 items-end justify-end flex-wrap">
                                {video.metadata.questionCount !== undefined && (
                                  <motion.span
                                    className="text-xs text-green-500 bg-green-500/20 px-1.5 py-0.5 rounded-sm"
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(34, 197, 94, 0.3)" }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                    transition={{ delay: 0.5 + videoIndex * 0.05, duration: 0.3 }}
                                  >
                                    {video.metadata.questionCount} QUESTION
                                    {video.metadata.questionCount !== 1 ? "S" : ""}
                                  </motion.span>
                                )}
                                {video.metadata.minutesRequired && (
                                  <motion.span
                                    className="text-xs text-red-500 bg-red-500/20 px-1.5 py-0.5 rounded-sm"
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.3)" }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                    transition={{ delay: 0.6 + videoIndex * 0.05, duration: 0.3 }}
                                  >
                                    {video.metadata.minutesRequired} MINUTES
                                  </motion.span>
                                )}
                              </div>
                            )}

                            {hasResources && (
                              <motion.div
                                onClick={(e) => handleResourceClick(e, video)}
                                className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                aria-label={video.resources?.pdf ? "View PDF" : "Take Quiz"}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => handleResourceKeyDown(e, video)}
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.95, rotate: 0 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{ delay: 0.7 + videoIndex * 0.05, duration: 0.3 }}
                              >
                                {video.resources?.pdf ? (
                                  <Icon icon="bxs:file-pdf" className="h-5 w-5 text-blue-500" />
                                ) : (
                                  <Icon
                                    icon="healthicons:i-exam-multiple-choice-outline"
                                    className="h-5 w-5 text-indigo-500"
                                  />
                                )}
                              </motion.div>
                            )}

                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                              transition={{ delay: 0.8 + videoIndex * 0.05, duration: 0.3 }}
                              whileHover={{ scale: 1.2, rotate: 10 }}
                            >
                              <Icon icon="icon-park-outline:lock-one" className="h-5 w-5 text-gray-400" />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
export default VideoList
