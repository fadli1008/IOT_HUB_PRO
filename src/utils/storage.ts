export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(`iothub_${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`iothub_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage set failed', e);
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(`iothub_${key}`);
    } catch (e) {
      console.warn('Storage remove failed', e);
    }
  }
};
