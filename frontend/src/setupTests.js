import "@testing-library/jest-dom";

// Mock intersection observer for AOS library
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
