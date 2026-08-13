import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'dark' | 'light'
  isSidebarOpen: boolean
  toggleTheme: () => void
  toggleSidebar: () => void
  setTheme: (theme: 'dark' | 'light') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark', // Default to premium dark theme
      isSidebarOpen: true,
      toggleTheme: () => set((state) => {
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark'
        updateThemeClass(nextTheme)
        return { theme: nextTheme }
      }),
      setTheme: (theme) => {
        updateThemeClass(theme)
        set({ theme })
      },
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'morning-insight-ui',
    }
  )
)

// Helper to update the HTML class for Tailwind dark mode
export function updateThemeClass(theme: 'dark' | 'light') {
  const root = window.document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    root.classList.add('light')
    root.classList.remove('dark')
  }
}
