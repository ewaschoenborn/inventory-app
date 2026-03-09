import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    height: 100%;
    overflow-x: hidden;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f8f9fa;
    color: var(--color-font-primary);;
    min-height: 100dvh;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  #root {
    min-height: 100dvh;
    min-height: 100vh;
  }

  a {
    text-decoration: none;
    color: #3b82f6;
  }
`;

export default GlobalStyle;
