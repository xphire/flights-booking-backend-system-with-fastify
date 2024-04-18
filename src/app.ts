import Fastify, { FastifyInstance } from 'fastify'

const server : FastifyInstance = Fastify({
    logger : true
})


export default server;


