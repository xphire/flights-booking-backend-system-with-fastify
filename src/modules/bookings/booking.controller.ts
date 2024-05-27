import fastify, { FastifyRequest, FastifyReply } from "fastify"

import { createBookingService ,updateBookingUserService , fetchBookingsService , deleteBookingService , fetchBookingService } from "./booking.service"

import { createBookingInput, updateBookingInput } from "./booking.schema"

export const createBookingController = async (request : FastifyRequest<{Body : Pick<createBookingInput,"flightId"> }> , reply : FastifyReply) => {

    try {

        const payload : createBookingInput  = {
          
            userId : Number(request.userId),
            flightId : request.body.flightId
            
        }

        const booking = await createBookingService(payload)

        reply.code(201).send(booking)
        
    } catch (error) {
        console.log(error)
        reply.send(error)
        
    }


}

export const updateBookingUserController = async (request : FastifyRequest<{Body : updateBookingInput}> , reply : FastifyReply ) => {

        try {

            const payload : updateBookingInput = {

                userId : request.body.userId,
                id : request.body.id
            }


            const  booking = await updateBookingUserService(payload)

            reply.code(200).send(booking)
            
        } catch (error) {

            console.log(error)
            reply.send(error)
            
        }

}

export const fetchBookingsController =  async (request : FastifyRequest<{Params : Pick<createBookingInput,"flightId"> }> , reply : FastifyReply) => {

    try {

        const flightId = request.params.flightId

        const bookings = await fetchBookingsService(flightId)

        reply.code(200).send(bookings)

        
    } catch (error) {

        console.log(error)
        reply.send(error)
        
    }


}

export const deleteBookingController = async (request : FastifyRequest<{Body : Pick<updateBookingInput,"id">}> , reply : FastifyReply) => {


    try {
         
        const bookingId = request.body.id

        await deleteBookingService(bookingId)

        return reply.status(204).send({message : `Flight with ID ${bookingId} successfully deleted`})

    } catch (error) {

        console.log(error)
        reply.send(error)
        
    }


}

export const fetchBookingController = async (request : FastifyRequest<{Params : Pick<updateBookingInput,"id">}> , reply : FastifyReply) => {
   

    try {

        const bookingId = request.params.id

        const booking = await fetchBookingService(bookingId)

        reply.code(200).send(booking)
        
    } catch (error) {

        console.log(error)
        reply.send(error)
        
    }

}