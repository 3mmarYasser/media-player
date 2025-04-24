import { ModalState, ModalType } from "@/types/modal"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const initialState: ModalState = {
    type: ModalType.UNDEFINED,
    data: null,
    props: {},
}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openModal: (
            state,
            action: PayloadAction<{
                type: ModalType
                data?: unknown
                props?: Record<string, unknown>
            }>,
        ) => {
            state.type = action.payload.type
            state.data = action.payload.data ?? null
            state.props = action.payload.props ?? {}
        },
        closeModal: (state) => {
            state.type = ModalType.UNDEFINED
            state.data = null
            state.props = {}
        },
    },
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer