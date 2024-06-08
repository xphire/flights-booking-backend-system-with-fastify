import { createUserController , fetchUserByIDController, fetchUsersController , fullUpdateUserController , partialUpdateUserController , deleteUserController } from "./user.controller";

import { createUserSchema , createUserResponseSchema , fetchUsersResponseSchema , fetchUsersQuery , fetchUserByIDQuery , deleteUserResponseSchema } from "./user.schema";

import { adminAuth } from "../auth/auth";

export const createUserRouteOptions = {

    method : 'POST' as const,
    url : '/user',
    schema : {


        description : 'create a user',
        tags : ['users'],
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
    security : [
        
        {
                bearerAuth : []
        }

    ],
    schema : {


        description : 'get all users',
        tags : ['users'],
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
        
        description : 'get user by Id',
        tags : ['users'],
        params : fetchUserByIDQuery,

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

        description : 'get user by Id',
        tags : ['users'],
        params : fetchUserByIDQuery,
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

        description : 'partially update user',
        tags : ['users'],
        params : fetchUserByIDQuery,
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

        description : 'delete a user',
        tags : ['users'],
        params : fetchUserByIDQuery,
        response : {

            204 : deleteUserResponseSchema
        }



    },
    preHandler : adminAuth,
    handler : deleteUserController

}