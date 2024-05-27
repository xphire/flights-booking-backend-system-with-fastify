import t from 'tap'

import {createServer} from '../../app'

import * as flightService from '../../modules/flights/flight.service'

import * as flightController from '../../modules/flights/flight.controller'

import * as flightSchema from '../../modules/flights/flight.schema'

import sinon from 'sinon'

const server = createServer()

server.decorateRequest('userId','')

server.addHook('preHandler', async (request,_) => {

    request.userId = '3'
})

server.get('/api/v1/flights/all',{
    
    handler : flightController.fetchFlightsController,
    schema : {

        response : {

            200 : flightSchema.fetchFlightsResponseSchema
        }
    }

})


server.post('/api/v1/flights/flight', {

  handler : flightController.createFlightController,
  schema : {

     body : flightSchema.createFlightSchema,

     response : {

        201 : flightSchema.createFlightResponseSchema
     }
  }
})


server.get('/api/v1/flights/flight/:id',{

   
  handler : flightController.fetchFlightByIDController,
  schema : {

     params : flightSchema.fetchFlightByIDQuery,
     response : {

      200 : flightSchema.createFlightResponseSchema
   }
  }
  
})


t.beforeEach(async () => {

    sinon.restore();

})



//create Flight


t.test('tests the POST api/v1/flights/flight route', async t => {



     const mockFlightBody = {

      "description": "flight from Lome Togo to Accra Ghana",
      "seats": 355,
      "date": "2024-04-25T19:20:21.866Z"

     } 


     const createFlightServiceMock = sinon.mock(flightService)

     createFlightServiceMock.expects('createFlightService').once().withArgs({...mockFlightBody, authorId : 3})

    
     const response = await server.inject({

          method : 'POST',
          url : 'api/v1/flights/flight',
          body : mockFlightBody

     })

     
     t.equal(response.statusCode,201,'returns a status code of 201')

     try{

      createFlightServiceMock.verify()
      t.pass('success')

     }catch(error){

      t.fail('failed')

     }

})

//get all flights
t.test('tests the GET api/v1/flights/all route', async t => {

    t.plan(3)

    const mockFlightsResponse = {
        "data": [
          {
            "id": 1,
            "description": "flight from Kaula Lumpur Malaysia to Abuja Nigeria",
            "seats": 355,
            "available": true,
            "filled": 0,
            "createdAt": "2024-04-25T19:20:21.868Z",
            "date": "2024-04-25T19:20:21.866Z"
          },
          {
            "id": 2,
            "description": "flight from Windeohk Namibia to Abuja Nigeria",
            "seats": 378,
            "available": true,
            "filled": 0,
            "createdAt": "2024-04-25T20:51:49.375Z",
            "date": "2024-04-25T20:51:49.373Z"
          },
          {
            "id": 3,
            "description": "flight from Windeohk Namibia to Abuja Nigeria",
            "seats": 378,
            "available": true,
            "filled": 0,
            "createdAt": "2024-04-25T20:52:26.420Z",
            "date": "2024-04-25T20:52:26.419Z"
          }
        ],
        "meta": {
          "count": 3,
          "per_page": 50,
          "page": 1
        }
      }

     //@ts-ignore
    const getFlightsStub = sinon.stub(flightService,'fetchFlightsService').resolves(mockFlightsResponse)
     
    const response = await server.inject({

        method : 'GET',
        url : '/api/v1/flights/all'
    }) 

    t.equal(response.statusCode,200,'returns a status code of 200')
    t.same(response.json(), mockFlightsResponse)
    t.ok(getFlightsStub.calledOnce)


})


//get flight by ID

t.test('tests the GET api/v1/flights/flight/:id route', async t =>  {


      const mockFlightResponse = {
            "id": 2,
            "description": "flight from Windeohk Namibia to Abuja Nigeria",
            "seats": 378,
            "available": true,
            "filled": 0,
            "createdAt": "2024-04-25T20:51:49.375Z",
            "date": "2024-04-25T20:51:49.373Z"
      }

      //@ts-ignore
      const getFlightServiceMock = sinon.mock(flightService)

      getFlightServiceMock.expects('fetchFlightByIDService').once().withArgs('2').resolves(mockFlightResponse)

      const response = await server.inject({

          method : 'GET',
          url : '/api/v1/flights/flight/2'
      })

      t.equal(response.statusCode,200,'expects a response with a status code of 200')
      t.same(response.json(),mockFlightResponse)

      try{

        getFlightServiceMock.verify()
        t.pass('success')
  
       }catch(error){
  
        t.fail('failed')
  
       }
      
    

})


t.teardown(() => {

  server.close()

})


