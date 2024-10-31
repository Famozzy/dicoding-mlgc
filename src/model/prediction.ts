import { firestore } from '@/libs/firestore'

type PredictionData = {
  id: string
  result: string
  suggestion: string
  createdAt: string
}

const predictionCollection = firestore.collection('predictions')

export const modelPrediction = {
  save: (data: PredictionData) => {
    return predictionCollection.doc(data.id).set(data)
  },
  readAll: async () => {
    const snapshot = await predictionCollection.get()
    return snapshot.docs.map((doc) => doc.data() as PredictionData)
  }
}
