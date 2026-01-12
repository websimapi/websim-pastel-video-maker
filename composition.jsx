import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { AbsoluteFill, Series, Img, Audio, OffthreadVideo, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
const SceneComponent = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = interpolate(frame, [0, scene.duration * fps], [1, 1.1]);
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor: "white" }, children: [
    scene.bgUrl && /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { transform: `scale(${scale})` }, children: /* @__PURE__ */ jsxDEV(Img, { src: scene.bgUrl, style: { width: "100%", height: "100%", objectFit: "cover" } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 18,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 17,
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
        lineNumber: 36,
        columnNumber: 13
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 25,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 24,
      columnNumber: 9
    }),
    scene.stickerUrl && /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV(
      Img,
      {
        src: scene.stickerUrl,
        style: {
          width: "50%",
          transform: `rotate(${Math.sin(frame / 10) * 5}deg)`
          // Cute wiggle
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 47,
        columnNumber: 11
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 46,
      columnNumber: 9
    }),
    scene.audioUrl && /* @__PURE__ */ jsxDEV(Audio, { src: scene.audioUrl }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 59,
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
      lineNumber: 65,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 64,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 14,
    columnNumber: 5
  });
};
const MyComposition = ({ scenes }) => {
  return /* @__PURE__ */ jsxDEV(TransitionSeries, { children: scenes.map((scene, i) => /* @__PURE__ */ jsxDEV(React.Fragment, { children: [
    /* @__PURE__ */ jsxDEV(TransitionSeries.Sequence, { durationInFrames: scene.duration * 30, children: /* @__PURE__ */ jsxDEV(SceneComponent, { scene }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 90,
      columnNumber: 13
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 89,
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
        lineNumber: 93,
        columnNumber: 13
      }
    )
  ] }, scene.id, true, {
    fileName: "<stdin>",
    lineNumber: 88,
    columnNumber: 9
  })) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 86,
    columnNumber: 5
  });
};
export {
  MyComposition
};
