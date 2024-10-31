import * as tf from '@tensorflow/tfjs-node'

export async function loadModel() {
  if (!process.env.MODEL_URL) throw new Error('MODEL_URL is not defined')
  return tf.loadGraphModel(process.env.MODEL_URL)
}

export async function predictClassification(model: tf.GraphModel, imageBuffer: Uint8Array) {
  try {
    const tensor = tf.node.decodeJpeg(imageBuffer).resizeNearestNeighbor([224, 224]).expandDims().toFloat()

    const prediction = model.predict(tensor) as tf.Tensor

    const [score] = await prediction.data()
    const confidenceScore = Math.max(score) * 100

    let result = 'Non-cancer'
    let suggestion = 'Penyakit kanker tidak terdeteksi.'

    if (confidenceScore > 50) {
      result = 'Cancer'
      suggestion = 'Segera periksa ke dokter!'
    }

    return {
      result,
      suggestion
    }
  } catch (error) {
    throw new Error('Terjadi kesalahan dalam melakukan prediksi')
  }
}
