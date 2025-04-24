import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import modalReducer from "./features/modalSlice"

const rootReducer = combineReducers({
    modal: modalReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch