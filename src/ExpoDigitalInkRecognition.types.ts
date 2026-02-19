export type InkPoint = {
  x: number;
  y: number;
  t: number; // timestamp in ms
};

export type InkStroke = InkPoint[];

export type RecognitionCandidate = {
  text: string;
  score: number; // MLKit confidence score
};

export type RecognizeResult = {
  candidates: RecognitionCandidate[];
};

export type ExpoDigitalInkRecognitionModule = {
  /**
   * Downloads a handwriting recognition model.
   * Example: "en-US"
   */
  downloadModel(languageTag: string): Promise<void>;

  /**
   * Returns language tags of downloaded models.
   */
  getDownloadedModels(): Promise<string[]>;

  /**
   * Deletes a downloaded model.
   */
  deleteModel(languageTag: string): Promise<void>;

  /**
   * Recognizes handwriting strokes.
   */
  recognize(
    languageTag: string,
    strokes: InkStroke[],
  ): Promise<RecognizeResult>;
};
