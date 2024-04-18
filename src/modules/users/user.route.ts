import { createUserController , fetchUserByIDController, fetchUsersController , fullUpdateUserController , partialUpdateUserController , deleteUserController } from "./user.controller";

import { createUserSchema , createUserResponseSchema , fetchUsersResponseSchema , fetchUsersQuery , fetchUserByIDQuery } from "./user.schema";

import { adminAuth } from "../auth/auth";

export const createUserRouteOptions = {

    method : 'POST' as const,
    url : '/user',
    schema : {

        body : createUserSchema,

        response : {

            201 : createUserResponseSchema
        }


    },
    handler : createUserController
} 


export const fetchUsersRouteOptions = {

    method : 'GET' as const,
    url : '/all',
    schema : {

        querystring : fetchUsersQuery,

        response : {

            200 : fetchUsersResponseSchema
        }


    },
    preHandler : adminAuth,
    handler : fetchUsersController
} 


export const fetchUserByIDRouteOptions = {

    method : 'GET' as const,
    url : '/user/:id',
    schema : {

        queryparam : fetchUserByIDQuery,

        response : {

            200 : createUserResponseSchema
        }


    },
    preHandler : adminAuth,
    handler : fetchUserByIDController
}

export const fullUpdateUserRouteOptions = {

    method : 'PUT' as const,
    url : '/user/:id',
    schema : {


        queryparam : fetchUserByIDQuery,

        response : {

            200 : createUserResponseSchema
        }

    },
    preHandler : adminAuth,
    handler : fullUpdateUserController

}


export const partialUpdateUserRouteOptions = {

    method : 'PATCH' as const,
    url : '/user/:id',
    schema : {


        queryparam : fetchUserByIDQuery,

        response : {

            200 : createUserResponseSchema
        }

    },
    preHandler : adminAuth,
    handler : partialUpdateUserController

}

export const deleteUserRouteOptions = {

    method : 'DELETE' as const,
    url : '/user/:id',
    schema : {


        queryparam : fetchUserByIDQuery,


    },
    preHandler : adminAuth,
    handler : deleteUserController

}