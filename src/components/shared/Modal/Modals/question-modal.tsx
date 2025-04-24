"use client";

import { useState, useEffect } from "react"
import { ModalProps } from "@/types/modal"
import Modal from "../modal"

interface QuestionModalProps extends ModalProps {
  props?: {
    onClose?: () => void;
  }
}

const QuestionModal = ({ isOpen, onClose, isMobile }: QuestionModalProps) => {
  const [question, setQuestion] = useState("")

  useEffect(() => {
    if (isOpen) {
      const savedQuestion = localStorage.getItem("savedQuestion")
      if (savedQuestion) {
        setQuestion(savedQuestion)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (question) {
      localStorage.setItem("savedQuestion", question)
    }
  }, [question])

  if (!isOpen) return null

  const handleSubmit = () => {
    setQuestion("")
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isMobile={isMobile}
      title="Ask a Question"
      size="lg"
    >
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full border border-gray-200 rounded-md p-3 min-h-[150px] shadow-sm"
        placeholder="Type your question here..."
      />

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm"
          disabled={!question.trim()}
        >
          Submit Question
        </button>
      </div>
    </Modal>
  )
}

export default QuestionModal 