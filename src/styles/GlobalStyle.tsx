import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(135deg, #f0f4f8, #4d6c91ff);
    color: #1f2937;
  }

  a {
    text-decoration: none;
    color: #3b82f6;
  }
`;



export default GlobalStyle;
