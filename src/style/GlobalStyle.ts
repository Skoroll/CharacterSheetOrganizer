import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.fontColor};
    font-size: ${(props) => props.theme.fontSize};
    transition: all 0.3s ease;
  }
`;

export default GlobalStyle;
