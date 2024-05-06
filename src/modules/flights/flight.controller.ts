import { FastifyRequest, FastifyReply } from "fastify"
import { createFlightInput, fetchFlightsQuery , fetchFlightByIDQuery } from "./flight.schema"
import { createFlightService, fetchFlightsService , fetchFlightByIDService, fullUpdateFlightService , partialUpdateFlightService , deleteFlightService } from "./flight.service"


export const createFlightController = async (request : FastifyRequest<{Body: Omit<createFlightInput, "authorId">}> , reply : FastifyReply) => {


    try {
        
        const data = {

            ...request.body,
            authorId : Number(request.userId)

        }

        const flight = await createFlightService(data)

        return reply.code(201).send(flight)


    } catch (error) {

        console.error(error)
        reply.send(error)
        
    }

    

}


export async function fetchFlightsController(request : FastifyRequest<{Querystring : fetchFlightsQuery}> , reply : FastifyReply){


    try {

        const {perPage,page} = request.query 

        const flights = await fetchFlightsService(perPage, page)

        return reply.code(200).send(flights)
        
    } catch (error) {

      console.log(error);
      return reply.send(error);

    }

}


export async function fetchFlightByIDController (request : FastifyRequest<{Params : typeof fetchFlightByIDQuery}> , reply : FastifyReply){


    try {
  
        const {id} = request.params
  
  
        const flight = await fetchFlightByIDService(id)
  
  
        return reply.status(200).send(flight)
  
  
      
    } catch (error) {
  
      console.log(error);
      return reply.send(error);
      
    }
  
}


export async function fullUpdateFlightController (request : FastifyRequest<{Body : createFlightInput , Params : typeof fetchFlightByIDQuery}> , reply : FastifyReply){


    try {
  
        const {id} = request.params
  
  
        const flight = await fullUpdateFlightService(id , request.body)
  
  
        return reply.status(200).send(flight)
  
  
      
    } catch (error) {
  
      console.log(error);
      return reply.send(error);
      
    }
  
  
}


export async function partialUpdateFlightController (request : FastifyRequest<{Body : Partial<createFlightInput> , Params : typeof fetchFlightByIDQuery}> , reply : FastifyReply){


    try {
  
        const {id} = request.params
  
  
        const flight = await partialUpdateFlightService(id , request.body)
  
  
        return reply.status(200).send(flight)
  
  
      
    } catch (error) {
  
      console.log(error);
      return reply.send(error);
      
    }
  
  
}


export async function deleteFlightController (request : FastifyRequest<{ Params : typeof fetchFlightByIDQuery}> , reply : FastifyReply){


    try {
  
        const {id} = request.params
  
        await deleteFlightService(id)
  
        return reply.status(204).send({message : `Flight with ID ${id} successfully deleted`})
  
      
    } catch (error) {
  
      console.log(error);
      return reply.send(error);
      
    }
  
}