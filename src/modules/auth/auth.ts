import { loginFetch , fetchUserByIDService } from "../users/user.service";

import { loginInput  } from "../users/user.schema";

import { readFile } from "fs/promises";

import { FastifyRequest, FastifyReply } from "fastify";

import * as argon2 from "argon2"

import jwt from "jsonwebtoken";

import {JSONSchemaType} from "ajv";


export interface loginResponse {

    token : string,
    message : string
}

type jwtBody = {

    sub : number
}

declare module 'fastify'{

    interface FastifyRequest{

        authorId : string,
        userId : string
    }
}

export const headerSchemaOptions : JSONSchemaType<{Authorization : string}> = {

    type : 'object',
    properties : {

        Authorization : {type : 'string', minLength: 1 }
    },
    required : ['Authorization'],
    additionalProperties : true
}


async function issueJWT (input : jwtBody) {


    const key = await readFile('./keys/privateKey.pem')

    const token = await jwt.sign(input,key, { algorithm: 'RS256', expiresIn : '5m' })

    return token 


}


async function verifyJWT (token : string ) {


        const key = await readFile('./keys/publicKey.pem')

        const decoded = await jwt.verify(token,key)

        return decoded

}


export async function userLoginController (request : FastifyRequest<{Body : loginInput}>, reply : FastifyReply) {


    try {

        const user = await loginFetch(request.body)

        const {password , ...rest} = user

        const isValid = await argon2.verify(password,request.body.password)

        if (!isValid) throw new Error('invalid email or password')

        const token = await issueJWT({sub : rest.id})

        reply.status(201).send({message : `Authentication Successful`, token : token })

        
    } catch (error) {

        console.log(error)
        reply.code(400).send(error)
        
    }


}


export async function userAuth (request : FastifyRequest , reply : FastifyReply ){


    try {


          const bearer  = request.headers.authorization 


          if(!bearer){

             throw Error ('Unauthorized')
         }

          const [bearerWord , token] = bearer.split(" ")


         if(!bearerWord || !token){

             throw Error ('missing bearer token')
         }

         const decoded = await verifyJWT(token)

         const id = String(decoded.sub)

         request.userId = id

     
    } catch (error : Error | any | unknown) {
   
        console.log(error)
        reply.code(401).send({"error" : error.message})

    }

}


export async function adminAuth (request : FastifyRequest , reply : FastifyReply ){


       try {


             const bearer  = request.headers.authorization 


             if(!bearer){

                throw Error ('missing authorization header')
            }

             const [bearerWord , token] = bearer.split(" ")


            if(!bearerWord || bearerWord !== "Bearer" || !token){

                throw Error ('missing bearer token')
            }
 
            const decoded = await verifyJWT(token)

            const id = String(decoded.sub)

            const user = await fetchUserByIDService(id)

            if (!user || user.role !== 'ADMIN'){

                throw Error("unauthorized")
            }


            request.userId = id


        
       } catch (error : Error | any | unknown) {
      
           console.log(error)
           reply.status(401).send({"error" : error.message})

       }

}


export async function adminAuthAddIdToBody (request : FastifyRequest<{Body : object}>, reply : FastifyReply ){


    //this is different from the above adminAuth as we need to add an ID to the request body


    try {


          const bearer  = request.headers.authorization 


          if(!bearer){

             throw Error ('missing bearer token')
         }

          const [bearerWord , token] = bearer.split(" ")


         if(!bearerWord || !token){

             throw Error ('missing bearer token')
         }


         const decoded = await verifyJWT(token)

         const id = String(decoded.sub)

         const user = await fetchUserByIDService(id)

         if (!user || user.role !== 'ADMIN'){

             throw Error("unauthorized")
         }

         request.authorId = id


     
    } catch (error : Error | any | unknown) {
   
        console.log(error)
        reply.code(401).send({"error" : error.message})

    }

}


export const loginRequestSchema : JSONSchemaType<loginInput> = {


    type : "object",
    properties :{

        email : {type : "string", format : "email"},
        password : {type : "string"}
    },
    required : ["email", "password"],
    additionalProperties : false
}


export const loginResponseSchema : JSONSchemaType<loginResponse> = {

    type : "object",
    properties :{
        message : {type : "string"},
        token : {type : "string"}
    },
    required : ["token", "message"],
    additionalProperties : false
}

export const loginRouteOptions = {

    method : 'POST' as const,
    url : '/auth',
    schema : {

        description : 'generate JWT for authentication',
        tags : ['auth'],
        body : loginRequestSchema,
        response : {

            201 : loginResponseSchema
        }
    },
        handler : userLoginController

    }


