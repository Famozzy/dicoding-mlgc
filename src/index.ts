import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import routes from './routes'

const app = new Hono()

const PORT = process.env.PORT || 3000

app.use(logger((str) => console.log(new Date().toISOString(), str)))
app.use(cors({ origin: '*' }))

app.route('/', routes)

serve({
  fetch: app.fetch,
  port: PORT as number
})
