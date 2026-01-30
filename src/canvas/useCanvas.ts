import "react-native-get-random-values";
import { useRef, useState } from "react";
import { PanResponder } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { Element, Point } from "../types/Element";

export const useCanvas = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [mode, setMode] = useState<"draw" | "pan">("draw");
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const panOrigin = useRef({ x: 0, y: 0 });
  const currentPointsRef = useRef<Point[]>([]);
  const modeRef = useRef<"draw" | "pan">("draw");

  modeRef.current = mode;

  const toCanvasPoint = (locationX: number, locationY: number) => ({
    x: locationX - translate.x,
    y: locationY - translate.y,
  });

  const undo = () => {
    setElements((prev) => prev.slice(0, -1));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt) => {
      const activeMode = modeRef.current;

      if (activeMode === "pan") {
        panOrigin.current = translate;
        return;
      }

      if (activeMode === "draw") {
        const { locationX, locationY } = evt.nativeEvent;
        const point = toCanvasPoint(locationX, locationY);

        setCurrentPoints([point]);
        currentPointsRef.current = [point];
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      const activeMode = modeRef.current;

      if (activeMode === "draw") {
        const { locationX, locationY } = evt.nativeEvent;
        const point = toCanvasPoint(locationX, locationY);

        setCurrentPoints((prev) => {
          const next = [...prev, point];
          currentPointsRef.current = next;
          return next;
        });
      }

      if (activeMode === "pan") {
        setTranslate({
          x: panOrigin.current.x + gestureState.dx,
          y: panOrigin.current.y + gestureState.dy,
        });
      }
    },

    onPanResponderRelease: () => {
      const activeMode = modeRef.current;
      if (activeMode !== "draw") return;
      if (currentPointsRef.current.length === 0) return;

      const newElement: Element = {
        id: uuidv4(),
        type: "path",
        color: "black",
        strokeWidth: 3,
        points: currentPointsRef.current,
      };

      setElements((prev) => [...prev, newElement]);
      setCurrentPoints([]);
      currentPointsRef.current = [];
    },
  });

  return {
    elements,
    currentPoints,
    panHandlers: panResponder.panHandlers,
    undo,
    mode,
    setMode,
    translate,
  };
};
