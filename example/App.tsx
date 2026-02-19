import ExpoDigitalInkRecognition from "expo-digital-ink-recognition";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Path, SketchCanvas } from "@sourcetoad/react-native-sketch-canvas";
import React, { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };

function Canvas() {
  const canvasRef = useRef<SketchCanvas>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("strokes registered:", strokes.length);
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
    if (loading) return;

    try {
      setLoading(true);
      if (strokes.length === 0) throw "Strokes are empty. Draw a letter";

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

      // 3. Display the top candidate
      if (result.candidates && result.candidates.length > 0) {
        setResult(`Result: ${result.candidates[0].text}`);
        console.log("✅", result.candidates);
      } else {
        setResult("No match found");
        alert("No Match Found");
      }
    } catch (error) {
      console.error("Recognition failed:", error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const clearCanvas = () => {
    canvasRef.current?.clear();
    setStrokes([]);
    setResult("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Draw Arabic Letter</Text>

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

      {loading && <ActivityIndicator />}

      <View style={styles.buttons}>
        <View style={{ opacity: loading ? 0.4 : 1 }}>
          <Button disabled={loading} title="Check" onPress={checkLetter} />
        </View>
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
