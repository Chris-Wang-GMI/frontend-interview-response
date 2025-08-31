import { serve } from '@hono/node-server'
import chalk from 'chalk'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { MAZES } from './models'

const app = new Hono()
const port = 8080

app.use('/api/*', cors())
app.get('/api/maze', async ctx => {
  try {
    return ctx.json(MAZES)
  } catch (error) {
    return ctx.newResponse('Not Found', 400)
  }
})

console.info(`Maze    ${chalk.blueBright(`http://localhost:${port}/api/maze`)}`)

serve({
  fetch: app.fetch,
  port,
})
