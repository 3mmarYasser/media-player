"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Icon } from "@iconify/react"
import { courseComments, type Comment } from "@/data/comments"
import { motion, AnimatePresence, useInView } from "framer-motion"

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    setComments(courseComments)
  }, [])

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now(),
      name: "You",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      content: newComment,
      avatar: "/placeholder.svg",
    }

    setComments([...comments, comment])
    setNewComment("")
  }

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

  const commentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: i * 0.1,
      },
    }),
  }

  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.5,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.h2 className="text-2xl font-bold mb-8" variants={titleVariants}>
        Comments
      </motion.h2>

      <motion.div className="space-y-0" variants={containerVariants}>
        <AnimatePresence>
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              className="py-6 border-b border-gray-200 last:border-0"
              custom={index}
              variants={commentVariants}
            >
              <div className="flex gap-4">
                <motion.div
                  className="flex-shrink-0 w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          scale: 1,
                          transition: { delay: 0.1 + index * 0.1, type: "spring" },
                        }
                      : {}
                  }
                >
                  <Image
                    src={comment.avatar ? comment.avatar : "/placeholder.svg"}
                    alt={comment.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                </motion.div>
                <div className="flex-grow">
                  <div className="flex flex-col">
                    <motion.h3
                      className="font-medium text-gray-900"
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isInView
                          ? {
                              opacity: 1,
                              x: 0,
                              transition: { delay: 0.2 + index * 0.1, duration: 0.3 },
                            }
                          : {}
                      }
                    >
                      {comment.name}
                    </motion.h3>
                    <motion.span
                      className="text-sm text-gray-400 mb-2"
                      initial={{ opacity: 0 }}
                      animate={
                        isInView
                          ? {
                              opacity: 1,
                              transition: { delay: 0.3 + index * 0.1, duration: 0.3 },
                            }
                          : {}
                      }
                    >
                      {comment.date}
                    </motion.span>
                  </div>
                  <motion.p
                    className="text-gray-500 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={
                      isInView
                        ? {
                            opacity: 1,
                            y: 0,
                            transition: { delay: 0.4 + index * 0.1, duration: 0.3 },
                          }
                        : {}
                    }
                  >
                    {comment.content}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.form onSubmit={handleSubmitComment} className="mt-4" variants={formVariants}>
        <div className="p-4">
          <motion.textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-white shadow-md rounded-md border-none p-4 min-h-[180px] focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400"
            whileFocus={{
              boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.2)",
              scale: 1.01,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.6, type: "spring" },
                  }
                : {}
            }
          />
          <motion.button
            type="submit"
            className="bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors flex items-center shadow-sm font-medium"
            disabled={!newComment.trim()}
            whileHover={{ scale: 1.05, backgroundColor: "#0f766e" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.7, type: "spring" },
                  }
                : {}
            }
          >
            <span className="mr-2">Submit Review</span>
            <motion.div
              animate={{
                x: [0, 5, 0],
                transition: {
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  duration: 1,
                },
              }}
            >
              <Icon icon="line-md:arrow-right" width={18} height={18} />
            </motion.div>
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  )
}
export default Comments
