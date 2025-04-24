"use client";
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import { ModalType } from "@/types/modal"
import ExamModal from "./Modals/exam-modal"
import LeaderboardModal from "./Modals/leaderboard-modal"
import PDFViewerModal from "./Modals/pdf-viewer-modal"
import QuestionModal from "./Modals/question-modal"
import { closeModal } from "@/store/features/modalSlice";
import { RootState } from "@/store";


const mobileVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { y: "100%", opacity: 0, transition: { duration: 0.2 } },
}
const desktopVariants = {
    hidden: {
        scale: 0.7,
        opacity: 0,
        y: 100,
        rotateX: 30,
    },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            type: "spring",
            damping: 18,
            stiffness: 250,
        },
    },
    exit: {
        scale: 0.8,
        opacity: 0,
        y: -100,
        rotateX: -20,
        transition: {
            type: "spring",
            damping: 10,
            stiffness: 200,
        },
    },
}

const modalComponents = {
    [ModalType.EXAM]: ExamModal,
    [ModalType.LEADERBOARD]: LeaderboardModal,
    [ModalType.PDF_VIEWER]: PDFViewerModal,
    [ModalType.QUESTION]: QuestionModal
}



const ModalProvider = () => {
    const { type, data, props } = useSelector((state: RootState) => state.modal)
    const [isMounted, setIsMounted] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setIsMounted(true)
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    if (!isMounted) return null

    const ModalComponent = modalComponents[type as keyof typeof modalComponents]
    const handleClose = () => {
        if (props?.onClose && typeof props.onClose === "function") {
            props.onClose();
        }
        dispatch(closeModal())
    }
    
    return (
        <AnimatePresence mode="wait">
            {type && ModalComponent && (
                <motion.div
                    key="modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={handleClose}

                >
                    <motion.div
                        key="modal-content"
                        variants={isMobile ? mobileVariants : desktopVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit" 
                        className="w-full h-full flex items-center justify-center"
                    >
                        <ModalComponent 
                            isOpen={!!type} 
                            onClose={handleClose} 
                            isMobile={isMobile} 
                            data={data}
                            props={props}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ModalProvider