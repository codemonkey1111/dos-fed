import React from "react";
import Home from "../../components/dao/Home";
import styled from "styled-components";
// import "semantic-ui-css/semantic.min.css";

const Root = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  font-size: 16px;
  color: black;
  text-align: center;
  font-family: "Inter";
`;


const BLUE_NEW = "#107CF1";

const MAIN_THEME = BLUE_NEW;
// Color scheme of a swapping app
const RadialGradient = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  width: 200vw;
  height: 200vh;
  background: radial-gradient(
    50% 50% at 50% 50%,
    #${MAIN_THEME}10 0%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: translate(-50vw, -100vh);
  background-color: #f7f8fa;
  z-index: -1;
`;

function App() {
  return (
    <>
      <RadialGradient />
      <Root>
        <Home />
      </Root>
    </>
  );
}

export default App;
