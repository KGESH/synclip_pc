export const memoryStore = {
  app: {
    isQuit: false,
    setIsQuit: (isQuit: boolean) => {
      memoryStore.app.isQuit = isQuit;
    },
  },
};
