import server from "./app"

import helmet from '@fastify/helmet'

import * as userRoutes from "./modules/users/user.route"

import * as flightRoutes from "./modules/flights/flight.route"

import { userLoginController  } from "./modules/auth/auth"

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
  app.route( userRoutes.fetchUsersRouteOptions)


//post user
  app.route(userRoutes.createUserRouteOptions)

//fetch user by ID
  app.route(userRoutes.fetchUserByIDRouteOptions)

//patch user
  app.route(userRoutes.partialUpdateUserRouteOptions)

//put user
  app.route(userRoutes.fullUpdateUserRouteOptions)

//delete user
  app.route(userRoutes.deleteUserRouteOptions)
  

  done()
}, { prefix: '/api/v1/users'}, )


server.register(function(app,_,done){

    //get all users 

    app.route(flightRoutes.fetchFlightsRouteOptions)

    //create flight

    app.route(flightRoutes.createFlightRouteOptions)

    //fetch user by ID
    app.route(flightRoutes.fetchFlightByIDRouteOptions)

    //patch user
    app.route(flightRoutes.partialUpdateFlightRouteOptions)
  
    //put user
    app.route(flightRoutes.fullUpdateFlightRouteOptions)
  
    //delete user
    app.route(flightRoutes.deleteFlightRouteOptions) 

    done()

}, {prefix: 'api/v1/flights'})


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