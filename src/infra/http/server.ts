import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { uploadImageRoute } from './routes/upload-image'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.validation,
    })
  }

  // TODO: implement a better error handler (Sentry/Datadog...)
  console.error(error)
  return reply.status(500).send({
    message: 'Internal server error',
  })
})

server.register(fastifyCors, {
  origin: '*',
})

server.register(uploadImageRoute)

server.listen({ host: '0.0.0.0', port: 8080 }, () => {
  console.log('Server is running on port 8080')
})
