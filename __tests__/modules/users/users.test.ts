import tap from 'tap'

import {createServer} from '../../../src/app'

import * as userService from '../../../src/modules/users/user.service'

import * as userController from '../../../src/modules/users/user.controller'

import * as userSchema from '../../../src/modules/users/user.schema'

import sinon from 'sinon'

import { adminAuth } from '../../../src/modules/auth/auth'


//create fastify instance, register routes 

const server = createServer()

///add routes

//create user route

server.post('/api/v1/users/user', {

    handler : userController.createUserController,
    schema : {
  
       body : userSchema.createUserSchema,
  
       response : {
  
          201 : userSchema.createUserResponseSchema
       }
    }
})


//get all users route


server.get('/api/v1/users/all',{

    //preHandler : adminAuth,
    handler : userController.fetchUsersController,
    schema : {

        response : {

            200 : userSchema.fetchUsersResponseSchema
        },
        querystring : userSchema.fetchUsersQuery
    }
})


//get user by Id route


server.get('/api/v1/users/user/:id',{

   // preHandler : adminAuth,
    handler : userController.fetchUserByIDController,
    schema : {
  
       params : userSchema.fetchUserByIDQuery,
       response : {
  
        200 : userSchema.createUserResponseSchema
     }
    }
    
})


//full update user by Id route


server.put('/api/v1/users/user/:id',{

    // preHandler : adminAuth,
    handler : userController.fullUpdateUserController,
    schema : {
  
       params : userSchema.fetchUserByIDQuery,
       body : userSchema.createUserSchema,
       response : {

        200 : userSchema.createUserResponseSchema
     }
    }
    
  })


//partial update user by Id route


server.patch('/api/v1/users/user/:id',{

    //preHandler : adminAuth,
    handler : userController.partialUpdateUserController,
    schema : {
  
       params : userSchema.fetchUserByIDQuery,
       response : {

        200 : userSchema.createUserResponseSchema
     }
    }
    
})


//delete user route option

server.delete('/api/v1/users/user/:id',{

   // preHandler : adminAuth,
    handler : userController.deleteUserController,
    schema : {
  
       params : userSchema.fetchUserByIDQuery,
       response : {

        200 : userSchema.deleteUserResponseSchema

     }
    }
    
})


tap.test("test the Users routes", async t => {


    t.beforeEach(async () => {

        sinon.restore();
      
      })
      
      t.before(async () => {
      
        await server.ready()
    })


    //create user


 t.test('tests the POST api/v1/users/user route', async t => {



    const mockUserBody = {
 
     "name": "Abegunde Okanlawon",
     "email": "abo@test.com",
     "password": "abo@test.com"
 
    } 
 
 
    const createUserServiceMock = sinon.mock(userService)
 
    createUserServiceMock.expects('createUserService').once().withArgs(mockUserBody)
 
   
    const response = await server.inject({
 
         method : 'POST',
         url : 'api/v1/users/user',
         body : mockUserBody
 
    })
 
    
    t.equal(response.statusCode,201,'returns a status code of 201')
 
    try{
 
     createUserServiceMock.verify()
     t.pass('successfully tested POST api/v1/Users/user route')
 
    }catch(error){
 
     t.fail('failed to test POST api/v1/Users/user route')
 
    }
 
    t.end()
 
 })


 //get all users
t.test('tests the GET api/v1/users/all route', async t => {

     
     const getUsersResponse = {

        data : [
            {
                id : 1,
                name : "Abegunde Okanlawon",
                role : 'USER',
                email : 'abo@tetst.com'
            }
        ],
        meta : {
            count : 1,
            per_page : 15,
            page : 2
        }
     }
  
     //@ts-ignore
     const getUsersServiceMock = sinon.mock(userService) 

     getUsersServiceMock.expects('fetchUsersService').once().withArgs('15','2').resolves(getUsersResponse)
     
     const response = await server.inject({
  
        method : 'GET',
        url : '/api/v1/users/all?perPage=15&page=2'
     }) 
  
     t.equal(response.statusCode,200,'returns a status code of 200')


     try{
 
        getUsersServiceMock.verify()
        t.pass('successfully tested GET api/v1/users/all route')
    
       }catch(error){
    
        t.fail('failed to test GET api/v1/users/all route')
    
       }

  
  
    t.end()
  
  
  })


  //get user by ID

t.test('tests the GET api/v1/users/user/:id route', async t =>  {


    const mockUserResponse = {
          id : 5,
          name : 'Adewale Adekanbi',
          createdAt : '2024-04-30T20:51:49.373Z',
          email : 'adewalekanbi@gmail.com',
          role : 'USER'
    }

    //@ts-ignore
    const userServiceMock = sinon.mock(userService)

    userServiceMock.expects('fetchUserByIDService').once().withArgs('2').resolves(mockUserResponse)

    const response = await server.inject({

        method : 'GET',
        url : '/api/v1/users/user/2'
    })

    t.equal(response.statusCode,200,'expects a response with a status code of 200')
    t.same(response.json(),mockUserResponse)

    try{

      userServiceMock.verify()
      t.pass('successfully tested GET api/v1/users/user/:id route')

     }catch(error){

      t.fail('failed to test GET api/v1/users/user/:id route')

     }
    
   t.end()

})


 //test full update user by ID route


 t.test('tests the PUT api/v1/users/user/:id route', async t => {

    //payload

    const mockPayload =  {

                "name": "Abegunde Okanlawon",
                "email": "abo@test.com",
                "password": "abo@test.com",
                "role" : 'ADMIN'

    }


    //mock
    const userServiceMock = sinon.mock(userService)

    userServiceMock.expects('fullUpdateUserService').once().withArgs('2',mockPayload)

    //response 

    const response = await server.inject({

      method : 'PUT',
      url : 'api/v1/users/user/2',
      body : mockPayload
    })

    //assertions

    t.equal(response.statusCode, 200)

    try{

       userServiceMock.verify()
       t.pass('successfully tested PUT api/v1/users/user:id route')
    }catch(error){
       t.fail('failed to test PUT api/v1/users/user/:id route')
    }

    t.end()
 })




 //test partial update user by ID route


 t.test('tests the PATCH api/v1/users/user/:id route', async t => {

    //payload
    
    const mockPayload =  {
    
       role : 'ADM'
    
    }

    
    //mock
    const userServiceMock = sinon.mock(userService)
    
    userServiceMock.expects('partialUpdateUserService').once().withArgs('5',mockPayload)
    
    //response 
    
    const response = await server.inject({
    
      method : 'PATCH',
      url : 'api/v1/users/user/5',
      body : mockPayload
    })
    
    //assertions
    
    t.equal(response.statusCode, 200)
    
    try{
    
       userServiceMock.verify()
       t.pass('successfully tested PATCH api/v1/users/user:id route')
    }catch(error){
       t.fail('failed to test PATCH api/v1/users/user/:id route')
    }
    
      t.end()
    })



    //test delete user by ID route



    t.test('tests the DELETE api/v1/users/user/:id route', async t => {

        
        //mock
        const userServiceMock = sinon.mock(userService)
        
        userServiceMock.expects('deleteUserService').once().withArgs('10')
        
        //response 
        
        const response = await server.inject({
        
          method : 'DELETE',
          url : 'api/v1/users/user/10'
        })
        
        //assertions
        
        t.equal(response.statusCode, 204)
        
        
        try{
        
           userServiceMock.verify()
           t.pass('successfully tested DELETE api/v1/users/user:id route')
        }catch(error){
           t.fail('failed to test DELETE api/v1/users/user/:id route')
        }
        
        
           t.end()
        })

/////////////ERROR TESTING//////////////////////////////////////////////////////////////////////

  
  //create user


  t.test('tests the POST api/v1/users/user route FOR failure', async t => {



    const mockUserBody = {
    
        "name": "Abegunde Okanlawon",
        "email": "abo@test.com",
        "password": "abo@test.com",
        "role" : "USER"
    
    }
    
    const userServiceMock = sinon.mock(userService)
    
    userServiceMock.expects('createUserService').once().withArgs(mockUserBody).rejects(new Error("user creation failed"))

    
    const response = await server.inject({
    
         method : 'POST',
         url : 'api/v1/users/user',
         body : mockUserBody
    
    })
    
     t.equal(response.statusCode,500,'returns a status code of 500')
     t.hasProp(response.json(),'error')
   

    try{
    
     userServiceMock.verify()
     t.pass('successfully tested POST api/v1/users/user route for failure')
    
    }catch(error){
    
     t.fail('failed to test POST api/v1/users/user route for failure')
    
    }
    
    
      t.end()
    
  })


  //get all users


  t.test('tests the GET api/v1/users/all route for failure', async t => {

    
    const userServiceMock = sinon.mock(userService)
   
    userServiceMock.expects('fetchUsersService').once().withArgs('50','1').rejects(new Error("failed to fetch users"))
   
   //  userServiceMock.expects('fetchusersService').once().rejects(new Error("failed to fetch users"))
    
   const response = await server.inject({
   
       method : 'GET',
       url : '/api/v1/users/all?perPage=50&page=1'
   }) 
   
   t.equal(response.statusCode,500,'returns a status code of 500')
   t.hasProp(response.json(),'error')
   
   try{
   
     userServiceMock.verify()
     t.pass('successfully tested GET api/v1/users/user route for failure')
   
    }catch(error){
   
     t.fail('failed to test GET api/v1/users/user route for failure')
   
    }
   
   
      t.end()
   
   
   })



 //get user by ID

 t.test('tests the GET api/v1/users/user/:id route for failure', async t =>  {


    //@ts-ignore
    const userServiceMock = sinon.mock(userService)
    
    userServiceMock.expects('fetchUserByIDService').once().withArgs('2').rejects(new Error('failed to fetch user with given ID'))
    
    const response = await server.inject({
    
        method : 'GET',
        url : '/api/v1/users/user/2'
    })
    
    t.equal(response.statusCode,500,'expects a response with a status code of 500')
    t.hasProp(response.json(),'error')
    
    try{
    
      userServiceMock.verify()
      t.pass('successfully tested GET api/v1/users/user/:id route for failure')
    
     }catch(error){
    
      t.fail('failed to test GET api/v1/users/user/:id route for failure')
    
     }
    
      t.end()
    
    })
 
 //full update user 


 t.test('tests the PUT api/v1/users/user/:id route for failure', async t => {

    //payload
    
    const mockPayload =  {
    
        "name": "Abegunde Okanlawon",
        "email": "abo@test.com",
        "password": "abo@test.com",
        "role" : "USER"
    
    }
    
    //mock
    const userServiceMock = sinon.mock(userService)
    
    userServiceMock.expects('fullUpdateUserService').once().withArgs('2',mockPayload).rejects(new Error('failed to update'))
    
    //response 
    
    const response = await server.inject({
    
      method : 'PUT',
      url : 'api/v1/users/user/2',
      body : mockPayload
    })
    
    //assertions
    
    t.equal(response.statusCode, 500)
    t.hasProp(response.json(),'error')
    
    try{
    
       userServiceMock.verify()
       t.pass('successfully tested PUT api/v1/users/user:id route for failure')
    }catch(error){
       t.fail('failed to test PUT api/v1/users/user/:id route for failure')
    }
    
      t.end()
 })


 //partial update user


 t.test('tests the PATCH api/v1/users/user/:id route for failure', async t => {

    //payload
    
    const mockPayload =  {
    
      role : 'ADMIN'
    
    }
    
    //mock
    const userServiceMock = sinon.mock(userService)
    
    userServiceMock.expects('partialUpdateUserService').once().withArgs('5',mockPayload).rejects(new Error('partial update failed'))
    
    //response 
    
    const response = await server.inject({
    
      method : 'PATCH',
      url : 'api/v1/users/user/5',
      body : mockPayload
    })
    
    //assertions
    
    t.equal(response.statusCode, 500)
    t.hasProp(response.json(), 'error')
    
    try{
    
       userServiceMock.verify()
       t.pass('successfully tested PATCH api/v1/users/user:id route for failure')
    }catch(error){
       t.fail('failed to test PATCH api/v1/users/user/:id route for failure')
    }
    
      t.end()
 })


 //delete user


 t.test('tests the DELETE api/v1/users/user/:id route for failure', async t => {


    //mock
    const userServiceMock = sinon.mock(userService)
    
    userServiceMock.expects('deleteUserService').once().withArgs('10').rejects(new Error ('deletion failed'))
    
    //response 
    
    const response = await server.inject({
    
      method : 'DELETE',
      url : 'api/v1/users/user/10'
    })
    
    //assertions
    
    t.equal(response.statusCode, 500)
    t.hasProp(response.json(),'error')
    
    
    try{
    
       userServiceMock.verify()
       t.pass('successfully tested DELETE api/v1/users/user:id route for failure')
    }catch(error){
       t.fail('failed to test DELETE api/v1/users/user/:id route for failure')
    }
    
       t.end()
 })

    t.teardown(() => {

    server.close()
    
    })
    


  t.end()

})


