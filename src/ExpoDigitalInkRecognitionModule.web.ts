import { registerWebModule, NativeModule } from 'expo';

import { ExpoDigitalInkRecognitionModuleEvents } from './ExpoDigitalInkRecognition.types';

class ExpoDigitalInkRecognitionModule extends NativeModule<ExpoDigitalInkRecognitionModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoDigitalInkRecognitionModule, 'ExpoDigitalInkRecognitionModule');
