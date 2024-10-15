import DOMPurify from "dompurify";

const makeClearValue = (value) => {
  if (typeof value === "string") {
    return DOMPurify.sanitize(value);
  }
  return value;
};

export { makeClearValue };
