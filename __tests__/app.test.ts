import t from 'tap'

import {createServer} from '../src/app'

const server = createServer()

server.get('/health',(_, reply) => {
      
    reply.status(200).send({ status: 'OK' })
})

t.test('tests the "/" route', async t => {

    t.plan(2)
    
    const response = await server.inject({

           method : 'GET',
           url : '/'
    })

    t.equal(response.statusCode,200,'returns a status code of 200')
    t.same(response.json(), {hello  : 'world'})

    t.teardown(() => {

        server.close()

    })
})


t.test('tests the "/health" route' , async t => {


    const response = await server.inject({

        method : 'GET',
        url : '/health'
    }) 


    t.equal(response.statusCode,200,'returns a status code of 200')
    t.same(response.json(), {status  : 'OK'})

    t.teardown(() => {

        server.close()

    })


})