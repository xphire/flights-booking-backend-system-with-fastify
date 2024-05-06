import {JSONSchemaType} from "ajv";

export interface createUserInput {
    name: string,
    email: string,
    password : string,
    role? : "ADMIN" | "USER"

}

export interface loginInput {
  email: string,
  password : string
}

export interface createUserResponse  {

    id : number,
    email : string,
    createdAt : string,
    name : string,
    role : "ADMIN" | "USER"

}

export interface fetchUsersQuery  {
   
   perPage? : string,
   page? : string
   
}

export interface meta  {

  per_page : number,
  page : number,
  count : number
  
}

export interface fetchUsersResponse  {

   data : Omit<createUserResponse,'createdAt'>[],
   meta : meta

}


export type partialUpdateUser = Partial<createUserInput>



export const createUserSchema: JSONSchemaType<createUserInput> = {
    type: "object",
    properties: {
      name: {type: "string"},
      email: {type: "string",format : "email"},
      password: {type: "string"},
      role : {type : "string", enum : ["ADMIN", "USER"], nullable : true}

    },
    required: ["name","email", "password"],
    additionalProperties: false
};

export const createUserResponseSchema: JSONSchemaType<createUserResponse> = {
    type: "object",
    properties: {
      id : {type : "number"},
      name: {type: "string"},
      createdAt : {type : "string"},
      email: {type: "string", format : "email"},
      role : {type : "string", enum : ["ADMIN", "USER"]}

    },
    required : ["name","email", "id", "role", "createdAt"] ,
    additionalProperties: false
};


export const fetchUsersResponseSchema: JSONSchemaType<fetchUsersResponse> = {
  type: "object",
  properties: {
    data: {
      
    type: "array" , 
    items : {type : "object" , properties : {


      id : {type : 'number'},
      name : {type : 'string'},
      role : {type : 'string'},
      email : {type : 'string'}


    } ,additionalProperties : false , required : ["name", "id", "email", "role"]}
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
  
};


export const fetchUsersQuery : JSONSchemaType<fetchUsersQuery> = {

   type : "object",
   properties : {

    perPage : {type : 'string', nullable : true},
    page : {type : 'string', nullable : true}

    }


}

export const fetchUserByIDQuery : JSONSchemaType<{id : string}> = {

    type : 'object',
    properties : {

      id : {type : 'string', nullable : false}
    },
    additionalProperties : false,
    required : ['id']
}

export const loginInput : JSONSchemaType<loginInput> = {

    type : 'object',
    properties : {

      email : {type : 'string' , format : 'email'},
      password : {type : 'string'}
    },
    additionalProperties : false,
    required : ['email', 'password']
}


export const deleteUserResponseSchema : JSONSchemaType<{message : string}> = {

  type : 'object',
  properties : {

    message: {type : 'string'}
  },
  additionalProperties : false,
  required : ['message']
}



