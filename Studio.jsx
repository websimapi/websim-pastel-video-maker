import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useRef, useEffect } from "react";
import { Player } from "@websim/remotion/player";
import { MyComposition } from "./composition.jsx";
import { Camera, Image as ImageIcon, Mic, Wand2, Play, Pause, Trash2, Plus, ArrowLeft, CheckCircle2, Timer, MousePointer2 } from "lucide-react";
const playSound = (src) => {
  const audio = new Audio(src);
  audio.play().catch((e) => console.warn("Audio play blocked", e));
};
function Studio({ theme, onBack }) {
  const [scenes, setScenes] = useState([]);
  const [selectedSceneId, setSelectedSceneId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const previewRef = useRef(null);
  const playerRef = useRef(null);
  const pathCaptureRef = useRef([]);
  useEffect(() => {
    addScene();
  }, []);
  const addScene = () => {
    playSound("pop.mp3");
    const newScene = {
      id: Date.now(),
      duration: 3,
      bgUrl: null,
      stickerUrl: null,
      stickerPos: { x: 50, y: 50 },
      stickerPath: [],
      // Array of {t, x, y}
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
      playSound("sparkle.mp3");
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
      updateScene(scene.id, { stickerUrl: result.url, stickerPath: [] });
      playSound("sparkle.mp3");
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
      const result = await websim.textToSpeech({ text, voice: "en-female" });
      updateScene(scene.id, { audioUrl: result.url, text });
      playSound("sparkle.mp3");
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
      playSound("click.mp3");
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
        alert("Camera access denied.");
      }
    }
  };
  const handleStartDrag = (e) => {
    if (!selectedSceneId || !getSelectedScene()?.stickerUrl) return;
    setIsDragging(true);
    pathCaptureRef.current = [];
    handleDrag(e);
  };
  const handleDrag = (e) => {
    if (!isDragging || !selectedSceneId) return;
    const rect = previewRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.max(0, Math.min(100, (clientX - rect.left) / rect.width * 100));
    const y = Math.max(0, Math.min(100, (clientY - rect.top) / rect.height * 100));
    if (playerRef.current) {
      const globalFrame = playerRef.current.getCurrentFrame();
      const sceneIndex = scenes.findIndex((s) => s.id === selectedSceneId);
      let sceneStartFrame = 0;
      for (let i = 0; i < sceneIndex; i++) {
        sceneStartFrame += scenes[i].duration * 30 + 15;
      }
      const localFrame = globalFrame - sceneStartFrame;
      const sceneFrames = getSelectedScene().duration * 30;
      const t = Math.max(0, Math.min(1, localFrame / sceneFrames));
      pathCaptureRef.current.push({ t, x, y });
      updateScene(selectedSceneId, { stickerPos: { x, y } });
    }
  };
  const handleEndDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (pathCaptureRef.current.length > 2) {
      const sortedPath = [...pathCaptureRef.current].sort((a, b) => a.t - b.t);
      updateScene(selectedSceneId, { stickerPath: sortedPath });
      playSound("click.mp3");
    }
  };
  const totalDuration = scenes.reduce((acc, s, i) => {
    const dur = s.duration * 30;
    const transition = i < scenes.length - 1 ? 15 : 0;
    return acc + dur + transition;
  }, 0) || 30;
  const [w, h] = aspectRatio === "16:9" ? [1920, 1080] : [1080, 1920];
  return /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col h-full bg-gray-50 overflow-hidden", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "h-14 bg-white border-b flex items-center px-4 justify-between shrink-0 z-20", children: [
      /* @__PURE__ */ jsxDEV("button", { onClick: onBack, className: "p-2 rounded-full hover:bg-gray-100", children: /* @__PURE__ */ jsxDEV(ArrowLeft, { size: 20, className: "text-gray-600" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 201,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 200,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "font-bold text-gray-700 flex items-center gap-2", children: [
        theme.emoji,
        " ",
        theme.name,
        " Studio"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 203,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "select",
        {
          value: aspectRatio,
          onChange: (e) => setAspectRatio(e.target.value),
          className: "text-xs bg-gray-100 p-2 rounded-lg outline-none",
          children: [
            /* @__PURE__ */ jsxDEV("option", { value: "9:16", children: "Portrait (9:16)" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 211,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("option", { value: "16:9", children: "Landscape (16:9)" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 212,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 206,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 199,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 relative flex items-center justify-center bg-[#f0f0f0] overflow-hidden", children: [
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          ref: previewRef,
          className: "relative shadow-2xl overflow-hidden bg-black",
          style: {
            aspectRatio: aspectRatio.replace(":", "/"),
            height: aspectRatio === "9:16" ? "90%" : "auto",
            width: aspectRatio === "16:9" ? "95%" : "auto",
            maxHeight: "90%",
            maxWidth: "95%"
          },
          onMouseDown: handleStartDrag,
          onMouseMove: handleDrag,
          onMouseUp: handleEndDrag,
          onMouseLeave: handleEndDrag,
          onTouchStart: handleStartDrag,
          onTouchMove: handleDrag,
          onTouchEnd: handleEndDrag,
          children: [
            scenes.length > 0 && /* @__PURE__ */ jsxDEV(
              Player,
              {
                ref: playerRef,
                component: MyComposition,
                durationInFrames: Math.max(1, Math.floor(totalDuration)),
                fps: 30,
                compositionWidth: w,
                compositionHeight: h,
                inputProps: { scenes },
                controls: true,
                loop: true,
                autoPlay: true,
                style: { width: "100%", height: "100%", pointerEvents: isDragging ? "none" : "auto" }
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 237,
                columnNumber: 13
              },
              this
            ),
            isDragging && /* @__PURE__ */ jsxDEV("div", { className: "absolute top-4 left-4 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full animate-pulse z-50", children: "RECORDING PATH..." }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 254,
              columnNumber: 13
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
                lineNumber: 259,
                columnNumber: 11
              },
              this
            )
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 218,
          columnNumber: 9
        },
        this
      ),
      loadingAction && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50 text-white backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 268,
          columnNumber: 14
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "font-bold text-lg", children: loadingAction }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 269,
          columnNumber: 14
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 267,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 217,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "h-72 bg-white border-t shrink-0 flex flex-col shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "h-32 bg-gray-50 flex flex-col border-b", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center px-4 gap-3 overflow-x-auto scrollbar-hide flex-1 pt-2", children: [
          scenes.map((scene, i) => /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => setSelectedSceneId(scene.id),
              className: `relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedSceneId === scene.id ? "border-blue-500 scale-110 shadow-md ring-2 ring-blue-200" : "border-gray-200 opacity-70"}`,
              children: [
                scene.bgUrl ? /* @__PURE__ */ jsxDEV("img", { src: scene.bgUrl, className: "w-full h-full object-cover" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 287,
                  columnNumber: 19
                }, this) : /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-400", children: [
                  "Scene ",
                  i + 1
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 289,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 rounded-tl-md", children: [
                  scene.duration,
                  "s"
                ] }, void 0, true, {
                  fileName: "<stdin>",
                  lineNumber: 291,
                  columnNumber: 17
                }, this)
              ]
            },
            scene.id,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 281,
              columnNumber: 15
            },
            this
          )),
          /* @__PURE__ */ jsxDEV("button", { onClick: addScene, className: "flex-shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors", children: /* @__PURE__ */ jsxDEV(Plus, { size: 24 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 295,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 294,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 279,
          columnNumber: 11
        }, this),
        selectedSceneId && /* @__PURE__ */ jsxDEV("div", { className: "px-6 py-2 bg-blue-50/50 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 text-blue-600", children: [
            /* @__PURE__ */ jsxDEV(Timer, { size: 16 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 302,
              columnNumber: 18
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold", children: "Duration" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 303,
              columnNumber: 18
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 301,
            columnNumber: 16
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "range",
              min: "1",
              max: "10",
              step: "0.5",
              value: getSelectedScene()?.duration || 3,
              onChange: (e) => updateScene(selectedSceneId, { duration: parseFloat(e.target.value) }),
              className: "flex-1 accent-blue-500"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 305,
              columnNumber: 16
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("span", { className: "text-xs font-bold text-blue-600 w-8", children: [
            getSelectedScene()?.duration,
            "s"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 314,
            columnNumber: 16
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              onClick: () => {
                if (confirm("Delete this scene?")) {
                  setScenes((prev) => prev.filter((s) => s.id !== selectedSceneId));
                  setSelectedSceneId(null);
                }
              },
              className: "p-1 text-gray-400 hover:text-red-500",
              children: /* @__PURE__ */ jsxDEV(Trash2, { size: 16 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 324,
                columnNumber: 18
              }, this)
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 315,
              columnNumber: 16
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 300,
          columnNumber: 14
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 278,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex-1 p-3", children: selectedSceneId ? /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-4 gap-3 h-full", children: [
        /* @__PURE__ */ jsxDEV(
          ToolButton,
          {
            icon: ImageIcon,
            label: "BG AI",
            color: "bg-purple-100 text-purple-600 hover:bg-purple-200",
            onClick: generateBackground
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 334,
            columnNumber: 17
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ToolButton,
          {
            icon: Wand2,
            label: "Sticker AI",
            color: "bg-pink-100 text-pink-600 hover:bg-pink-200",
            onClick: generateSticker
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 340,
            columnNumber: 17
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ToolButton,
          {
            icon: Mic,
            label: "Talk AI",
            color: "bg-orange-100 text-orange-600 hover:bg-orange-200",
            onClick: generateTTS
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 346,
            columnNumber: 17
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          ToolButton,
          {
            icon: isRecording ? CheckCircle2 : Camera,
            label: isRecording ? "Finish" : "Cameo",
            color: isRecording ? "bg-red-500 text-white animate-pulse" : "bg-blue-100 text-blue-600 hover:bg-blue-200",
            onClick: toggleCamera
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 352,
            columnNumber: 17
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 333,
        columnNumber: 15
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center h-full text-gray-400 italic font-medium", children: "Tap a scene or add one to start creating \u2728" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 360,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 331,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 275,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 196,
    columnNumber: 5
  }, this);
}
const ToolButton = ({ icon: Icon, label, color, onClick }) => /* @__PURE__ */ jsxDEV(
  "button",
  {
    onClick,
    className: `flex flex-col items-center justify-center rounded-2xl ${color} active:scale-95 transition-all shadow-sm border border-black/5`,
    children: [
      /* @__PURE__ */ jsxDEV(Icon, { size: 24, className: "mb-1" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 375,
        columnNumber: 5
      }),
      /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-bold uppercase tracking-wider", children: label }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 376,
        columnNumber: 5
      })
    ]
  },
  void 0,
  true,
  {
    fileName: "<stdin>",
    lineNumber: 371,
    columnNumber: 3
  }
);
export {
  Studio as default
};
