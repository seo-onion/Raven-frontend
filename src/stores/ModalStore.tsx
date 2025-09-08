import React from "react"
import { create } from "zustand"

interface ModalStore {
    isModalOpen: boolean,
    modalContent: React.JSX.Element | null,
    setModalContent: (component: React.JSX.Element) => void,
    closeModal: () => void
}

const useModalStore = create<ModalStore>()((set) => {
    return {
        isModalOpen: false,
        modalContent: null,
        setModalContent: (component) => {
            set({modalContent: component, isModalOpen: true})
        },
        closeModal: () => {
            set({modalContent: null, isModalOpen: false})
        }
    }
})

export default useModalStore