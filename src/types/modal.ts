export enum ModalType {
    UNDEFINED = "UNDEFINED",
    EXAM = "EXAM",
    LEADERBOARD = "LEADERBOARD",
    PDF_VIEWER = "PDF_VIEWER",
    QUESTION = "QUESTION"
}

 interface ModalState {
    type: ModalType
    data: unknown
    props?: Record<string, unknown>
}

 interface ModalProps {
    isOpen: boolean
    onClose: () => void
    data?: unknown
    modalProps?: Record<string, unknown>
    isMobile: boolean;
    props?: Record<string, unknown>
}
export type { ModalProps, ModalState }