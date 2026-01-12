import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useRef, useEffect } from "react";
import { Player } from "@websim/remotion/player";
import { MyComposition } from "./composition.jsx";
import { Camera, Image as ImageIcon, Mic, Wand2, Play, Pause, Trash2, Plus, ArrowLeft, CheckCircle2 } from "lucide-react";
function Studio({ theme, onBack }) {
  const [scenes, setScenes] = useState([]);
  const [selectedSceneId, setSelectedSceneId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  useEffect(() => {
    addScene();
  }, []);
  const addScene = () => {
    const newScene = {
      id: Date.now(),
      duration: 3,
      // seconds
      bgUrl: null,
      stickerUrl: null,
      audioUrl: null,
      camUrl: null,
      text: ""
    };
    setScenes((prev) => [...prev, newScene]);
    setSelectedSceneId(newScene.id);
  };
  const updateScene = (id, updates) => {
    setScenes((prev) => prev.map((s) => s.id === id ? { ...s, ...updates } : s));
  };
  const getSelectedScene = () => scenes.find((s) => s.id === selectedSceneId);
  const generateBackground = async () => {
    const scene = getSelectedScene();
    if (!scene) return;
    setLoadingAction("Painting background...");
    try {
      const result = await websim.imageGen({
        prompt: `${theme.prompt_style}, background scenery, empty, high quality, colorful`,
        aspect_ratio: aspectRatio
      });
      updateScene(scene.id, { bgUrl: result.url });
    } catch (e) {
      console.error(e);
    }
    setLoadingAction(null);
  };
  const generateSticker = async () => {
    const scene = getSelectedScene();
    if (!scene) return;
    setLoadingAction("Creating character...");
    try {
      const idea = await websim.chat.completions.create({
        messages: [{ role: "user", content: `Give me 1 single noun for a cute character/object that fits the theme "${theme.name}". No other text.` }]
      });
      const noun = idea.content.trim();
      const result = await websim.imageGen({
        prompt: `cute ${noun}, sticker, vector art, white outline`,
        transparent: true
      });
      updateScene(scene.id, { stickerUrl: result.url });
    } catch (e) {
      console.error(e);
    }
    setLoadingAction(null);
  };
  const generateTTS = async () => {
    const scene = getSelectedScene();
    if (!scene) return;
    const text = prompt("What should the narrator say?");
    if (!text) return;
    setLoadingAction("Recording voice...");
    try {
      const result = await websim.textToSpeech({
        text,
        voice: "en-female"
        // default cute voice
      });
      updateScene(scene.id, { audioUrl: result.url, text });
    } catch (e) {
      console.error(e);
    }
    setLoadingAction(null);
  };
  const toggleCamera = async () => {
    const scene = getSelectedScene();
    if (!scene) return;
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          updateScene(scene.id, { camUrl: url });
          stream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (e) {
        alert("Camera access denied or not available.");
      }
    }
  };
  const totalDuration = scenes.reduce((acc, s) => acc + s.duration * 30, 0) || 30;
  const [w, h] = aspectRatio === "16:9" ? [1920, 1080] : [1080, 1920];
  return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col h-full bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "h-14 bg-white border-b flex items-center px-4 justify-between shrink-0 z-20", children: [
      /* @__PURE__ */ jsxDEV("button", { onClick: onBack, className: "p-2 rounded-full hover:bg-gray-100", children: /* @__PURE__ */ jsxDEV(ArrowLeft, { size: 20, className: "text-gray-600" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 152,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 151,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "font-bold text-gray-700", children: [
        theme.name,
        " Studio"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 154,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          value: aspectRatio,
          onChange: (e) => setAspectRatio(e.target.value),
          className: "text-xs bg-gray-100 p-2 rounded-lg",
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "9:16", children: "Portrait" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 160,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "16:9", children: "Landscape" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 161,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 155,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 150,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 relative flex items-center justify-center bg-gray-200 overflow-hidden", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "relative shadow-2xl", style: {
        aspectRatio: aspectRatio.replace(":", "/"),
        height: aspectRatio === "9:16" ? "90%" : "auto",
        width: aspectRatio === "16:9" ? "95%" : "auto",
        maxHeight: "90%",
        maxWidth: "95%"
      }, children: [
        scenes.length > 0 ? /* @__PURE__ */ jsxDEV(
          Player,
          {
            component: MyComposition,
            durationInFrames: totalDuration,
            fps: 30,
            compositionWidth: w,
            compositionHeight: h,
            inputProps: { scenes },
            controls: true,
            style: { width: "100%", height: "100%" }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 175,
            columnNumber: 13
          },
          this
        ) : /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full bg-white flex items-center justify-center text-gray-400", children: "No scenes" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 186,
          columnNumber: 14
        }, this),
        /* @__PURE__ */ jsxDEV(
          "video",
          {
            ref: videoRef,
            muted: true,
            className: `absolute bottom-4 right-4 w-32 h-32 object-cover rounded-full border-4 border-red-500 z-50 ${isRecording ? "block" : "hidden"}`
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 190,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 167,
        columnNumber: 9
      }, this),
      loadingAction && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50 text-white backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 199,
          columnNumber: 14
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-lg", children: loadingAction }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 200,
          columnNumber: 14
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 198,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 166,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "h-64 bg-white border-t shrink-0 flex flex-col shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "h-24 bg-gray-50 flex items-center px-4 gap-3 overflow-x-auto scrollbar-hide border-b", children: [
        scenes.map((scene, i) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setSelectedSceneId(scene.id),
            className: `relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedSceneId === scene.id ? "border-blue-500 scale-110 shadow-md" : "border-gray-200 opacity-70"}`,
            children: [
              scene.bgUrl ? /* @__PURE__ */ jsxDEV("img", { src: scene.bgUrl, className: "w-full h-full object-cover" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 217,
                columnNumber: 17
              }, this) : /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400", children: "Empty" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 219,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-0 right-0 bg-black/50 text-white text-[10px] px-1", children: i + 1 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 221,
                columnNumber: 15
              }, this)
            ]
          },
          scene.id,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 211,
            columnNumber: 13
          },
          this
        )),
        /* @__PURE__ */ jsxDEV("button", { onClick: addScene, className: "flex-shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-blue-300", children: /* @__PURE__ */ jsxDEV(Plus, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 225,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 224,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 209,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 p-4", children: selectedSceneId ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-4 gap-2 h-full", children: [
        /* @__PURE__ */ jsxDEV(
          ToolButton,
          {
            icon: ImageIcon,
            label: "Background",
            color: "bg-purple-100 text-purple-600",
            onClick: generateBackground
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 233,
            columnNumber: 17
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ToolButton,
          {
            icon: Wand2,
            label: "Sticker",
            color: "bg-pink-100 text-pink-600",
            onClick: generateSticker
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 239,
            columnNumber: 17
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ToolButton,
          {
            icon: Mic,
            label: "Voice",
            color: "bg-orange-100 text-orange-600",
            onClick: generateTTS
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 245,
            columnNumber: 17
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ToolButton,
          {
            icon: isRecording ? CheckCircle2 : Camera,
            label: isRecording ? "Stop" : "Cameo",
            color: isRecording ? "bg-red-500 text-white animate-pulse" : "bg-blue-100 text-blue-600",
            onClick: toggleCamera
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 251,
            columnNumber: 17
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 232,
        columnNumber: 15
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center h-full text-gray-400", children: "Select a scene to edit" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 259,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 230,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 206,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 147,
    columnNumber: 5
  }, this);
}
const ToolButton = ({ icon: Icon, label, color, onClick }) => /* @__PURE__ */ jsxDEV(
  "button",
  {
    onClick,
    className: `flex flex-col items-center justify-center rounded-2xl ${color} active:scale-95 transition-transform`,
    children: [
      /* @__PURE__ */ jsxDEV(Icon, { size: 24, className: "mb-1" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 272,
        columnNumber: 5
      }),
      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold uppercase tracking-wide", children: label }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 273,
        columnNumber: 5
      })
    ]
  },
  void 0,
  true,
  {
    fileName: "<stdin>",
    lineNumber: 268,
    columnNumber: 3
  }
);
export {
  Studio as default
};
