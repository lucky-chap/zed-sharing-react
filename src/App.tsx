import React from "react";
import styled from "styled-components";
import adapter from "webrtc-adapter";
import Sharing from "./pages/Sharing";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

const Wrapper = styled.div`
  height: 100%;
  background-color: #111827;
  min-height: 100vh;
`;

const App = (): React.ReactElement => {
  // Do not remove this console statement, it includes webrtc-adapter in the app
  // eslint-disable-next-line no-console
  console.log("Browser type", adapter.browserDetails.browser);

  return (
    <Wrapper>
      <Navbar />
      <Sharing />
      <Footer />
    </Wrapper>
  );
};

export default App;
