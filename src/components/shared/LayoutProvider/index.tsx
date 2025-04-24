"use client";
import { store } from "@/store"
import { PropsWithChildren } from "react"
import { Provider } from "react-redux"
import ModalProvider from "../Modal/modal-provider"
const LayoutProvider:React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Provider store={store}>
             {children}
             <ModalProvider />
        </Provider>
    )
}
export default LayoutProvider;