import prisma from "../../../utils/prisma";

import tap from 'tap'

import sinon from 'sinon'

import * as flightService from '../../../src/modules/flights/flight.service'

//import { createFlightInput } from "../../../src/modules/flights/flight.schema";


tap.test("testing the flights service" , async t => {



    t.beforeEach( async => {

        sinon.restore();
      
    })


    const dbSelection = {

        id : true,
        createdAt : true,
        available : true,
        date : true,
        description : true,
        seats : true,
        filled : true
}


     


    t.test('testing the createFlightService Function', async t => {



        const payload  = {

            "description": "flight from Lome Togo to Accra Ghana",
            "seats": 355,
            "date": "2024-04-25T19:20:21.866Z",
            "authorId" : 3
        }


        const res =  {

            id : 5,
            createdAt : '2024-04-25T19:20:21.866Z' as unknown as Date,
            available : true,
            date : '2024-04-25T19:20:21.866Z' as unknown as Date,
            description : 'flight from Lome Togo to Accra Ghana',
            seats : 355,
            filled : 0,
            updatedAt : '2024-04-25T19:20:21.866Z' as unknown as Date,
            authorId : 3
        }

        const prismaStub = sinon.stub(prisma.flight,'create').resolves(res)

         // Call the actual createFlightService function
         const response = await flightService.createFlightService(payload);

         t.same(response,res,'response matches expected DB response')

        
        try{

            sinon.assert.calledOnceWithExactly(prismaStub,{data : payload, select : {...dbSelection}})
            t.pass('successfully tested the create flight function')

        }catch(error){
            t.fail('failed to test the create flight function')
        }

       
       // Restore the stubs
       prismaStub.restore();
       

        
    })



    t.end()
})