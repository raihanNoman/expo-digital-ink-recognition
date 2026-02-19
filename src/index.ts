// Reexport the native module. On web, it will be resolved to ExpoDigitalInkRecognitionModule.web.ts
// and on native platforms to ExpoDigitalInkRecognitionModule.ts
export { default } from './ExpoDigitalInkRecognitionModule';
export { default as ExpoDigitalInkRecognitionView } from './ExpoDigitalInkRecognitionView';
export * from  './ExpoDigitalInkRecognition.types';
