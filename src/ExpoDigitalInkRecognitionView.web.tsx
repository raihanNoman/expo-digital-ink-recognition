import * as React from 'react';

import { ExpoDigitalInkRecognitionViewProps } from './ExpoDigitalInkRecognition.types';

export default function ExpoDigitalInkRecognitionView(props: ExpoDigitalInkRecognitionViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
