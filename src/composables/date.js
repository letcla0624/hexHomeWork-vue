export const date = (time) => {
  const localDate = new Date(time * 1000);
  return localDate.toLocaleDateString();
};
