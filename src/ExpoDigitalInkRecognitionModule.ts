import { requireNativeModule } from "expo";

import type { ExpoDigitalInkRecognitionModule as ExpoDigitalInkRecognitionModuleType } from "./ExpoDigitalInkRecognition.types";

export default requireNativeModule<ExpoDigitalInkRecognitionModuleType>(
  "ExpoDigitalInkRecognition",
);
