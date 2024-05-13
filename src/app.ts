import Fastify, { FastifyInstance } from 'fastify'


const server : FastifyInstance = Fastify({
    logger : {

        transport : {

            target : 'pino-pretty'
        }
    }
})


export default server;


