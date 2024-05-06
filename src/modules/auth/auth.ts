import { loginFetch , fetchUserByIDService } from "../users/user.service";

import { loginInput  } from "../users/user.schema";

import { readFile } from "fs/promises";

import { FastifyRequest, FastifyReply } from "fastify";

import * as argon2 from "argon2"

import jwt from "jsonwebtoken";

type jwtBody = {

    sub : number
}

declare module 'fastify'{

    interface FastifyRequest{

        authorId : string,
        userId : string
    }
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

        await argon2.verify(password,request.body.password)

        // if(!validity){

        //     throw Error('invalid username or password')
        // }

        const token = await issueJWT({sub : rest.id})

        reply.status(200).send({message : `Authentication Successful`, token : token })

        
    } catch (error) {

        console.log(error)
        reply.send(error)
        
    }


}


export async function adminAuth (request : FastifyRequest , reply : FastifyReply ){


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


            request.userId = id


        
       } catch (error : Error | any | unknown) {
      
           console.log(error)
           reply.code(401).send({"error" : error.message})

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

