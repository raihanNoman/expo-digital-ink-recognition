import { NativeModule, registerWebModule } from "expo";
import type { ExpoDigitalInkRecognitionModule } from "./ExpoDigitalInkRecognition.types";

class ExpoDigitalInkRecognitionWeb
  extends NativeModule<Record<never, never>>
  implements ExpoDigitalInkRecognitionModule
{
  async downloadModel(): Promise<void> {
    throw new Error("DigitalLink is not supported on web.");
  }

  async getDownloadedModels(): Promise<string[]> {
    throw new Error("DigitalLink is not supported on web.");
  }

  async deleteModel(): Promise<void> {
    throw new Error("DigitalLink is not supported on web.");
  }

  async recognize(): Promise<any> {
    throw new Error("DigitalLink is not supported on web.");
  }
}

export default registerWebModule(
  ExpoDigitalInkRecognitionWeb,
  "ExpoDigitalInkRecognitionModule",
);
