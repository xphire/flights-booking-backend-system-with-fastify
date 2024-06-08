import tap from 'tap'

import {createServer} from '../../../src/app'

import * as bookingsService from '../../../src/modules/bookings/booking.service'

import * as bookingsController from '../../../src/modules/bookings/booking.controller'

import * as bookingsSchema from '../../../src/modules/bookings/booking.schema'

import sinon from 'sinon'


//create fastify instance, register routes 

const server = createServer()

server.decorateRequest('userId','')

server.addHook('preHandler', async (request,_) => {

    request.userId = '3'
})

//get all bookings for a flight route

server.get('/api/v1/bookings/all/:flightId',{
    
    handler : bookingsController.fetchBookingsController,
    schema : {

        response : {

            200 : bookingsSchema.bookingsFetchResponseSchema
        }
    }

})



//create booking route

server.post('/api/v1/bookings/booking', {

    handler : bookingsController.createBookingController,
    schema : {
  
       body : bookingsSchema.createBookingInputSchema,
  
       response : {
  
          201 : bookingsSchema.createBookingResponseSchema
       }
    }
})


//fetch booking route options

server.get('/api/v1/bookings/booking/:id',{
    
    handler : bookingsController.fetchBookingController,
    schema : {

        params : bookingsSchema.bookingInputRequestSchema,

        response : {

            200 : bookingsSchema.createBookingResponseSchema
        }
    }

})


//update booking user route

server.patch('/api/v1/bookings/booking',{
    
    handler : bookingsController.updateBookingUserController,
    schema : {

        body : bookingsSchema.updateBookingInputSchema,

        response : {

            200 : bookingsSchema.createBookingResponseSchema
        }
    }

})


//delete booking route

server.delete('/api/v1/bookings/booking/:id',{
    
    handler : bookingsController.deleteBookingController,
    schema : {

        params : bookingsSchema.bookingInputRequestSchema,

        response : {

            204 : bookingsSchema.deleteBookingResponseSchema
        }
    }

})


//////////////////////////////////



tap.test("testing the bookings routes", async t => {


    t.beforeEach(async () => {

        sinon.restore();
    
    })
    
    t.before(async () => {
    
        await server.ready()
    })
    
    
    //create booking
    
    
    t.test('tests the POST api/v1/bookings/booking route', async t => {
    
    
    
        const mockBookingBody = {
    
            "flightId" : 3
    
        } 
    
    
        const createBookingServiceMock = sinon.mock(bookingsService)
    
        createBookingServiceMock.expects('createBookingService').once().withArgs({...mockBookingBody,userId : 3})
    
       
        const response = await server.inject({
    
             method : 'POST',
             url : 'api/v1/bookings/booking',
             body : mockBookingBody
    
        })
    
        
        t.equal(response.statusCode,201,'returns a status code of 201')
    
        try{
    
         createBookingServiceMock.verify()
         t.pass('successfully tested POST api/v1/bookings/booking route')
    
        }catch(error){
    
         t.fail('failed to test POST api/v1/bookings/booking route')
    
        }

        t.end()
    
    })
    
    //get bookings in flight route test
    
    
    t.test('tests the GET api/v1/bookings/all/:flightId route', async t => {
    
        const mockBookingResponse = [
              {
                "id": 1,
                "seat": 355,
                "createdAt": "2024-04-25T19:20:21.868Z",
                "user" : {
    
                    "name" : "Olawale Thomas",
                    "email" : "ot@primax.com"
                }
              }
            ]
    
         //@ts-ignore
        const getBookingsMock = sinon.mock(bookingsService)
    
        getBookingsMock.expects('fetchBookingsService').once().withArgs('10').resolves(mockBookingResponse)
         
        const response = await server.inject({
    
            method : 'GET',
            url : '/api/v1/bookings/all/10'
        }) 
    
        t.equal(response.statusCode,200,'returns a status code of 200')
        t.same(response.json(), mockBookingResponse)
    
    
        try{
    
            getBookingsMock.verify()
            t.pass('successfully tested GET api/v1/bookings/all/:id route')
       
           }catch(error){
       
            t.fail('failed to test GET api/v1/bookings/all/:id route')
       
           }


           t.end()
        
    
    
    })
    
    
    
    //fetch boooking route
    
    t.test('tests the GET api/v1/bookings/booking/:id route', async t =>  {
    
    
        const mockBookingResponse = {
              "id": 2,
              "user" : {
    
                "name" : "Olawale Thomas",
                "email" : "ot@primax.com"
              },
              "seat": 378,
              "flight" : {
                
                "description": "flight from Windeohk Namibia to Abuja Nigeria",
                "date": "2024-04-30T20:51:49.373Z"
    
              },
              "createdAt": "2024-04-25T20:51:49.375Z"
        }
    
        //@ts-ignore
        const getBookingServiceMock = sinon.mock(bookingsService)
    
        getBookingServiceMock.expects('fetchBookingService').once().withArgs(2).resolves(mockBookingResponse)
    
        const response = await server.inject({
    
            method : 'GET',
            url : '/api/v1/bookings/booking/2'
        })
    
        t.equal(response.statusCode,200,'expects a response with a status code of 200')
        t.same(response.json(),mockBookingResponse)
    
        try{
    
          getBookingServiceMock.verify()
          t.pass('successfully tested GET api/v1/bookings/booking/:id route')
    
         }catch(error){
    
          t.fail('failed to test GET api/v1/bookings/booking/:id route')
    
         }


         t.end()
        
      
    
    })
    
    
    //update booking user route
    
    t.test('tests the PATCH api/v1/bookings/booking route', async t =>  {
    
    
        const mockBookingResponse = {
    
            id : 10,
            createdAt : "2024-04-25T20:51:49.375Z",
            user : {
                name : "Alphonso Kante",
                email : "kante@fave.com"
            },
            seat : 355,
            flight : {
    
                description : "Flight from Sabo Yaba to Oshodi",
                date : "2024-04-30T20:51:49.373Z"
            }
              
        }
    
        //@ts-ignore
        const updateBookingServiceMock = sinon.mock(bookingsService)
    
        updateBookingServiceMock.expects('updateBookingUserService').once().withArgs({userId : 3, id : 10}).resolves(mockBookingResponse)
    
        const response = await server.inject({
    
            method : 'PATCH',
            url : '/api/v1/bookings/booking',
            body : {userId : 3, id : 10}
        })
    
        t.equal(response.statusCode,200,'expects a response with a status code of 200')
        t.same(response.json(),mockBookingResponse)
    
        try{
    
          updateBookingServiceMock.verify()
          t.pass('successfully tested PATCH api/v1/bookings/booking route')
    
         }catch(error){
    
          t.fail('failed to test PATCH api/v1/bookings/booking route')
    
         }


         t.end()
        
      
    
    })
    
    
    //delete booking
    
    
    t.test('tests the DELETE api/v1/bookings/booking/:id route', async t =>  {
    
        //@ts-ignore
        const deleteBookingServiceMock = sinon.mock(bookingsService)
    
        deleteBookingServiceMock.expects('deleteBookingService').once().withArgs(10)
    
        const response = await server.inject({
    
            method : 'DELETE',
            url : '/api/v1/bookings/booking/10'
        })
    
        t.equal(response.statusCode,204,'expects a response with a status code of 204')
       
    
        try{
    
          deleteBookingServiceMock.verify()
          t.pass('successfully tested DELETE api/v1/bookings/booking/:id route')
    
         }catch(error){
    
          t.fail('failed to test DELETE api/v1/bookings/booking/:id route')
    
         }


         t.end()
        
      
    
    })
    
    
    
    /////TESTING ERRORS/////////////////////////////
    
    
    //create booking
    
    
    t.test('tests the POST api/v1/bookings/booking route', async t => {
    
    
    
        const mockBookingBody = {
    
           "flightId" : 3
    
        } 
    
    
        const createBookingServiceMock = sinon.mock(bookingsService)
    
        createBookingServiceMock.expects('createBookingService').once().withArgs({...mockBookingBody,userId : 3}).rejects(new Error("flight booking failed"))
    
       
        const response = await server.inject({
    
             method : 'POST',
             url : 'api/v1/bookings/booking',
             body : mockBookingBody
    
        })
    
        
        t.equal(response.statusCode,500,'returns a status code of 500')
    
        try{
    
         createBookingServiceMock.verify()
         t.pass('successfully tested POST api/v1/bookings/booking route for failure')
    
        }catch(error){
    
         t.fail('failed to test POST api/v1/bookings/booking route for failure')
    
        }


        t.end()
    
    })
    
    
    //get bookings in flight route test
    
    
    t.test('tests the GET api/v1/bookings/all/:flightId route', async t => {
    
        const mockBookingResponse = [
              {
                "id": 1,
                "seat": 355,
                "createdAt": "2024-04-25T19:20:21.868Z",
                "user" : {
    
                    "name" : "Olawale Thomas",
                    "email" : "ot@primax.com"
                }
              }
            ]
    
         //@ts-ignore
        const getBookingsMock = sinon.mock(bookingsService)
    
        getBookingsMock.expects('fetchBookingsService').once().withArgs('10').rejects(new Error("failed to fetch flight bookings"))
         
        const response = await server.inject({
    
            method : 'GET',
            url : '/api/v1/bookings/all/10'
        }) 
    
        t.equal(response.statusCode,500,'returns a status code of 500')
    
        try{
    
            getBookingsMock.verify()
            t.pass('successfully tested GET api/v1/bookings/all/:id route for failure')
       
           }catch(error){
       
            t.fail('failed to test GET api/v1/bookings/all/:id route for failure')
       
           }

           t.end()
        
    })
    
    
    //fetch boooking route
    
    t.test('tests the GET api/v1/bookings/booking/:id route  for failure', async t =>  {
    
    
        //@ts-ignore
        const getBookingServiceMock = sinon.mock(bookingsService)
    
        getBookingServiceMock.expects('fetchBookingService').once().withArgs(2).rejects(new Error("failed to fetch booking"))
    
        const response = await server.inject({
    
            method : 'GET',
            url : '/api/v1/bookings/booking/2'
        })
    
        t.equal(response.statusCode,500,'expects a response with a status code of 500')
        
    
        try{
    
          getBookingServiceMock.verify()
          t.pass('successfully tested GET api/v1/bookings/booking/:id route for failure')
    
         }catch(error){
    
          t.fail('failed to test GET api/v1/bookings/booking/:id route for failure')
    
         }
        
        t.end()
    
    })
    
    
    //update booking user route
    
    t.test('tests the PATCH api/v1/bookings/booking route for failure', async t =>  {
    
    
        //@ts-ignore
        const updateBookingServiceMock = sinon.mock(bookingsService)
    
        updateBookingServiceMock.expects('updateBookingUserService').once().withArgs({userId : 3, id : 10}).rejects(new Error("user update on booking failed"))
    
        const response = await server.inject({
    
            method : 'PATCH',
            url : '/api/v1/bookings/booking',
            body : {userId : 3, id : 10}
        })
    
        t.equal(response.statusCode,500,'expects a response with a status code of 500')
        
    
        try{
    
          updateBookingServiceMock.verify()
          t.pass('successfully tested PATCH api/v1/bookings/booking route for failure')
    
         }catch(error){
    
          t.fail('failed to test PATCH api/v1/bookings/booking route for failure')
    
         }


         t.end()
    
    
    })
    
    
    //delete booking
    
    
    t.test('tests the DELETE api/v1/bookings/booking/:id route for failure', async t =>  {
    
        //@ts-ignore
        const deleteBookingServiceMock = sinon.mock(bookingsService)
    
        deleteBookingServiceMock.expects('deleteBookingService').once().withArgs(10).rejects(new Error("failed to delete booking"))
    
        const response = await server.inject({
    
            method : 'DELETE',
            url : '/api/v1/bookings/booking/10'
        })
    
        t.equal(response.statusCode,500,'expects a response with a status code of 500')
       
    
        try{
    
          deleteBookingServiceMock.verify()
          t.pass('successfully tested DELETE api/v1/bookings/booking/:id route for failure')
    
         }catch(error){
    
          t.fail('failed to test DELETE api/v1/bookings/booking/:id route for failure')
    
         }


         t.end()
        
      
    
    })


    t.teardown(() => {

        server.close()
        
    })
        
        
    t.end()



})





