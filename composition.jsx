import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { AbsoluteFill, Series, Img, Audio, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
const SceneComponent = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sceneDurationFrames = Math.max(1, scene.duration * fps);
  const scale = interpolate(frame, [0, sceneDurationFrames], [1, 1.1]);
  let currentX = scene.stickerPos?.x ?? 50;
  let currentY = scene.stickerPos?.y ?? 50;
  if (scene.stickerPath && scene.stickerPath.length > 1) {
    const uniquePoints = [];
    for (const pt of scene.stickerPath) {
      if (uniquePoints.length === 0 || pt.t > uniquePoints[uniquePoints.length - 1].t) {
        uniquePoints.push(pt);
      }
    }
    if (uniquePoints.length > 1) {
      const inputFrames = uniquePoints.map((p) => p.t * sceneDurationFrames);
      const outputX = uniquePoints.map((p) => p.x);
      const outputY = uniquePoints.map((p) => p.y);
      currentX = interpolate(frame, inputFrames, outputX, {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp"
      });
      currentY = interpolate(frame, inputFrames, outputY, {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp"
      });
    }
  }
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "white" }, children: [
    scene.bgUrl && /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { transform: `scale(${scale})` }, children: /* @__PURE__ */ jsxDEV(Img, { src: scene.bgUrl, style: { width: "100%", height: "100%", objectFit: "cover" } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 48,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 47,
      columnNumber: 9
    }),
    scene.camUrl && /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      bottom: "5%",
      right: "5%",
      width: "30%",
      aspectRatio: "1/1",
      borderRadius: "50%",
      border: "5px solid white",
      overflow: "hidden",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
    }, children: /* @__PURE__ */ jsxDEV(
      OffthreadVideo,
      {
        src: scene.camUrl,
        style: { width: "100%", height: "100%", objectFit: "cover" }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 66,
        columnNumber: 13
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 55,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 54,
      columnNumber: 9
    }),
    scene.stickerUrl && /* @__PURE__ */ jsxDEV(AbsoluteFill, { children: /* @__PURE__ */ jsxDEV("div", { style: {
      position: "absolute",
      left: `${currentX}%`,
      top: `${currentY}%`,
      transform: `translate(-50%, -50%) rotate(${Math.sin(frame / 10) * 5}deg)`,
      width: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }, children: /* @__PURE__ */ jsxDEV(
      Img,
      {
        src: scene.stickerUrl,
        style: { width: "100%" }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 87,
        columnNumber: 13
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 77,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 76,
      columnNumber: 9
    }),
    scene.audioUrl && /* @__PURE__ */ jsxDEV(Audio, { src: scene.audioUrl }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 97,
      columnNumber: 9
    }),
    scene.text && /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "flex-end", alignItems: "center", paddingBottom: "20%" }, children: /* @__PURE__ */ jsxDEV("h1", { style: {
      fontFamily: "Fredoka",
      fontSize: "60px",
      color: "white",
      textShadow: "3px 3px 0px #FF9AA2",
      textAlign: "center",
      padding: "20px",
      backgroundColor: "rgba(0,0,0,0.3)",
      borderRadius: "20px",
      maxWidth: "90%"
    }, children: scene.text }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 103,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 102,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 44,
    columnNumber: 5
  });
};
const MyComposition = ({ scenes = [] }) => {
  if (!scenes || scenes.length === 0) {
    return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "#FFF5F5" } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 124,
      columnNumber: 12
    });
  }
  return /* @__PURE__ */ jsxDEV(TransitionSeries, { children: scenes.map((scene, i) => /* @__PURE__ */ jsxDEV(React.Fragment, { children: [
    /* @__PURE__ */ jsxDEV(TransitionSeries.Sequence, { durationInFrames: Math.max(1, Math.floor(scene.duration * 30)), children: /* @__PURE__ */ jsxDEV(SceneComponent, { scene }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 132,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 131,
      columnNumber: 11
    }),
    i < scenes.length - 1 && /* @__PURE__ */ jsxDEV(
      TransitionSeries.Transition,
      {
        presentation: fade(),
        timing: linearTiming({ durationInFrames: 15 })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 135,
        columnNumber: 13
      }
    )
  ] }, scene.id, true, {
    fileName: "<stdin>",
    lineNumber: 130,
    columnNumber: 9
  })) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 128,
    columnNumber: 5
  });
};
export {
  MyComposition
};
