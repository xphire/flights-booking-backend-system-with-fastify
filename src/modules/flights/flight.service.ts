import prisma from "../../../utils/prisma";
import { createFlightInput } from "./flight.schema";


const dbSelection = {

            id : true,
            createdAt : true,
            available : true,
            date : true,
            description : true,
            seats : true,
            filled : true
}


export const createFlightService  = async (input : createFlightInput) => {


    const flight = await prisma.flight.create({

        data : input,
        select : {

           ...dbSelection
            
        }
    })


    return flight;


}


export const fetchFlightsService = async (perPage : string = '50' , page  : string = '1') => {

      
    const size = Number.isNaN(parseInt(perPage, 10)) || perPage === '0'  ? 50 : Number(perPage) 

    const index = Number.isNaN(parseInt(page, 10)) ||  page === '0'  ? 1 : Number(page) 

    const skip = size * (index - 1)

    const recordsCount = await prisma.flight.count()

    const records = await prisma.flight.findMany({

      skip : skip,
      take : size,
      select : {

        ...dbSelection
      }

    })


    return {

       data : records ,
       meta : {

          per_page : size,
          page : index,
          count : recordsCount
       }
    }

}


export const fetchFlightByIDService = async (id : string) => {

    const numericId : number = parseInt(id, 10)

    if  (Number.isNaN(numericId)){throw Error ('invalid flight id')}

    const flight = await prisma.flight.findFirstOrThrow({

        where : {
            id : numericId
        },
        select : {

           ...dbSelection

        }
    });


    return flight
}


export const fullUpdateFlightService = async (id : string , input : createFlightInput) => {


    const numericId : number = parseInt(id, 10)

    if  (Number.isNaN(numericId)){throw Error ('invalid flight id')}

    const flight = await prisma.flight.update({

        data : input,
        where : {

            id : numericId
        },
        select : {

            ...dbSelection
        }
    })

    return flight


}


export const partialUpdateFlightService = async (id : string , input : Partial<createFlightInput>) => {


    const numericId : number = parseInt(id, 10)

    if  (Number.isNaN(numericId)){throw Error ('invalid flight id')}

    const flight = await prisma.flight.update({

        data : input,
        where : {

            id : numericId
        },
        select : {

            ...dbSelection
        }
    })


    return flight


}



export const deleteFlightService = async (id : string) => {


    const numericId : number = parseInt(id, 10)

    if  (Number.isNaN(numericId)){throw Error ('invalid user id')}

     await prisma.user.delete({

        where : {

            id : numericId
        }
    })

    return

}
