import server from "./app"

import helmet from '@fastify/helmet'

import { createUserRouteOptions, fetchUsersRouteOptions , fetchUserByIDRouteOptions , partialUpdateUserRouteOptions, fullUpdateUserRouteOptions, deleteUserRouteOptions  } from "./modules/users/user.route"

import { userLoginController , adminAuth } from "./modules/auth/auth"

import prisma from "../utils/prisma"

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


  //get all users
  app.route( fetchUsersRouteOptions)


//post user
  app.route(createUserRouteOptions)

//fetch user by ID
  app.route(fetchUserByIDRouteOptions)

//patch user
  app.route(partialUpdateUserRouteOptions)

//put user
  app.route(fullUpdateUserRouteOptions)

//delete user
  app.route(deleteUserRouteOptions)
  

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

  

//check if database can be reached/connected before starting server
const start = async () => {
    try {

      await prisma.$connect()
        
      await server.listen({ port: 3000 })

  
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }
  
  start()