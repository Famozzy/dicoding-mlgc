import { Hono } from 'hono'
import predictRouter from './predict'

const rootRouter = new Hono()

rootRouter.get('/', async (c) => {
  return c.json({
    status: 'success',
    message: 'hello world'
  })
})

rootRouter.route('/predict', predictRouter)

export default rootRouter
