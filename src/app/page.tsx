"use client"

import CoursePlayer from "@/components/Home/course-player"
import BreadcrumbNavigation from "@/components/shared/BreadcrumbNavigation"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export default function HomePage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className="container mx-auto py-8"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <BreadcrumbNavigation />

      <motion.div className="mb-6 px-6" variants={titleVariants}>
        <motion.h1
          className="text-3xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.3,
                    type: "spring",
                    stiffness: 100,
                  },
                }
              : {}
          }
        >
          Starting SEO as your Home
        </motion.h1>
      </motion.div>

      <CoursePlayer />
    </motion.div>
  )
}
