import fastify from 'fastify'


export function createServer (opts={}){

    const server = fastify(opts)

    server.get('/', async function (request, reply) {
        return { hello: 'world' }
      })

    return server


}


// const server : FastifyInstance = Fastify({
//     logger : {

//         level : 'info',

//         transport : {

//             target : 'pino-pretty'
//         }
//     }
// })


// export default server;


