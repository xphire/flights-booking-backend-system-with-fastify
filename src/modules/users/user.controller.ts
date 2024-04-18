import { FastifyRequest, FastifyReply, FastifyError, errorCodes } from "fastify";

import { createUserService , fetchUsersService , fetchUserByIDService , fullUpdateUserService , partialUpdateUserService , deleteUserService } from "./user.service";

import { createUserInput, fetchUsersQuery , fetchUserByIDQuery  } from "./user.schema";


export async function createUserController(request : FastifyRequest<{Body : createUserInput}>, reply : FastifyReply){

    const body = request.body

    try {

        const user = await createUserService(body);

        console.log(user)

        reply.code(201).send(user)
        
    } catch (error) {

      console.log(error);
      reply.send(error);

    }

}


export async function fetchUsersController(request : FastifyRequest<{Querystring : fetchUsersQuery}> , reply : FastifyReply){


    try {

        const {perPage,page} = request.query 

        const users = await fetchUsersService(perPage, page)

        reply.code(200).send(users)
        
    } catch (error) {

      console.log(error);
      reply.send(error);

    }

}


export async function fetchUserByIDController (request : FastifyRequest<{Params : typeof fetchUserByIDQuery}> , reply : FastifyReply){


  try {

      const {id} = request.params


      const user = await fetchUserByIDService(id)


      reply.status(200).send(user)


    
  } catch (error) {

    console.log(error);
    reply.send(error);
    
  }


}


export async function fullUpdateUserController (request : FastifyRequest<{Body : createUserInput , Params : typeof fetchUserByIDQuery}> , reply : FastifyReply){


  try {

      const {id} = request.params


      const user = await fullUpdateUserService(id , request.body)


      reply.status(200).send(user)


    
  } catch (error) {

    console.log(error);
    reply.send(error);
    
  }


}


export async function partialUpdateUserController (request : FastifyRequest<{Body : Partial<createUserInput> , Params : typeof fetchUserByIDQuery}> , reply : FastifyReply){


  try {

      const {id} = request.params


      const user = await partialUpdateUserService(id , request.body)


      reply.status(200).send(user)


    
  } catch (error) {

    console.log(error);
    reply.send(error);
    
  }


}

export async function deleteUserController (request : FastifyRequest<{ Params : typeof fetchUserByIDQuery}> , reply : FastifyReply){


  try {

      const {id} = request.params


      await deleteUserService(id)


      reply.status(204).send({message : `User with ID ${id} successfully deleted`})


      return


    
  } catch (error) {

    console.log(error);
    reply.send(error);
    
  }


}