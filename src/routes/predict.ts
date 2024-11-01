import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { loadModel, predictClassification } from '@/libs/inference'
import { modelPrediction } from '@/model/prediction'

const router = new Hono()

router.post(
  '/',
  bodyLimit({
    maxSize: 1000 * 1024,
    onError: (c) =>
      c.json({ status: 'fail', message: 'Payload content length greater than maximum allowed: 1000000' }, 413)
  }),
  async (c) => {
    try {
      const body = await c.req.parseBody()
      const image = body['image'] as File

      const imageBuffer = await image.arrayBuffer()
      const imageUint8Array = new Uint8Array(imageBuffer)

      let model = global.model
      if (!global.model) {
        model = await loadModel()
        global.model = model
      }

      const { result, suggestion } = await predictClassification(model, imageUint8Array)

      const id = crypto.randomUUID()
      const createdAt = new Date().toISOString()

      const responseData = { id, result, suggestion, createdAt }

      await modelPrediction.save(responseData)

      return c.json(
        {
          status: 'success',
          message: 'Model is predicted successfully',
          data: responseData
        },
        201
      )
    } catch (error) {
      if (error instanceof Error) {
        return c.json(
          {
            status: 'fail',
            message: error.message
          },
          400
        )
      }
    }
  }
)

router.get('/histories', async (c) => {
  const predictionDocuments = await modelPrediction.readAll()

  const histories = predictionDocuments.map(({ id, result, suggestion, createdAt }) => ({
    id,
    history: { id, result, suggestion, createdAt }
  }))

  return c.json({
    status: 'success',
    data: histories
  })
})

export default router
