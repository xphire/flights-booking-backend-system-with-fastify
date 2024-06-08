import tap from 'tap'

import {createServer} from '../../../src/app'

import * as flightService from '../../../src/modules/flights/flight.service'

import * as flightController from '../../../src/modules/flights/flight.controller'

import * as flightSchema from '../../../src/modules/flights/flight.schema'

import sinon from 'sinon'





//create fastify instance, register routes 

const server = createServer()

server.decorateRequest('userId','')

server.addHook('preHandler', async (request,_) => {

    request.userId = '3'
})

//get all flights route

server.get('/api/v1/flights/all',{
    
    handler : flightController.fetchFlightsController,
    schema : {

        response : {

            200 : flightSchema.fetchFlightsResponseSchema
        }
    }

})

//create flight route 

server.post('/api/v1/flights/flight', {

  handler : flightController.createFlightController,
  schema : {

     body : flightSchema.createFlightSchema,

     response : {

        201 : flightSchema.createFlightResponseSchema
     }
  }
})

//get flight by ID controller

server.get('/api/v1/flights/flight/:id',{

   
  handler : flightController.fetchFlightByIDController,
  schema : {

     params : flightSchema.fetchFlightByIDQuery,
     response : {

      200 : flightSchema.createFlightResponseSchema
   }
  }
  
})


//full update flight by ID controller

server.put('/api/v1/flights/flight/:id',{

  handler : flightController.fullUpdateFlightController,
  schema : {

    params : flightSchema.fetchFlightByIDQuery,
    body : flightSchema.createFlightSchema,
    response : {

      200 : flightSchema.createFlightResponseSchema
    }
  }



})


//partial update flight by ID controller

server.patch('/api/v1/flights/flight/:id',{

   handler  : flightController.partialUpdateFlightController,
   schema : {

    params : flightSchema.fetchFlightByIDQuery,
    body : flightSchema.partialUpdateInputSchema,
    response : {

      200 : flightSchema.createFlightResponseSchema
    }
  }
})


//delete flight 


server.delete('/api/v1/flights/flight/:id', {

    handler : flightController.deleteFlightController,
    schema : {
       
      params : flightSchema.fetchFlightByIDQuery,
      response : {

          204 : flightSchema.deleteFlightResponseSchema
      }
    }
})


tap.test("test the flights routes", async t => {


  
t.beforeEach(async () => {

  sinon.restore();

})

t.before(async () => {

  await server.ready()
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
    t.pass('successfully tested POST api/v1/flights/flight route')

   }catch(error){

    t.fail('failed to test POST api/v1/flights/flight route')

   }

   t.end()

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


  t.end()


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
      t.pass('successfully tested GET api/v1/flights/flight/:id route')

     }catch(error){

      t.fail('failed to test GET api/v1/flights/flight/:id route')

     }
    
   t.end()

})


//update flight by ID

t.test('tests the PUT api/v1/flights/flight/:id route', async t => {

    //payload

    const mockPayload =  {

      "description": "flight from Windeohk Namibia to Abuja Nigeria",
      "seats": 200,
      "date": "2024-04-30T20:51:49.373Z",
      "authorId" : 3

    }

    //response 

    const mockResponse = {

      "id": 2,
      "description": "flight from Windeohk Namibia to Abuja Nigeria",
      "seats": 200,
      "available": true,
      "filled": 0,
      "createdAt": "2024-04-25T20:51:49.375Z",
      "date": "2024-04-30T20:51:49.373Z"

    }

    //mock
    const fullUpdateFlightServiceMock = sinon.mock(flightService)

    fullUpdateFlightServiceMock.expects('fullUpdateFlightService').once().withArgs('2',mockPayload).resolves(mockResponse)

    //response 

    const response = await server.inject({

      method : 'PUT',
      url : 'api/v1/flights/flight/2',
      body : mockPayload
    })

    //assertions

    t.equal(response.statusCode, 200)
    t.same(response.json(),mockResponse)

    try{

       fullUpdateFlightServiceMock.verify()
       t.pass('successfully tested PUT api/v1/flights/flight:id route')
    }catch(error){
       t.fail('failed to test PUT api/v1/flights/flight/:id route')
    }

    t.end()
})


//partial update 


t.test('tests the PATCH api/v1/flights/flight/:id route', async t => {

//payload

const mockPayload =  {

  "description": "flight from Kano Nigeria to Cassablanca Morocco",
  "seats": 500,
  "date": "2024-06-30T20:51:49.373Z",
  "available" : false

}

//response 

const mockResponse = {

  "id": 5,
  "description": "flight from Kano Nigeria to Cassablanca Morocco",
  "seats": 500,
  "available": false,
  "filled": 0,
  "createdAt": "2024-03-25T20:51:49.375Z",
  "date": "2024-03-30T20:51:49.373Z"

}

//mock
const partialUpdateFlightServiceMock = sinon.mock(flightService)

partialUpdateFlightServiceMock.expects('partialUpdateFlightService').once().withArgs('5',mockPayload).resolves(mockResponse)

//response 

const response = await server.inject({

  method : 'PATCH',
  url : 'api/v1/flights/flight/5',
  body : mockPayload
})

//assertions

t.equal(response.statusCode, 200)
t.same(response.json(),mockResponse)

try{

   partialUpdateFlightServiceMock.verify()
   t.pass('successfully tested PATCH api/v1/flights/flight:id route')
}catch(error){
   t.fail('failed to test PATCH api/v1/flights/flight/:id route')
}

  t.end()
})


//delete flight


t.test('tests the DELETE api/v1/flights/flight/:id route', async t => {

//response 

const mockResponse = {

     "message" : `Flight with ID 10 successfully deleted`

}

//mock
const deleteFlightServiceMock = sinon.mock(flightService)

deleteFlightServiceMock.expects('deleteFlightService').once().withArgs('10').resolves(mockResponse)

//response 

const response = await server.inject({

  method : 'DELETE',
  url : 'api/v1/flights/flight/10'
})

//assertions

t.equal(response.statusCode, 204)


try{

   deleteFlightServiceMock.verify()
   t.pass('successfully tested DELETE api/v1/flights/flight:id route')
}catch(error){
   t.fail('failed to test DELETE api/v1/flights/flight/:id route')
}


   t.end()
})


////////ERROR TESTING/////////////////////////////////////////////////

//create Flight

t.test('tests the POST api/v1/flights/flight route FOR failure', async t => {



const mockFlightBody = {

 "description": "flight from Lome Togo to Accra Ghana",
 "seats": 355,
 "date": "2024-04-25T19:20:21.866Z"

}

const createFlightServiceMock = sinon.mock(flightService)

createFlightServiceMock.expects('createFlightService').once().withArgs({...mockFlightBody, authorId : 3}).rejects(new Error("flight creation failed"))


const response = await server.inject({

     method : 'POST',
     url : 'api/v1/flights/flight',
     body : mockFlightBody

})


 t.equal(response.statusCode,500,'returns a status code of 500')
 t.hasProp(response.json(),'error')

try{

 createFlightServiceMock.verify()
 t.pass('successfully tested POST api/v1/flights/flight route for failure')

}catch(error){

 t.fail('failed to test POST api/v1/flights/flight route for failure')

}


  t.end()

})


//get all flights
t.test('tests the GET api/v1/flights/all route for failure', async t => {

 //@ts-ignore
 const getFlightsServiceMock = sinon.mock(flightService)

 getFlightsServiceMock.expects('fetchFlightsService').once().withArgs('50','1').rejects(new Error("failed to fetch flights"))

//  getFlightsServiceMock.expects('fetchFlightsService').once().rejects(new Error("failed to fetch flights"))
 
const response = await server.inject({

    method : 'GET',
    url : '/api/v1/flights/all?perPage=50&page=1'
}) 

t.equal(response.statusCode,500,'returns a status code of 500')
t.hasProp(response.json(),'error')

try{

  getFlightsServiceMock.verify()
  t.pass('successfully tested GET api/v1/flights/flight route for failure')

 }catch(error){

  t.fail('failed to test GET api/v1/flights/flight route for failure')

 }


   t.end()


})


//get flight by ID

t.test('tests the GET api/v1/flights/flight/:id route for failure', async t =>  {


//@ts-ignore
const getFlightServiceMock = sinon.mock(flightService)

getFlightServiceMock.expects('fetchFlightByIDService').once().withArgs('2').rejects(new Error('failed to fetch flight with given ID'))

const response = await server.inject({

    method : 'GET',
    url : '/api/v1/flights/flight/2'
})

t.equal(response.statusCode,500,'expects a response with a status code of 500')
t.hasProp(response.json(),'error')

try{

  getFlightServiceMock.verify()
  t.pass('successfully tested GET api/v1/flights/flight/:id route for failure')

 }catch(error){

  t.fail('failed to test GET api/v1/flights/flight/:id route for failure')

 }

  t.end()

})


//update flight by ID

t.test('tests the PUT api/v1/flights/flight/:id route for failure', async t => {

//payload

const mockPayload =  {

  "description": "flight from Windeohk Namibia to Abuja Nigeria",
  "seats": 200,
  "date": "2024-04-30T20:51:49.373Z",
  "authorId" : 3

}

//mock
const fullUpdateFlightServiceMock = sinon.mock(flightService)

fullUpdateFlightServiceMock.expects('fullUpdateFlightService').once().withArgs('2',mockPayload).rejects(new Error('failed to update'))

//response 

const response = await server.inject({

  method : 'PUT',
  url : 'api/v1/flights/flight/2',
  body : mockPayload
})

//assertions

t.equal(response.statusCode, 500)
t.hasProp(response.json(),'error')

try{

   fullUpdateFlightServiceMock.verify()
   t.pass('successfully tested PUT api/v1/flights/flight:id route for failure')
}catch(error){
   t.fail('failed to test PUT api/v1/flights/flight/:id route for failure')
}


  t.end()
})


//partial update 


t.test('tests the PATCH api/v1/flights/flight/:id route for failure', async t => {

//payload

const mockPayload =  {

  "description": "flight from Kano Nigeria to Cassablanca Morocco",
  "seats": 500,
  "date": "2024-06-30T20:51:49.373Z",
  "available" : false

}

//mock
const partialUpdateFlightServiceMock = sinon.mock(flightService)

partialUpdateFlightServiceMock.expects('partialUpdateFlightService').once().withArgs('5',mockPayload).rejects(new Error('partial update failed'))

//response 

const response = await server.inject({

  method : 'PATCH',
  url : 'api/v1/flights/flight/5',
  body : mockPayload
})

//assertions

t.equal(response.statusCode, 500)
t.hasProp(response.json(), 'error')

try{

   partialUpdateFlightServiceMock.verify()
   t.pass('successfully tested PATCH api/v1/flights/flight:id route for failure')
}catch(error){
   t.fail('failed to test PATCH api/v1/flights/flight/:id route for failure')
}

  t.end()
})



//delete flight


t.test('tests the DELETE api/v1/flights/flight/:id route for failure', async t => {


//mock
const deleteFlightServiceMock = sinon.mock(flightService)

deleteFlightServiceMock.expects('deleteFlightService').once().withArgs('10').rejects(new Error ('deletion failed'))

//response 

const response = await server.inject({

  method : 'DELETE',
  url : 'api/v1/flights/flight/10'
})

//assertions

t.equal(response.statusCode, 500)
t.hasProp(response.json(),'error')


try{

   deleteFlightServiceMock.verify()
   t.pass('successfully tested DELETE api/v1/flights/flight:id route for failure')
}catch(error){
   t.fail('failed to test DELETE api/v1/flights/flight/:id route for failure')
}

   t.end()
})

t.teardown(() => {

server.close()

})


 t.end()


})







