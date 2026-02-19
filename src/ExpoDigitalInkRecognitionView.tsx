import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoDigitalInkRecognitionViewProps } from './ExpoDigitalInkRecognition.types';

const NativeView: React.ComponentType<ExpoDigitalInkRecognitionViewProps> =
  requireNativeView('ExpoDigitalInkRecognition');

export default function ExpoDigitalInkRecognitionView(props: ExpoDigitalInkRecognitionViewProps) {
  return <NativeView {...props} />;
}
