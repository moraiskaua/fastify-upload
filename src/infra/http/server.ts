import { fastifyCors } from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { exportUploadsRoute } from './routes/export-uploads';
import { getUploadRoute } from './routes/get-uploads';
import { uploadImageRoute } from './routes/upload-image';
import { transformSwaggerSchema } from './transform-swagger-schema';

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation error',
      errors: error.validation,
    });
  }

  // TODO: implement a better error handler (Sentry/Datadog...)
  console.error(error);
  return reply.status(500).send({
    message: 'Internal server error',
  });
});

server.register(fastifyCors, {
  origin: '*',
});

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Upload Image API',
      version: '1.0.0',
    },
  },
  transform: transformSwaggerSchema,
});

server.register(fastifyMultipart);
server.register(fastifySwaggerUi);

server.register(uploadImageRoute);
server.register(getUploadRoute);
server.register(exportUploadsRoute);

server.listen({ host: '0.0.0.0', port: 8080 }, () =>
  console.log('Server is running on http://localhost:8080')
);
