export const scrollTo = (target, options = {}) => {
  const top =
    typeof target === "number"
      ? target
      : document.querySelector(target)?.offsetTop;

  if (top !== undefined) {
    window.scrollTo({ top, behavior: "smooth" });
  }
};
