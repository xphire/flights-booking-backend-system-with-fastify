import {JSONSchemaType} from "ajv";


export interface createFlightInput {
    date : string,
    description : string,
    seats : number,
    authorId : number

}

export interface createFlightResponse {

    id : number,
    available : boolean,
    createdAt : string,
    date : string,
    seats : number,
    filled : number,
    description : string

}

export interface fetchFlightsQuery  {
   
    perPage? : string,
    page? : string
    
 }
 
 export interface meta  {
 
   per_page : number,
   page : number,
   count : number
   
 }
 
 export type fetchFlightsResponse =   {
 
    data : createFlightResponse[],
    meta : meta
 
 }


 export interface partialUpdateInput {

    description? : string,
    seats? : number,
    available? : boolean,
    date?: string
 }


export const createFlightSchema : JSONSchemaType<createFlightInput> = {

    type : "object",
    properties : {
        date: {type: "string", format: "date-time"},//The date is the internet Date/Time Format and can be obtained with the new Date().toISOString() function
        description: {type: "string"},
        seats: {type: "number"},
        authorId : {type : "number"}
    },
    required: ["date","description", "seats"],
    additionalProperties: false

}


export const createFlightResponseSchema : JSONSchemaType<createFlightResponse> = {

    type : "object",
    properties : {
        id: {type: "number"},
        description: {type: "string"},
        seats: {type: "number"},
        available : {type : "boolean"},
        filled: {type: "number"},
        createdAt: {type: "string"},
        date : {type: "string", format : "date-time"}
    },
    required: ["id","description", "seats","available","filled","createdAt","date"],
    additionalProperties: false

}



export const fetchFlightsResponseSchema: JSONSchemaType<fetchFlightsResponse> = {
   
    type: "object",
    properties: {
      data: {
        
      type: "array" , 
      items : {type : "object" , properties : {
  
  
        id: {type: "number"},
        description: {type: "string"},
        seats: {type: "number"},
        available : {type : "boolean"},
        filled: {type: "number"},
        createdAt: {type: "string"},
        date : {type: "string", format : "date-time"}
  
  
      } ,additionalProperties : false , required : ["id", "description", "seats", "available","filled","createdAt","date"]}
      },
      meta : {type : "object" , properties : { 
        
        count : {type : 'number'},
        per_page : {type : 'number'},
        page : {type : 'number'}
      
      }, 
      additionalProperties : false , required : ["count", "per_page", "page"]},
  
    },
    additionalProperties: false,
    required : ["data","meta"] ,
    
}


export const fetchFlightsQuery : JSONSchemaType<fetchFlightsQuery> = {

    type : "object",
    properties : {
 
     perPage : {type : 'string', nullable : true},
     page : {type : 'string', nullable : true}
 
     }
 
 
 }
 
 export const fetchFlightByIDQuery : JSONSchemaType<{id : string}> = {
 
     type : 'object',
     properties : {
 
       id : {type : 'string', nullable : false}
     },
     additionalProperties : false,
     required : ['id']
}

export const partialUpdateInputSchema : JSONSchemaType<partialUpdateInput> = {

      type : 'object',
      properties : {

          description : {type : 'string' , nullable : true},
          date : {type : 'string', format : 'date-time',nullable : true},
          seats : {type : 'number', nullable : true},
          available : {type : 'boolean', nullable : true}
      },
      additionalProperties : false
}


export const deleteFlightResponseSchema : JSONSchemaType<{message : string}> = {

    type : 'object',
    properties : {
  
      message: {type : 'string'}
    },
    additionalProperties : false,
    required : ['message']
  }