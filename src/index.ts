import {createServer} from "./app"

import helmet from '@fastify/helmet'

import * as userRoutes from "./modules/users/user.route"

import * as flightRoutes from "./modules/flights/flight.route"

import * as bookingRoutes from "./modules/bookings/booking.route"

import prisma from "../utils/prisma"

import { loginRouteOptions } from "./modules/auth/auth"


const server = createServer({
      logger : {
  
          level : 'info',
  
          transport : {
  
              target : 'pino-pretty'
          }
      }
  });


server.register(helmet, {

  contentSecurityPolicy : false
})


server.setErrorHandler((error, _, reply) => {

  console.log("error instance : ",error.code)
 // reply.status(500).send({ ok: false })
  reply.status(400).send(error)
})
  

//check if database can be reached/connected before starting server
const start = async () => {

    try {

      await server.register(import("@fastify/swagger"),{
        openapi: {
          openapi: '3.0.0',
          info: {
            title: 'Test swagger',
            description: 'Testing the Fastify swagger API',
            version: '0.1.0'
          },
          servers: [
            {
              url: 'http://localhost:3000',
              description: 'Development server'
            }
          ],
          tags: [
            { name: 'auth', description: 'generate JWT' },
            { name: 'bookings', description: 'Flight booking related end-points' },
            { name: 'flights', description: 'flights related end-points' },
            { name: 'users', description: 'User related end-points' }
          ],
          components: {
            securitySchemes: {
              bearerAuth: {
                type: 'http',
                description : 'Please enter token',
                scheme: 'bearer',
                bearerFormat : 'JWT'
              }
            }
          },
          security: [
            {
              bearerAuth: [],
            },
          ],
          externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
          }
      }})

      await server.register(import('@fastify/swagger-ui'), {
        routePrefix: '/documentation',
        uiConfig: {
          docExpansion: 'full',
          deepLinking: false
        },
        uiHooks: {
          onRequest: function (request, reply, next) { next() },
          preHandler: function (request, reply, next) { next() }
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
        transformSpecificationClone: true
      })


      server.register(function(app,_,done){

        //login route
      
        app.route(loginRouteOptions)
      
        app.get('/health',(_, reply) => {
      
          reply.status(200).send({ status: 'OK' })
        })
      
        done()
      
      }, {prefix : '/api/v1'});
      
      ////users Router
      
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
      
      
      ////flights Router
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
      
      
      ////bookings Router
      
      server.register(function(app,_,done){
      
      //create flight booking
      
      app.route(bookingRoutes.createBookingRouteOptions)
      
      //update booking user
      
      app.route(bookingRoutes.updateBookingUserRouteOptions)
      
      //fetch flightbookings
      
      app.route(bookingRoutes.fetchBookingsRouteOptions)
      
      //delete booking
      
      app.route(bookingRoutes.deleteBookingRouteOptions)
      
      //delete booking
      
      app.route(bookingRoutes.fetchBookingRouteOptions)
      
      
      done()
      
      }, {prefix: 'api/v1/bookings'})
      
      await server.ready()

     server.swagger()

      await prisma.$connect()
        
      await server.listen({ port: 3000 })


    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }


}
  
start()