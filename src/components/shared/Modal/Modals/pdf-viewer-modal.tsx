"use client";

import { useState, useRef, useEffect } from "react"
import { Icon } from "@iconify/react"
import { Document, Page, pdfjs } from "react-pdf"
import { ModalProps } from "@/types/modal"
import Modal from "../modal"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Required for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

interface PDFViewerModalProps extends ModalProps {
  props?: {
    pdfUrl?: string;
    title?: string;
    onClose?: () => void;
  }
}

const PDFViewerModal = ({ isOpen, onClose, isMobile, props }: PDFViewerModalProps) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [showControls, setShowControls] = useState(true)
  const viewerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      
      setShowControls(true)
      
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    if (isOpen) {
      resetControlsTimeout()
      
      const handleMouseMove = () => resetControlsTimeout()
      
      window.addEventListener('mousemove', handleMouseMove)
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current)
        }
      }
    }
  }, [isOpen])

  if (!isOpen || !props?.pdfUrl) return null

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }

  const changePage = (offset: number) => {
    if (!numPages) return
    const newPage = pageNumber + offset
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage)
    }
  }


  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3.0))
  }

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5))
  }

  const resetZoom = () => {
    setScale(1.0)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isMobile={isMobile}
      title={props?.title || "PDF Document"}
      size="full"
      className="max-h-[95vh] flex flex-col p-0 bg-gray-900 "
    >
      <div className="relative flex-1 overflow-hidden bg-gray-800 text-white" ref={viewerRef}>
        <div 
          className="h-full overflow-auto p-4 flex items-center justify-center"
          style={{ 
            backgroundColor: '#1e1e2d',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          <motion.div 
            className="relative"
            animate={{ scale: scale }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Document
              file={props.pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex flex-col items-center"
              loading={
                <div className="flex flex-col items-center justify-center h-64 text-white">
                  <motion.div
                    animate={{
                      rotate: 360,
                      transition: { repeat: Infinity, duration: 1.5, ease: "linear" }
                    }}
                  >
                    <Icon icon="line-md:loading-twotone-loop" className="w-16 h-16 text-blue-400" />
                  </motion.div>
                  <motion.p 
                    className="mt-4 text-blue-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Loading document...
                  </motion.p>
                </div>
              }
              error={
                <motion.div 
                  className="text-center p-8 text-red-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon icon="line-md:alert-circle" className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl font-semibold mb-2">Failed to load PDF document</p>
                  <p className="text-sm opacity-80">Please check if the file exists and is a valid PDF.</p>
                </motion.div>
              }
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={pageNumber}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={1}
                    className="shadow-2xl rounded-lg overflow-hidden"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                      <div className="w-[595px] h-[842px] bg-gray-800 rounded-lg flex items-center justify-center">
                        <Icon icon="line-md:loading-alt-loop" className="w-10 h-10 text-blue-400" />
                      </div>
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </Document>
          </motion.div>
        </div>

        <AnimatePresence>
          {showControls && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                <motion.button
                  onClick={() => changePage(-1)}
                  disabled={pageNumber <= 1}
                  className={cn(
                    "p-2 rounded-full",
                    pageNumber <= 1 
                      ? "text-gray-500 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                  whileHover={pageNumber > 1 ? { scale: 1.1 } : {}}
                  whileTap={pageNumber > 1 ? { scale: 0.95 } : {}}
                >
                  <Icon icon="mdi:chevron-left" className="w-6 h-6" />
                </motion.button>

                <div className="flex items-center space-x-3">
                  <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    Page {pageNumber} of {numPages || "..."}
                  </div>
                  
                  <div className="flex items-center space-x-1 bg-black/50 rounded-full px-2 py-1">
                    <motion.button 
                      onClick={zoomOut}
                      className="p-1 hover:bg-blue-600/50 rounded-full"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon icon="mdi:minus" className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button 
                      onClick={resetZoom}
                      className="p-1 hover:bg-blue-600/50 rounded-full text-xs font-medium"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {Math.round(scale * 100)}%
                    </motion.button>
                    
                    <motion.button 
                      onClick={zoomIn}
                      className="p-1 hover:bg-blue-600/50 rounded-full"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon icon="mdi:plus" className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  onClick={() => changePage(1)}
                  disabled={numPages !== null && pageNumber >= numPages}
                  className={cn(
                    "p-2 rounded-full",
                    numPages !== null && pageNumber >= numPages 
                      ? "text-gray-500 cursor-not-allowed" 
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                  whileHover={numPages !== null && pageNumber < numPages ? { scale: 1.1 } : {}}
                  whileTap={numPages !== null && pageNumber < numPages ? { scale: 0.95 } : {}}
                >
                  <Icon icon="mdi:chevron-right" className="w-6 h-6" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  )
}

export default PDFViewerModal 