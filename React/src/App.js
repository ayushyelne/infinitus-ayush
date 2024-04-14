import React from "react";
import "./App.css";
import ChatApp from "./ChatApp";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ textAlign: "center", marginTop: "15px" }}>
          Chat Bot
        </h1>
      </header>
      <ChatApp />
    </div>
  );
}

export default App;
