import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Svg, { Path, G } from "react-native-svg";
import { useCanvas } from "./useCanvas";
import { Point } from "../types/Element";

export const CanvasView = () => {
  const {
    elements,
    currentPoints,
    panHandlers,
    undo,
    mode,
    setMode,
    translate,
  } = useCanvas();

  const buildPathD = (points: Point[]) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <View style={styles.container} {...panHandlers}>
      <TouchableOpacity style={styles.btn} onPress={undo}>
        <Text style={styles.txt}>UNDO</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { top: 100 }]}
        onPress={() => setMode(mode === "draw" ? "pan" : "draw")}
      >
        <Text style={styles.txt}>{mode}</Text>
      </TouchableOpacity>

      <Svg style={styles.canvas}>
        <G transform={`translate(${translate.x}, ${translate.y})`}>
          {elements.map((el) =>
            el.type === "path" ? (
              <Path
                key={el.id}
                d={buildPathD(el.points)}
                stroke={el.color}
                strokeWidth={el.strokeWidth}
                fill="none"
              />
            ) : null,
          )}
        </G>

        {currentPoints.length > 0 && (
          <Path
            d={buildPathD(currentPoints)}
            stroke="black"
            strokeWidth={3}
            fill="none"
            transform={`translate(${translate.x}, ${translate.y})`}
          />
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvas: { flex: 1, backgroundColor: "white" },
  btn: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  txt: { color: "white" },
});
