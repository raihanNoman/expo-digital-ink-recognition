import { NativeModule, requireNativeModule } from 'expo';

import { ExpoDigitalInkRecognitionModuleEvents } from './ExpoDigitalInkRecognition.types';

declare class ExpoDigitalInkRecognitionModule extends NativeModule<ExpoDigitalInkRecognitionModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoDigitalInkRecognitionModule>('ExpoDigitalInkRecognition');
