import { create } from "zustand"

interface PageLayoutStore {
    isSidebarOpen: boolean,
    isMaintenance: boolean,
    toggleSidebar: () => void,
    setSidebarPosition: (open: boolean) => void
    setIsMaintenance: (isdown: boolean) => void
}

const usePageLayoutStore = create<PageLayoutStore>()((set) => {

    return {
        isSidebarOpen: false,
        isMaintenance: false,
        toggleSidebar: () => {
            set((state) => {
                return {isSidebarOpen: !state.isSidebarOpen}
            })
        },
        setSidebarPosition: (open) => {
            set(() => {
                return {isSidebarOpen: open}
            })
        },
        setIsMaintenance: (isdown) => {
            set(() => {
                return {isMaintenance: isdown}
            })
        }
    }
})

export default usePageLayoutStore