import type { FastifyInstance } from 'fastify';

export async function healthCheckRoute(app: FastifyInstance) {
  app.get('/health', async (request, reply) => {
    return reply.send({ status: 'ok' });
  });
}
