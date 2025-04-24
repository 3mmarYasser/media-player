"use client"
import { cn } from "@/lib/utils"
import type React from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface ProgressIndicatorProps {
  progress: number
  className?: string
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress, className }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className={cn("relative pt-12 pb-8", className)}>
      <motion.div
        className="absolute -top-2 transform -translate-x-1/2"
        style={{ left: `0%` }}
        initial={{ left: "0%", y: -20, opacity: 0 }}
        animate={
          isInView
            ? {
                left: `${clampedProgress}%`,
                y: 0,
                opacity: 1,
                transition: {
                  left: { duration: 1, delay: 0.5, ease: "easeOut" },
                  y: { duration: 0.5, delay: 0.3 },
                  opacity: { duration: 0.5, delay: 0.3 },
                },
              }
            : {}
        }
      >
        <div className="flex flex-col items-center">
          <motion.div
            className="rounded-full border-3 border-gray-300 bg-white text-indigo-700 w-10 h-10 flex items-center justify-center text-sm font-medium"
            whileHover={{ scale: 1.1, boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.2)" }}
            animate={
              isInView
                ? {
                    y: [0, -5, 0],
                    boxShadow: [
                      "0 0 0 0px rgba(79, 70, 229, 0)",
                      "0 0 0 3px rgba(79, 70, 229, 0.2)",
                      "0 0 0 0px rgba(79, 70, 229, 0)",
                    ],
                    transition: {
                      y: {
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        duration: 1.5,
                        ease: "easeInOut",
                        delay: 1,
                      },
                      boxShadow: {
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        duration: 2,
                        delay: 1,
                      },
                    },
                  }
                : {}
            }
          >
            You
          </motion.div>
          <motion.div
            className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-300 mt-1"
            animate={
              isInView
                ? {
                    y: [0, -3, 0],
                    transition: {
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      duration: 1.5,
                      ease: "easeInOut",
                      delay: 1.1,
                    },
                  }
                : {}
            }
          ></motion.div>
        </div>
      </motion.div>

      <motion.div
        className="h-3 bg-gray-200 rounded-full overflow-hidden"
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-full bg-green-500 rounded-full"
          style={{ width: "0%" }}
          initial={{ width: "0%" }}
          animate={isInView ? { width: `${clampedProgress}%` } : {}}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: "easeOut",
          }}
        />
      </motion.div>

      <motion.div
        className="absolute text-indigo-700 font-medium mt-2"
        style={{ left: `0%`, transform: "translateX(-50%)" }}
        initial={{ opacity: 0, y: 10, left: "0%" }}
        animate={
          isInView
            ? {
                opacity: 1,
                y: 0,
                left: `calc(${clampedProgress}% - 10px)`,
                transition: {
                  opacity: { duration: 0.5, delay: 1.5 },
                  y: { duration: 0.5, delay: 1.5 },
                  left: { duration: 1, delay: 0.5, ease: "easeOut" },
                },
              }
            : {}
        }
      >
        <motion.span
          animate={
            isInView
              ? {
                  scale: [1, 1.2, 1],
                  color: ["rgb(67, 56, 202)", "rgb(79, 70, 229)", "rgb(67, 56, 202)"],
                  transition: {
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    duration: 1.5,
                    delay: 1.5,
                  },
                }
              : {}
          }
        >
          {clampedProgress}%
        </motion.span>
      </motion.div>
    </div>
  )
}
export default ProgressIndicator
