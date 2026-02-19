import ExpoDigitalInkRecognition from "expo-digital-ink-recognition";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Path, SketchCanvas } from "@sourcetoad/react-native-sketch-canvas";
import React, { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

function Canvas() {
  const canvasRef = useRef<SketchCanvas>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    console.log(strokes);
  }, [strokes]);

  // Called after each stroke
  const handleStrokeEnd = (path: Path) => {
    const points: Point[] = path.path.data.map((str) => {
      const [xStr, yStr] = str.split(",");
      return { x: parseFloat(xStr), y: parseFloat(yStr) };
    });
    setStrokes((prev) => [...prev, points]);
  };

  // Check if drawing matches letter
  const checkLetter = async () => {
    if (strokes.length === 0) return;

    try {
      // 1. Convert your Point[][] into InkStroke[] (which is InkPoint[])
      // We add a fake timestamp 't' because MLKit uses it for gesture velocity
      let currentTime = Date.now();

      const formattedStrokes = strokes.map((stroke) => {
        return stroke.map((point) => {
          // Increment time for every single point to simulate motion
          currentTime += 10;
          return {
            x: point.x,
            y: point.y,
            t: currentTime,
          };
        });
      });

      await ExpoDigitalInkRecognition.downloadModel("ar");
      const listModels = await ExpoDigitalInkRecognition.getDownloadedModels();

      console.info("Downloaded Models", listModels);
      // 2. Call your Swift module
      // Make sure you've called downloadModel("en-US") somewhere else first!
      const result = await ExpoDigitalInkRecognition.recognize(
        "ar",
        formattedStrokes,
      );

      console.log({ result });

      // 3. Display the top candidate
      if (result.candidates && result.candidates.length > 0) {
        setResult(`Result: ${result.candidates[0].text}`);
      } else {
        setResult("No match found");
      }
    } catch (error) {
      console.error("Recognition failed:", error);
    }
  };

  const clearCanvas = () => {
    canvasRef.current?.clear();
    setStrokes([]);
    setResult("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Draw: </Text>

      <View style={{ flex: 1, flexDirection: "row" }}>
        <SketchCanvas
          ref={canvasRef}
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ccc",
          }}
          strokeColor="black"
          strokeWidth={6}
          onStrokeEnd={handleStrokeEnd}
        />
      </View>

      <View style={styles.buttons}>
        <Button title="Check" onPress={checkLetter} />
        <Button title="Clear" onPress={clearCanvas} />
      </View>

      <Text style={styles.result}>{result}</Text>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20 },
//   title: { fontSize: 28, textAlign: "center", marginBottom: 20 },
//   buttons: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginVertical: 20,
//   },
//   result: { textAlign: "center", fontSize: 20 },
// });

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Canvas />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, textAlign: "center", marginBottom: 20 },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  result: { textAlign: "center", fontSize: 20 },
});
