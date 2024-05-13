import prisma from "../../../utils/prisma";

import  {createBookingInput, updateBookingInput} from "./booking.schema"

import * as helpers from "../../../utils/helperFunctions"


const selection =   {

    id : true,
    createdAt : true,
    seat : true,
    user : {

        select : {

            name : true,
            email : true

        }
    },
    flight : {

        select : {

            description : true,
            date : true
        }
    }
}


export const createBookingService = async (input : createBookingInput) => {


    const flightId = input.flightId

    //1) check flight validity

    const flight = await prisma.flight.findFirst(

        {

            where : {

                id : flightId
            }
        }
    )

    if (!flight){

        throw new Error("invalid flight Id")
    }

    if (flight.available === false){

        throw new Error("flight unavailable for booking or fully filled")
    }

    //2) check if user is not already on flight


    const userOnFlight = await prisma.booking.findFirst({

        where : {

           flightId : flightId,
           userId : input.userId
        }
   })

   if (userOnFlight){

       throw new Error("user already on flight")
   }

    //3) check if flight is not fully booked

    const seats = flight.seats

    const filled = flight.filled
    
    const bookingsCount = await prisma.booking.count({

        where : {

            flightId : flightId
        }
    })

    if (bookingsCount === seats){


        //update flight status to unavailable

        await prisma.flight.update({

            data : {

                available : false

            },
            where : {
                id : flightId
            }
    })

        throw new Error ("flight fully booked")
    }


    /////Logic to assign seat ID

    const bookedSeats = await prisma.flight.findFirst({

        where : {

            id : flightId
        },
        select : {

            bookings : true
        }
    })

     
    const bookedSeatsArray = !bookedSeats ? [] : bookedSeats.bookings.map((x) => x.seat)

    const availableSeats = helpers.sortArray(helpers.notInArray(seats,bookedSeatsArray))

    const seatNumber = availableSeats[0]

    const bookingPayload = {

        ...input,
        seat : seatNumber
    }


    const booking = await prisma.booking.create({


        data : {

            ...bookingPayload
        },
        select : selection
    })

    return booking;

}


export const updateBookingUserService = async (input : updateBookingInput) => {



    const user = await prisma.user.findFirst({

        where :{

            id : input.userId
        }
    })


    if (!user) throw new Error("invalid user")

  
    const booking = await prisma.booking.findFirst(

        {

            where : {

                id : input.bookingId
            }
        }
    )

    if (!booking){

        throw new Error("invalid booking ID")
    }



    const newBooking = await prisma.booking.update({

          data : {

              userId : input.userId
          },

          where : {

            id : input.bookingId
          },
          select : selection

    })


    return newBooking

}


export const fetchBookingsService = async (flightId : number) => {

    const bookings = await prisma.flight.findFirst({

        where : {

            id : flightId
        },
        select : {

            bookings : {

                select : {

                    id : true,
                    createdAt : true,
                    user : {

                        select : {

                            name : true,
                            email : true
                        }
                    },
                    seat : true
                }
            }
        }
    })


    if(!bookings) throw new Error("invalid flight ID")


    return bookings.bookings;


}


export const deleteBookingService = async (bookingId : number) => {

    //first  find booking

    const booking = await prisma.booking.findFirst({

        where : {

            id : bookingId
        }
    })

    if (!booking){

        throw new Error("invalid booking ID")
    }

    //now delete the  booking


    await prisma.booking.delete({

        where : {

            id : bookingId

        }
    })

    return


}


export const fetchBookingService = async (bookingId : number) => {


    const booking = await prisma.booking.findFirst(
        {

            where : {

                id :bookingId
            },
            select : selection
        }
    )


    if (!booking) throw new Error("invalid booking ID")


    return booking
}
