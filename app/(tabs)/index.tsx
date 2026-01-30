import React, { useRef, useState } from "react";
import { View, StyleSheet, PanResponder } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";

export default function CanvasScreen() {
  const [paths, setPaths] = useState<any[]>([]);
  const currentPath = useRef(Skia.Path.Make());

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current = Skia.Path.Make();
        currentPath.current.moveTo(locationX, locationY);
        setPaths((p) => [...p, currentPath.current]);
      },

      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current.lineTo(locationX, locationY);
        setPaths((p) => [...p]);
      },
    }),
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Canvas style={styles.canvas}>
        {paths.map((p, i) => (
          <Path key={i} path={p} color="black" style="stroke" strokeWidth={4} />
        ))}
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvas: { flex: 1, backgroundColor: "white" },
});
