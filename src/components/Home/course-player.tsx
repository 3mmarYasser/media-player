"use client"
import { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { cn } from "@/lib/utils"
import { type Video, courseSections } from "@/data/videos"
import VideoPlayer from "./video-player"
import VideoList from "./video-list"
import CourseMaterials from "./course-materials"
import Comments from "./comments"
import CourseNavigation from "./course-navigation"
import { useVideoProgress } from "@/hooks/use-video-progress"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { openModal } from "@/store/features/modalSlice"
import { ModalType } from "@/types/modal"
import ProgressIndicator from "../ui/ProgressIndicator"
import { motion, useInView, AnimatePresence } from "framer-motion"

const CoursePlayer = () => {
  const dispatch = useDispatch()
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [isWideMode, setIsWideMode] = useState(false)
  const { videoProgress, updateProgress, getVideoProgress } = useVideoProgress()
  const isMobile = useIsMobile()
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const curriculumRef = useRef<HTMLDivElement>(null)
  const commentsRef = useRef<HTMLDivElement>(null)
  const [isPlayerSticky, setIsPlayerSticky] = useState(false)
  const [activeTab, setActiveTab] = useState<"curriculum" | "comments" | "question" | "leaderboard">("curriculum")
  const [playerHeight, setPlayerHeight] = useState(0)
  
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })

  useEffect(() => {
    if (courseSections.length > 0 && courseSections[0].videos.length > 0) {
      setCurrentVideo(courseSections[0].videos[0])
    }
  }, [])

  useEffect(() => {
    if (playerContainerRef.current) {
      const updatePlayerHeight = () => {
        if (playerContainerRef.current) {
          const width = playerContainerRef.current.offsetWidth
          const height = (width * 9) / 16
          setPlayerHeight(height)
        }
      }

      updatePlayerHeight()
      window.addEventListener("resize", updatePlayerHeight)

      return () => {
        window.removeEventListener("resize", updatePlayerHeight)
      }
    }
  }, [])

  useEffect(() => {
    if (!isMobile) return

    const handleScroll = () => {
      if (!playerContainerRef.current) return

      const rect = playerContainerRef.current.getBoundingClientRect()
      setIsPlayerSticky(rect.top < 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMobile])

  const handleVideoProgress = (currentTime: number, duration: number) => {
    if (currentVideo) {
      updateProgress(currentVideo.id, currentTime, duration)
    }
  }

  const handleVideoEnded = () => {
    if (currentVideo) {
      const nextVideo = getNextVideo(currentVideo)
      if (nextVideo) {
        setCurrentVideo(nextVideo)
      }
    }
  }

  const handleSelectVideo = (video: Video) => {
    if (video.id !== currentVideo?.id) {
      setCurrentVideo(video)
    }

    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const getNextVideo = (video: Video): Video | null => {
    for (let i = 0; i < courseSections.length; i++) {
      const section = courseSections[i]
      const videoIndex = section.videos.findIndex((v) => v.id === video.id)

      if (videoIndex !== -1) {
        if (videoIndex < section.videos.length - 1) {
          return section.videos[videoIndex + 1]
        }
        else if (i < courseSections.length - 1) {
          return courseSections[i + 1].videos[0]
        }
      }
    }

    return null
  }

  const getPreviousVideo = (video: Video): Video | null => {
    for (let i = 0; i < courseSections.length; i++) {
      const section = courseSections[i]
      const videoIndex = section.videos.findIndex((v) => v.id === video.id)

      if (videoIndex !== -1) {
        if (videoIndex > 0) {
          return section.videos[videoIndex - 1]
        }
        else if (i > 0) {
          const prevSection = courseSections[i - 1]
          return prevSection.videos[prevSection.videos.length - 1]
        }
      }
    }

    return null
  }

  const toggleWideMode = () => {
    setIsWideMode(!isWideMode)
  }

  const calculateOverallProgress = () => {
    const totalVideos = courseSections.reduce((total, section) => total + section.videos.length, 0)
    const watchedVideos = Object.values(videoProgress).filter((p) => p.watched).length
    return totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0
  }

  const handleOpenPopup = (tab: "question" | "leaderboard") => {
    if (tab === "question") {
      dispatch(
        openModal({
          type: ModalType.QUESTION,
          props: {
            onClose: () => setActiveTab("curriculum"),
          },
        }),
      )
    } else if (tab === "leaderboard") {
      dispatch(
        openModal({
          type: ModalType.LEADERBOARD,
          props: {
            courseName: "Starting SEO as your Home",
            onClose: () => setActiveTab("curriculum"),
          },
        }),
      )
    }
  }

  const handleScrollToSection = (section: "curriculum" | "comments") => {
    const targetRef = section === "curriculum" ? curriculumRef : commentsRef

    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openPDF = (url: string, title: string) => {
    dispatch(
      openModal({
        type: ModalType.PDF_VIEWER,
        props: {
          pdfUrl: url,
          title: title,
        },
      }),
    )
  }

  const openExam = (examData: NonNullable<Video["resources"]>["exam"]) => {
    if (!examData) return

    dispatch(
      openModal({
        type: ModalType.EXAM,
        props: {
          examId: examData.id,
          examTitle: examData.title,
          questions: examData.questions,
          timeLimit: examData.timeLimit,
        },
      }),
    )
  }

  const renderVideoList = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 100 }}
      className="mt-8 md:mt-0"
    >
      <motion.h2 
        className="text-xl font-semibold mb-4"
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Topics for This Course
      </motion.h2>
      <ProgressIndicator progress={calculateOverallProgress()} />
      <div className="mt-6">
        <VideoList
          sections={courseSections}
          onSelectVideo={handleSelectVideo}
          currentVideo={currentVideo}
          getVideoProgress={getVideoProgress}
          onOpenPDF={openPDF}
          onOpenExam={openExam}
        />
      </div>
    </motion.div>
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white pt-4 px-6"
    >
      <motion.div
        layout
        variants={itemVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn("lg:col-span-2", isWideMode && "lg:col-span-3")}
      >
        <div
          ref={playerContainerRef}
          className={cn("mb-6", isMobile && isPlayerSticky ? "pt-[56.25vw]" : "")}
          style={isMobile && isPlayerSticky ? { height: playerHeight ? `${playerHeight}px` : "auto" } : {}}
        >
          {currentVideo && (
            <motion.div
              initial={false}
              animate={isMobile && isPlayerSticky ? { scale: 1 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn("relative z-10", isMobile && isPlayerSticky ? "fixed top-0 left-0 right-0 w-full" : "")}
            >
              <VideoPlayer
                video={currentVideo}
                onProgress={handleVideoProgress}
                videoProgress={getVideoProgress(currentVideo.id)}
                onEnded={handleVideoEnded}
                onNext={() => {
                  const nextVideo = getNextVideo(currentVideo)
                  if (nextVideo) {
                    setCurrentVideo(nextVideo)
                  }
                }}
                onPrevious={() => {
                  const prevVideo = getPreviousVideo(currentVideo)
                  if (prevVideo) {
                    setCurrentVideo(prevVideo)
                  }
                }}
                hasNext={!!getNextVideo(currentVideo)}
                hasPrevious={!!getPreviousVideo(currentVideo)}
                isWideMode={isWideMode}
                onToggleWideMode={toggleWideMode}
                nextVideo={getNextVideo(currentVideo)}
              />
            </motion.div>
          )}
        </div>

        <CourseNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          className="mb-6"
          onOpenPopup={handleOpenPopup}
          onScrollTo={handleScrollToSection}
        />

        <motion.div
          ref={curriculumRef}
          className="space-y-8"
          variants={itemVariants}
        >
          <CourseMaterials />

          <AnimatePresence>
            {isWideMode && (
              <motion.div
                key="wide-video-list"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="mt-8 p-6"
              >
                {renderVideoList()}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isWideMode && (
              <motion.div
                key="mobile-video-list"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="mt-8 p-6 lg:hidden"
              >
                {renderVideoList()}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            ref={commentsRef}
            variants={itemVariants}
          >
            <Comments />
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {!isWideMode && (
          <motion.div
            key="sidebar"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.4 }}
            className="space-y-8 hidden lg:block"
          >
            <div className="p-6 pt-0 rounded-lg">{renderVideoList()}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
export default CoursePlayer;