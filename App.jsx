import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState } from "react";
import GameMap from "./GameMap.jsx";
import Studio from "./Studio.jsx";
function App() {
  const [currentView, setCurrentView] = useState("map");
  const [selectedTheme, setSelectedTheme] = useState(null);
  const handleSelectTheme = (theme) => {
    setSelectedTheme(theme);
    setCurrentView("studio");
  };
  const handleBackToMap = () => {
    if (confirm("Leave the studio? Your masterpiece will be lost!")) {
      setCurrentView("map");
      setSelectedTheme(null);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full bg-white select-none", children: [
    currentView === "map" && /* @__PURE__ */ jsxDEV(GameMap, { onSelectTheme: handleSelectTheme }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 24,
      columnNumber: 9
    }, this),
    currentView === "studio" && selectedTheme && /* @__PURE__ */ jsxDEV(Studio, { theme: selectedTheme, onBack: handleBackToMap }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 27,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 22,
    columnNumber: 5
  }, this);
}
export {
  App as default
};
