import * as controller from "./booking.controller";
import { createBookingInputSchema, createBookingResponseSchema ,updateBookingInputSchema , flightInputRequestSchema , bookingsFetchResponseSchema , bookingInputRequestSchema, deleteBookingResponseSchema } from "./booking.schema";
import { userAuth, adminAuth } from "../auth/auth";


export const createBookingRouteOptions = {

    method : 'POST' as const,
    url : '/booking',
    schema : {

        description : 'create a flight booking',
        tags : ['bookings'],

        body : createBookingInputSchema,

        response : {

            201 : createBookingResponseSchema
        }


    },
    preHandler : userAuth,
    handler : controller.createBookingController

}


export const updateBookingUserRouteOptions = {

    method : 'PUT' as const,
    url : '/booking',
    schema : {


        description : 'update user on booking',
        tags : ['bookings'],
        body : updateBookingInputSchema,
        response : {

            200 : createBookingResponseSchema
        }
    },
    preHandler : adminAuth,
    handler : controller.updateBookingUserController
}


export const fetchBookingsRouteOptions = {

    method : 'GET' as const,
    url : '/all/:flightId',
    schema : {

        description : 'get all bookings',
        tags : ['bookings'],
        params : flightInputRequestSchema,
        response : {

            200 : bookingsFetchResponseSchema
        }
    },
    preHandler : adminAuth,
    handler : controller.fetchBookingsController
}


export const deleteBookingRouteOptions = {

    method : 'DELETE' as const,
    url : '/booking/:id',
    schema : {
        
        description : 'delete booking',
        tags : ['bookings'],
        params : bookingInputRequestSchema,
        response : {

            204 : deleteBookingResponseSchema
        }
    },
    preHandler : adminAuth,
    handler : controller.deleteBookingController
}


export const fetchBookingRouteOptions = {

    method : 'GET' as const,
    url : '/booking/:id',
    schema : {
        
        description : 'get booking',
        tags : ['bookings'],
        params : bookingInputRequestSchema,
        response : {

            200 : createBookingResponseSchema
        }
    },
    preHandler : adminAuth,
    handler : controller.fetchBookingController
}



