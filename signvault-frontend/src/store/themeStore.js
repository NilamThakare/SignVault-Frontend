import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDark: localStorage.getItem('signvault_theme') !== 'light',
  toggleTheme: () => set((state) => {
    const newIsDark = !state.isDark;
    localStorage.setItem('signvault_theme', newIsDark ? 'dark' : 'light');
    if (newIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDark: newIsDark };
  }),
}));

export default useThemeStore;