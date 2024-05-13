import {JSONSchemaType} from "ajv";

export interface createBookingInput{

    userId : number,
    flightId : number
    
}

export interface createBookingResponse {

    id : number,
    createdAt : string,
    user : {

        name : string,
        email : string

    },
    seat  : number,
    flight : {
        description : string,
        date : string
    }
}

export interface updateBookingInput {

    userId: number,
    id : number
}


export type bookingIdInput = Pick<updateBookingInput,"id"> 

export type flightIdInput =  Pick<createBookingInput,"flightId"> 

export type fetchBookingsResponse = Omit<createBookingResponse,"flight">[]

export const createBookingInputSchema : JSONSchemaType<Pick<createBookingInput,"flightId">> = {

    type : "object",
    properties : {
        flightId: {type: "number"}
    },
    required: ["flightId"],
    additionalProperties: false

}


export const createBookingResponseSchema : JSONSchemaType<createBookingResponse> = {

    type : "object",
    properties : {

        id : {type : "number"},
        createdAt : {type : "string", format : "date-time"},
        user : {

            type : "object",
            properties : {
                name : {type : "string"},
                email : {type : "string", format: "email"}
            },
            required : ["name","email"],
            additionalProperties : false
        },
        seat : {type : "number"},
        flight : {
            type : "object",
            properties : {
                description : {type : "string"},
                date : {type : "string", format: "date-time"}
            },
            required : ["description", "date"],
            additionalProperties : false
        }
    },
    required : ["id", "createdAt", "user", "seat", "flight"],
    additionalProperties: false
}

export const updateBookingInputSchema : JSONSchemaType<updateBookingInput> = {

    type : "object",
    properties : {
        userId: {type: "number"},
        id: {type: "number"}
    },
    required: ["userId", "id"],
    additionalProperties: false
}


export const bookingInputRequestSchema : JSONSchemaType<bookingIdInput> = {

    type : "object",
    properties : {
        id: {type: "number"}
    },
    required: [ "id"],
    additionalProperties: false
}

export const flightInputRequestSchema : JSONSchemaType<flightIdInput> = {

    type : "object",
    properties : {
        flightId: {type: "number"}
    },
    required: [ "flightId"],
    additionalProperties: false
}


export const bookingsFetchResponseSchema : JSONSchemaType<fetchBookingsResponse> = {

     type : "array",
     items : {

        type : "object",
        properties : {

            id : {type : "number"},
            createdAt : {type : "string", format : "date-time"},
            user : {
    
                type : "object",
                properties : {
                    name : {type : "string"},
                    email : {type : "string", format: "email"}
                },
                required : ["name","email"],
                additionalProperties : false
            },
            seat : {type : "number"}
        },
        required : ["id","createdAt", "user", "seat"],
        additionalProperties: false
        }
}


export const deleteBookingResponseSchema : JSONSchemaType<{message : string}> = {

    type : 'object',
    properties : {
  
      message: {type : 'string'}
    },
    additionalProperties : false,
    required : ['message']
}
