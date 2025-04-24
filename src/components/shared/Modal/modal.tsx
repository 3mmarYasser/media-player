import type React from "react"
import { motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { Icon } from "@iconify/react"
import { ModalProps } from "@/types/modal"
import { AppDispatch } from "@/store"
import { closeModal } from "@/store/features/modalSlice"
import { cn } from "@/lib/utils"

interface Props extends ModalProps {
    title?: string
    children: React.ReactNode
    showClose?: boolean
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"
    className?: string
    isOpen: boolean
    onClose: () => void
    isMobile: boolean
    showInnerPadding?: boolean
}

const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    full: "max-w-[90vw]",
}

const Modal: React.FC<Props> = ({
    title,
    children,
    showClose = true,
    size = "md",
    className,
    isOpen,
    onClose,
    isMobile,
    showInnerPadding = true
}) => {
    const dispatch: AppDispatch = useDispatch()

    if (!isOpen) return null;

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (delay: number = 0) => ({
            opacity: 1,
            y: 0,
            transition: { delay, duration: 0.3 }
        }),
        exit: {
            opacity: 0,
            y: 10,
            transition: { duration: 0.15 }
        }
    };

    const underlineVariants = {
        hidden: { scaleX: 0 },
        visible: { scaleX: 1, transition: { delay: 0.3, duration: 0.4 } },
        exit: { scaleX: 0, transition: { duration: 0.2 } }
    }

    return (
        <div
        onClick={(e) => e.stopPropagation()}
          className={`w-full max-h-[90vh] bg-white shadow-xl flex flex-col  
                     ${isMobile ? 'fixed bottom-0 left-0 right-0 rounded-t-lg' : `md:relative rounded-lg ${sizeClasses[size]}`}
                     ${className || ""}`}
          >
            {isMobile && (
              <div className={cn("w-full flex justify-center ", { "pt-2 pb-1" :showInnerPadding})}>
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>
            )}
            
          {showInnerPadding && (
              <div className="flex items-center justify-between py-3 px-6 relative rounded-t-lg">
                {showClose && (
                <motion.button
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={0.2}
                    onClick={() => {
                      onClose()
                      dispatch(closeModal())
                    }}
                    className={`absolute cursor-pointer -top-2 text-white bg-red-600 hover:bg-red-700 rounded-full text-sm w-6 h-6 inline-flex justify-center items-center z-10 ${isMobile ? 'hidden' : '-right-2'}`}
                    aria-label="Close modal"
                >
                    <Icon icon="icon-park-outline:close" width={16} height={16} />
                </motion.button>
                )}

                {title && (
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={0.1}
                    className="w-full flex"
                >
                    <div className="relative">
                    <h3 className="text-lg font-semibold text-left">{title}</h3>
                    <motion.div
                       variants={underlineVariants}
                       initial="hidden"
                       animate="visible"
                       exit="exit"
                       className="absolute bottom-[-8px] right-0 h-[3px] w-full bg-gradient-to-r from-teal-600 via-teal-500 to-indigo-600 rounded-full origin-left"
                    />
                    </div>
                </motion.div>
                )}
            </div>)
            
            }

            <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={0.25}
                className={cn(" space-y-4 flex-grow overflow-y-auto", { "p-4" :showInnerPadding}) }
            >
                {children}
            </motion.div>
        </div>
    )
}

export default Modal