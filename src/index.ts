import server from "./app"

import helmet from '@fastify/helmet'

import { createUserRouteOptions, fetchUsersRouteOptions , fetchUserByIDRouteOptions , partialUpdateUserRouteOptions, fullUpdateUserRouteOptions, deleteUserRouteOptions  } from "./modules/users/user.route"

import { userLoginController , adminAuth } from "./modules/auth/auth"

server.register(helmet, {

  contentSecurityPolicy : false
})

server.get('/ping', (request, reply) => {
    return { pong: 'it worked!' }
  })

server.post('/api/v1/auth' , userLoginController );

////users Router

//no auth

server.register(function(app, _, done) {


  app.route( fetchUsersRouteOptions)

  app.route(createUserRouteOptions)

  app.route(fetchUserByIDRouteOptions)
  

  done()
}, { prefix: '/api/v1/users'}, )


//with auth

// server.register(function(app, _, done) {

//   app.route(fetchUsersRouteOptions)
  

//   done()
// }, { prefix: '/api/v1/users' })





server.setErrorHandler((error, request, reply) => {

  console.log("error instance : ",error.code)
  //reply.status(500).send({ ok: false })
  reply.status(422).send(error)
})

  
const start = async () => {
    try {
        
      await server.listen({ port: 3000 })

  
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }
  
  start()