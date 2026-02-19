package expo.modules.digitalinkrecognition

import com.google.mlkit.vision.digitalink.*
import com.google.mlkit.common.model.RemoteModelManager
import com.google.mlkit.common.model.DownloadConditions
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async


class ExpoDigitalInkRecognitionModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoDigitalInkRecognition")

    // We use the CoroutineScope provided by the Module (appContext)
    AsyncFunction("downloadModel") Coroutine { languageTag: String ->
      val identifier = DigitalInkRecognitionModelIdentifier.fromLanguageTag(languageTag)
        ?: throw Exception("Invalid language tag")

      val model = DigitalInkRecognitionModel.builder(identifier).build()
      val manager = RemoteModelManager.getInstance()
      val conditions = DownloadConditions.Builder().build()

      // This ensures the Task is awaited within a coroutine context the compiler trusts
      manager.download(model, conditions).await()
      "success"
    }

    AsyncFunction("getDownloadedModels") Coroutine { ->
      val manager = RemoteModelManager.getInstance()
      val models = manager.getDownloadedModels(DigitalInkRecognitionModel::class.java).await()
      models.map { it.modelIdentifier?.languageTag ?: "unknown" }
    }

    AsyncFunction("recognize") Coroutine { languageTag: String, strokes: List<List<Map<String, Any>>> ->
      val identifier = DigitalInkRecognitionModelIdentifier.fromLanguageTag(languageTag)
        ?: throw Exception("Model not found")

      val model = DigitalInkRecognitionModel.builder(identifier).build()
      val recognizer = DigitalInkRecognition.getClient(
        DigitalInkRecognizerOptions.builder(model).build()
      )

      val inkBuilder = Ink.builder()
      for (stroke in strokes) {
        val strokeBuilder = Ink.Stroke.builder()
        for (point in stroke) {
          val x = (point["x"] as? Number)?.toFloat() ?: 0f
          val y = (point["y"] as? Number)?.toFloat() ?: 0f
          val t = (point["t"] as? Number)?.toLong() ?: 0L
          strokeBuilder.addPoint(Ink.Point.create(x, y, t))
        }
        inkBuilder.addStroke(strokeBuilder.build())
      }

      // Explicitly awaiting the Task result
      val result = recognizer.recognize(inkBuilder.build()).await()

      val candidates = result.candidates.map { candidate ->
        mapOf(
          "text" to candidate.text,
          "score" to (candidate.score ?: 0.0f)
        )
      }

      mapOf("candidates" to candidates)
    }
  }
}