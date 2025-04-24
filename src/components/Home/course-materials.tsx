"use client"

import { Icon } from "@iconify/react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface CourseMaterialItem {
  icon: string
  label: string
  value: string
}

const CourseMaterials = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const courseItems: CourseMaterialItem[] = [
    { icon: "mdi:clock-outline", label: "Duration", value: "3 weeks" },
    { icon: "uil:books", label: "Lessons", value: "8 lessons" },
    { icon: "game-icons:read", label: "Enrolled", value: "65 students" },
    { icon: "material-symbols-light:language", label: "Language", value: "English" },
    { icon: "mdi:clock-outline", label: "Duration", value: "3 weeks" },
    { icon: "uil:books", label: "Lessons", value: "8 lessons" },
    { icon: "game-icons:read", label: "Enrolled", value: "65 students" },
    { icon: "material-symbols-light:language", label: "Language", value: "English" },
  ]

  const leftColumnItems = courseItems.slice(0, courseItems.length / 2)
  const rightColumnItems = courseItems.slice(courseItems.length / 2)

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
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

  const titleVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.2,
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  return (
    <motion.div ref={ref} variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}>
      <motion.h2 className="text-2xl font-bold mb-6" variants={titleVariants}>
        Course Materials
      </motion.h2>

      <motion.div
        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        variants={cardVariants}
        whileHover={{
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          y: -5,
          transition: { duration: 0.3 },
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-48">
          <div className="space-y-0">
            {leftColumnItems.map((item, index) => (
              <MaterialItem
                key={index}
                icon={item.icon}
                label={item.label}
                value={item.value}
                isLast={index === leftColumnItems.length - 1}
                delay={index * 0.1}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>

          <div className="space-y-0 mt-4 md:mt-0">
            {rightColumnItems.map((item, index) => (
              <MaterialItem
                key={index}
                icon={item.icon}
                label={item.label}
                value={item.value}
                isLast={index === rightColumnItems.length - 1}
                delay={0.2 + index * 0.1}
                index={index + leftColumnItems.length}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
export default CourseMaterials

function MaterialItem({
  icon,
  label,
  value,
  isLast,
  delay = 0,
  index,
  isInView,
}: {
  icon: string
  label: string
  value: string
  isLast: boolean
  delay?: number
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      className={`flex items-center py-4 border-gray-200 ${!isLast ? "border-b" : ""}`}
      custom={index}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: () => ({
          opacity: 1,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: delay,
          },
        }),
      }}
    >
      <motion.div
        whileTap={{ rotate: -10, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
        animate={
          isInView
            ? {
                opacity: 1,
                scale: 1,
                rotate: 0,
                transition: { delay: delay + 0.1, type: "spring" },
              }
            : {}
        }
      >
        <Icon icon={icon} className="h-7 w-7 mr-3 text-gray-600" />
      </motion.div>
      <motion.span
        className="text-gray-600 text-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={
          isInView
            ? {
                opacity: 1,
                y: 0,
                transition: { delay: delay + 0.2, duration: 0.3 },
              }
            : {}
        }
      >
        {label}:
      </motion.span>
      <motion.span
        className="ml-auto text-gray-700 text-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={
          isInView
            ? {
                opacity: 1,
                x: 0,
                transition: { delay: delay + 0.3, type: "spring" },
              }
            : {}
        }
      >
        {value}
      </motion.span>
    </motion.div>
  )
}
