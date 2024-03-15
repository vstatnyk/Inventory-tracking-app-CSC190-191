export default {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom", "<rootDir>/config/FirebaseConfig.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.svg$": "identity-obj-proxy",
    "swiper\\/(.*)": "identity-obj-proxy",
    "\\/images\\/(.*)": "identity-obj-proxy",
  },
};
