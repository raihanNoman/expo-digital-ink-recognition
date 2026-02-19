import ExpoModulesCore
import MLKitDigitalInkRecognition

public class ExpoDigitalInkRecognitionModule: Module {
  public func definition() -> ModuleDefinition {

    Name("ExpoDigitalInkRecognition")

         AsyncFunction("downloadModel") { (languageTag: String) async throws in
            
            guard let identifier = DigitalInkRecognitionModelIdentifier(forLanguageTag: languageTag) else {
                throw NSError(domain: "DigitalInk", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid language tag"])
            }
            
            let model = DigitalInkRecognitionModel(modelIdentifier: identifier)
            let manager = ModelManager.modelManager()
            let conditions = ModelDownloadConditions(allowsCellularAccess: true, allowsBackgroundDownloading: true)
            
            // 1. Start the download (this no longer takes a closure)
            manager.download(model, conditions: conditions)
            
            // 2. Wait for the notification that the download finished
            _ = await NotificationCenter.default.notifications(named: .mlkitModelDownloadDidSucceed).first { notification in
                guard let downloadedModel = notification.userInfo?[ModelDownloadUserInfoKey.remoteModel.rawValue] as? DigitalInkRecognitionModel else { return false }
                return downloadedModel.modelIdentifier == identifier
            }
        }
        
        
        AsyncFunction("getDownloadedModels") { () -> [String] in
            let manager = ModelManager.modelManager()
            // Enumerate all available Digital Ink model identifiers and filter those already downloaded
            var downloaded: [String] = []
            let identifiers = DigitalInkRecognitionModelIdentifier.allModelIdentifiers()
            for identifier in identifiers {
                let model = DigitalInkRecognitionModel(modelIdentifier: identifier)
                if manager.isModelDownloaded(model) {
                    downloaded.append(identifier.languageTag)
                }
            }
            return downloaded
        }
        
        AsyncFunction("deleteModel") { (languageTag: String) async throws in
            guard let identifier = DigitalInkRecognitionModelIdentifier(
                forLanguageTag: languageTag
            ) else {
                throw NSError(
                    domain: "DigitalInk",
                    code: 1,
                    userInfo: [NSLocalizedDescriptionKey: "Invalid language tag"]
                )
            }
            
            let model = DigitalInkRecognitionModel(modelIdentifier: identifier)
            let manager = ModelManager.modelManager()
            try await manager.deleteDownloadedModel(model)
        }
        
        AsyncFunction("recognize") { (languageTag: String, strokes: [[[String: Double]]]) async throws -> [String: Any] in
            
            guard let identifier = DigitalInkRecognitionModelIdentifier(forLanguageTag: languageTag) else {
                throw NSError(domain: "DigitalInk", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid language tag"])
            }
            
            let model = DigitalInkRecognitionModel(modelIdentifier: identifier)
            
            // Safety check: Is the model actually there?
            if !ModelManager.modelManager().isModelDownloaded(model) {
                throw NSError(domain: "DigitalInk", code: 2, userInfo: [NSLocalizedDescriptionKey: "Model not downloaded"])
            }
            
            let options = DigitalInkRecognizerOptions(model: model)
            let recognizer = DigitalInkRecognizer.digitalInkRecognizer(options: options)
            
            // FIX: Single loop iteration for strokes
            var strokesArray: [Stroke] = []
            for strokeData in strokes {
                var points: [StrokePoint] = []
                for point in strokeData {
                    guard let x = point["x"], let y = point["y"], let t = point["t"] else { continue }
                    points.append(StrokePoint(x: Float(x), y: Float(y), t: Int(t)))
                }
                strokesArray.append(Stroke(points: points))
            }
            
            let ink = Ink(strokes: strokesArray)
            let result = try await recognizer.recognize(ink: ink)
            
            let candidates = result.candidates.map {
                ["text": $0.text, "score": $0.score?.doubleValue ?? 0.0]
            }
            
            return ["candidates": candidates]
        }
        
    }
}

