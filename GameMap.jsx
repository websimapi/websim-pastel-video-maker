import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import { Map, Sparkles, Loader2 } from "lucide-react";
const MapNode = ({ theme, onClick }) => /* @__PURE__ */ jsxDEV(
  "button",
  {
    onClick: () => onClick(theme),
    className: "relative group flex flex-col items-center justify-center p-4 m-2 animate-bounce-soft transition-transform active:scale-95",
    children: [
      /* @__PURE__ */ jsxDEV("div", { className: `w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl bg-gradient-to-br ${theme.color}`, children: theme.emoji }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 9,
        columnNumber: 5
      }),
      /* @__PURE__ */ jsxDEV("div", { className: "mt-2 bg-white px-3 py-1 rounded-full text-sm font-bold text-gray-600 shadow-sm border-2 border-gray-100", children: theme.name }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 12,
        columnNumber: 5
      })
    ]
  },
  void 0,
  true,
  {
    fileName: "<stdin>",
    lineNumber: 5,
    columnNumber: 3
  }
);
function GameMap({ onSelectTheme }) {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    generateThemes();
  }, []);
  const generateThemes = async () => {
    setLoading(true);
    try {
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Generate 6 distinct, cute, and fun video themes for a kid-friendly video maker game. 
            Respond ONLY with a JSON object containing an array of themes.
            Schema: { "themes": [{ "name": string, "emoji": string, "prompt_style": string, "color": "from-color-number to-color-number (tailwind classes)" }] }
            Example colors: "from-pink-300 to-purple-300", "from-yellow-300 to-orange-300", "from-blue-300 to-cyan-300"
            Make them varied: Space, Volcano, Candy City, Underwater, etc.`
          }
        ],
        json: true
      });
      const data = JSON.parse(completion.content);
      setThemes(data.themes);
    } catch (e) {
      setThemes([
        { name: "Candy Kingdom", emoji: "\u{1F36D}", prompt_style: "pastel candy land, cute 3d render", color: "from-pink-300 to-purple-300" },
        { name: "Dino Valley", emoji: "\u{1F996}", prompt_style: "cartoon prehistoric jungle, soft lighting", color: "from-green-300 to-emerald-500" },
        { name: "Space Hop", emoji: "\u{1F680}", prompt_style: "kawaii space, stars, planets, pastel", color: "from-indigo-300 to-purple-400" }
      ]);
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full bg-blue-50 relative overflow-y-auto", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 pointer-events-none opacity-20", style: {
      backgroundImage: "radial-gradient(circle, #85C1E9 10%, transparent 10%)",
      backgroundSize: "30px 30px"
    } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 59,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 p-6 flex flex-col items-center", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-4xl font-black text-blue-500 mb-2 drop-shadow-sm text-center", children: "Adventure Map" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 65,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-gray-500 mb-8 font-medium", children: "Where do you want to film today?" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 68,
        columnNumber: 9
      }, this),
      loading ? /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center mt-20", children: [
        /* @__PURE__ */ jsxDEV(Loader2, { className: "w-12 h-12 text-blue-400 animate-spin" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 72,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "mt-4 text-blue-400 font-bold", children: "Scouting locations..." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 73,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 71,
        columnNumber: 11
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "flex flex-wrap justify-center max-w-md pb-20", children: [
        themes.map((t, i) => /* @__PURE__ */ jsxDEV(MapNode, { theme: t, onClick: onSelectTheme }, i, false, {
          fileName: "<stdin>",
          lineNumber: 79,
          columnNumber: 16
        }, this)),
        /* @__PURE__ */ jsxDEV("button", { onClick: generateThemes, className: "mt-8 px-6 py-3 bg-white rounded-full font-bold text-blue-400 shadow-md flex items-center gap-2 active:scale-95 transition-transform", children: [
          /* @__PURE__ */ jsxDEV(Sparkles, { size: 18 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 83,
            columnNumber: 16
          }, this),
          "Find New Worlds"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 82,
          columnNumber: 14
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 76,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 64,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 57,
    columnNumber: 5
  }, this);
}
export {
  GameMap as default
};
