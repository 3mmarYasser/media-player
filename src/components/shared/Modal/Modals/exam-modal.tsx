"use client";

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { ModalProps } from "@/types/modal"
import Modal from "../modal"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number // index of the correct option
}

interface ExamModalProps extends ModalProps {
  props?: {
    examTitle?: string
    examId?: string
    questions?: Question[]
    timeLimit?: number // in seconds
    onClose?: () => void
  }
}

const ExamModal = ({ isOpen, onClose, isMobile, props }: ExamModalProps) => {
  const examId = props?.examId || "default-exam"
  const questions = props?.questions || []
  const timeLimit = props?.timeLimit || 600 // Default 10 minutes

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [examComplete, setExamComplete] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (isOpen) {
      const savedProgress = sessionStorage.getItem(`exam_${examId}_progress`)
      const savedTime = sessionStorage.getItem(`exam_${examId}_time`)

      if (savedProgress) {
        try {
          setSelectedAnswers(JSON.parse(savedProgress))
        } catch (e) {
          console.error("Failed to parse saved exam progress", e)
        }
      }

      if (savedTime) {
        const parsedTime = parseInt(savedTime, 10)
        if (!isNaN(parsedTime) && parsedTime > 0) {
          setTimeRemaining(parsedTime)
        }
      }
    }
  }, [isOpen, examId])

  useEffect(() => {
    if (Object.keys(selectedAnswers).length > 0) {
      sessionStorage.setItem(`exam_${examId}_progress`, JSON.stringify(selectedAnswers))
    }
  }, [selectedAnswers, examId])

  useEffect(() => {
    if (!isOpen || examComplete) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1
        sessionStorage.setItem(`exam_${examId}_time`, newTime.toString())
        
        if (newTime <= 0) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, examComplete, examId])

  if (!isOpen || !questions.length) return null

  const currentQuestion = questions[currentQuestionIndex]

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionIndex,
    })
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    
    let correctAnswers = 0
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })
    
    const finalScore = Math.round((correctAnswers / questions.length) * 100)
    setScore(finalScore)
    
    sessionStorage.removeItem(`exam_${examId}_progress`)
    sessionStorage.removeItem(`exam_${examId}_time`)
    
    localStorage.setItem(`exam_${examId}_completed`, "true")
    localStorage.setItem(`exam_${examId}_score`, finalScore.toString())
    
    setExamComplete(true)
    setIsSubmitting(false)
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      isMobile={isMobile}
      showClose={false}
      showInnerPadding={false}
      size="md"
      className="!p-0"
    >
      <motion.div 
        className="bg-indigo-600 flex flex-col h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-indigo-700 p-4 flex items-center justify-between text-white">
          <button 
            onClick={onClose} 
            className="flex items-center" 
            aria-label="Back"
          >
            <Icon icon="icon-park-outline:left" className="h-5 w-5 mr-1" />
            <span>Back</span>
          </button>
          <motion.div 
            className="text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            <motion.div 
              className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md"
              animate={{ 
                scale: timeRemaining <= 30 ? [1, 1.05, 1] : 1,
              }}
              transition={{ 
                repeat: timeRemaining <= 30 ? Infinity : 0, 
                duration: 0.5 
              }}
            >
              <Icon icon="mdi:clock-outline" className="inline-block mr-1" />
              {formatTime(timeRemaining)}
            </motion.div>
          </motion.div>
          <div className="w-20"></div> 
        </div>

        <div className="bg-indigo-600 p-4 flex justify-center space-x-4 overflow-x-auto">
          {questions.map((question, index) => (
            <motion.button
              key={question.id}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white border-2",
                currentQuestionIndex === index
                  ? "bg-white text-indigo-600 border-white font-medium"
                  : selectedAnswers[question.id] !== undefined
                  ? "bg-indigo-500 border-indigo-400"
                  : "border-white/50"
              )}
              onClick={() => setCurrentQuestionIndex(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                scale: currentQuestionIndex === index ? 1.1 : 1,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              {index + 1}
            </motion.button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-t-3xl p-6 overflow-y-auto">
          {examComplete ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 720 }}
                transition={{ type: "spring", damping: 15, delay: 0.3 }}
              >
                {score >= 70 ? (
                  <Icon icon="mdi:trophy" className="text-yellow-500 text-6xl mx-auto mb-4" />
                ) : (
                  <Icon icon="mdi:emoticon-sad" className="text-gray-400 text-6xl mx-auto mb-4" />
                )}
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-4">Exam Complete!</h2>
              
              <motion.div 
                className="text-5xl font-bold text-indigo-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {score}%
              </motion.div>
              
              <p className="mb-8 text-gray-600">
                {score >= 70
                  ? "Great job! You passed the exam."
                  : "You didn't pass this time. Review the material and try again."}
              </p>
              
              <motion.button
                onClick={onClose}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Return to Course
              </motion.button>
            </motion.div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <h2 className="text-xl font-bold mb-6">{`${currentQuestionIndex + 1}. ${currentQuestion.question}`}</h2>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <motion.button
                        key={index}
                        className={cn(
                          "w-full p-4 text-left rounded-lg border transition-colors shadow-sm flex items-center",
                          selectedAnswers[currentQuestion.id] === index
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        )}
                        onClick={() => handleSelectOption(index)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        whileHover={{ scale: 1.01, transition: { duration: 0.1 } }}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded mr-3 flex-shrink-0 flex items-center justify-center border",
                          selectedAnswers[currentQuestion.id] === index
                            ? "bg-white border-white"
                            : "border-gray-300"
                        )}>
                          {selectedAnswers[currentQuestion.id] === index && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-3 h-3 bg-indigo-600 rounded-sm"
                            />
                          )}
                        </div>
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between">
                <motion.button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium disabled:opacity-50 shadow-sm"
                  whileHover={currentQuestionIndex !== 0 ? { scale: 1.05 } : {}}
                  whileTap={currentQuestionIndex !== 0 ? { scale: 0.95 } : {}}
                >
                  Previous
                </motion.button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <motion.button
                    onClick={handleSubmit}
                    disabled={Object.keys(selectedAnswers).length !== questions.length || isSubmitting}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 shadow-sm"
                    whileHover={Object.keys(selectedAnswers).length === questions.length && !isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={Object.keys(selectedAnswers).length === questions.length && !isSubmitting ? { scale: 0.95 } : {}}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleNextQuestion}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                  </motion.button>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </Modal>
  )
}

export default ExamModal 