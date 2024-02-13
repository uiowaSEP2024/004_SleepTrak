// Followed tutorial https://blog.lysender.com/2023/06/jest-react-testing-window-matchmedia-is-not-a-function/
// to prevent TypeError: window.matchMedia is not a function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
  })
});
