export const playSound = () => {
  const audio = new Audio("/sound/notification.wav");
  audio.play();
};
