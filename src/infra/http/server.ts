import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'

const server = fastify()

server.register(fastifyCors, {
  origin: '*',
})

server.listen({ host: '0.0.0.0', port: 8080 }, () => {
  console.log('Server is running on port 3000')
})
