"use client"

import type React from "react"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { motion, useInView } from "framer-motion"

interface CourseNavigationProps {
  activeTab: "curriculum" | "comments" | "question" | "leaderboard"
  setActiveTab: (tab: "curriculum" | "comments" | "question" | "leaderboard") => void
  className?: string
  onOpenPopup?: (tab: "question" | "leaderboard") => void
  onScrollTo?: (section: "curriculum" | "comments") => void
}

const CourseNavigation: React.FC<CourseNavigationProps> = ({
  activeTab,
  setActiveTab,
  className,
  onOpenPopup,
  onScrollTo,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const handleTabClick = (tab: "curriculum" | "comments" | "question" | "leaderboard") => {
    setActiveTab(tab)

    if (tab === "curriculum" || tab === "comments") {
      onScrollTo?.(tab)
    }

    if (tab === "question" || tab === "leaderboard") {
      onOpenPopup?.(tab)
    }
  }

  const navigationItems = [
    { id: "curriculum", label: "Curriculum", icon: "book" },
    { id: "comments", label: "Comments", icon: "message" },
    { id: "question", label: "Ask a Question", icon: "help" },
    { id: "leaderboard", label: "Leaderboard", icon: "trophy" },
  ] as const

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.6, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: i * 0.1,
      },
    }),
  }

  return (
    <motion.nav
      ref={ref}
      className={cn("flex justify-start space-x-2", className)}
      aria-label="Course navigation"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {navigationItems.map(({ id, label, icon }, index) => (
        <motion.button
          key={id}
          custom={index}
          variants={itemVariants}
          onClick={() => handleTabClick(id as "curriculum" | "comments" | "question" | "leaderboard")}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 transition-colors relative overflow-hidden",
            "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
            activeTab === id ? "text-blue-600" : "text-gray-500 hover:text-gray-700",
          )}
          aria-label={label}
          aria-pressed={activeTab === id}
          title={label}
          whileHover={{
            scale: 1.1,
            backgroundColor: activeTab === id ? "rgba(219, 234, 254, 1)" : "rgba(229, 231, 235, 1)",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          {activeTab === id && (
            <motion.div
              className="absolute inset-0 bg-blue-100 rounded-full"
              layoutId="activeTabBackground"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{ zIndex: 0 }}
            />
          )}

          <motion.div
            className="relative z-10"
            animate={
              activeTab === id
                ? {
                    scale: 1.2,
                    rotate: 10,
                    transition: { 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 25 
                    },
                  }
                : {}
            }
            whileHover={{
              rotate: [0, -10, 10, -5, 0],
              transition: { duration: 0.5, type: "tween" },
            }}
          >
            <Icon icon={`icon-park-outline:${icon}`} className="w-5 h-5" />
          </motion.div>

          {activeTab === id && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [1, 1.5, 1.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              style={{
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)",
                zIndex: -1,
              }}
            />
          )}
        </motion.button>
      ))}
    </motion.nav>
  )
}
export default CourseNavigation
