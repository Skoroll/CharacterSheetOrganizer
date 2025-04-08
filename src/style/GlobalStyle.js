import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --background-color: ${(props) => props.theme.backgroundColor};
    --text-color: ${(props) => props.theme.fontColor};
    --font-size-base: ${(props) => props.theme.fontSize};
    --text-muted: ${(props) => props.theme.textMuted};
    --background-light: ${(props) => props.theme.backgroundLight};
    --background-dark: ${(props) => props.theme.backgroundDark};
    --primary-color: ${(props) => props.theme.primaryColor};
    --text-color-rgb: ${(props) => props.theme.textColorRgb};
    --button-bg: ${(props) => props.theme.buttonBg};
    --background-secondary-color: ${(props) => props.theme.backgroundSecondaryColor};

  }

  body {
    background-color: var(--background-color);
    color: var(--text-color);
    font-size: var(--font-size-base);
    transition: all 0.3s ease;
  }
`;

export default GlobalStyle;
