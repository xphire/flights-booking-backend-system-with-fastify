import { createFlightController, fetchFlightsController , fetchFlightByIDController , fullUpdateFlightController , partialUpdateFlightController, deleteFlightController } from "./flight.controller";
import { adminAuth } from "../auth/auth";
import { createFlightResponseSchema, createFlightSchema , fetchFlightsResponseSchema , fetchFlightsQuery , fetchFlightByIDQuery , deleteFlightResponseSchema, partialUpdateInputSchema } from "./flight.schema";


export const createFlightRouteOptions = {

    method : 'POST' as const,
    url : '/flight',
    schema : {


        description : 'register a flight',
        tags : ['flights'],
        body : createFlightSchema,

        response : {

            201 : createFlightResponseSchema
        }


    },
    preHandler : adminAuth,
    handler : createFlightController
}


export const fetchFlightsRouteOptions = {

    method : 'GET' as const,
    url : '/all',
    schema : {


        description : 'get all flights',
        tags : ['flights'],
        querystring : fetchFlightsQuery,

        response : {

            200 : fetchFlightsResponseSchema
        }


    },
    preHandler : adminAuth,
    handler : fetchFlightsController
}


export const fetchFlightByIDRouteOptions = {

    method : 'GET' as const,
    url : '/flight/:id',
    schema : {
        
        description : 'get flight  by Id',
        tags : ['flights'],
        params : fetchFlightByIDQuery,

        response : {

            200 : createFlightResponseSchema
        }


    },
    preHandler : adminAuth,
    handler : fetchFlightByIDController
}


export const fullUpdateFlightRouteOptions = {

    method : 'PUT' as const,
    url : '/flight/:id',
    schema : {

        description : 'fully update flight',
        tags : ['flights'],
        params : fetchFlightByIDQuery,
        body : createFlightSchema,

        response : {

            200 : createFlightResponseSchema
        }

    },
    preHandler : adminAuth,
    handler : fullUpdateFlightController

}


export const partialUpdateFlightRouteOptions = {

    method : 'PATCH' as const,
    url : '/flight/:id',
    schema : {

        description : 'partially update flight',
        tags : ['flights'],
        params : fetchFlightByIDQuery,
        body : partialUpdateInputSchema,

        response : {

            200 : createFlightResponseSchema
        }

    },
    preHandler : adminAuth,
    handler : partialUpdateFlightController

}


export const deleteFlightRouteOptions = {

    method : 'DELETE' as const,
    url : '/flight/:id',
    schema : {

        description : 'delete a flight',
        tags : ['flights'],
        params : fetchFlightByIDQuery,

        response : {

            204 : deleteFlightResponseSchema
        }



    },
    preHandler : adminAuth,
    handler : deleteFlightController

}

