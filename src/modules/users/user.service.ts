import prisma from "../../../utils/prisma";
import { createUserInput , loginInput } from "./user.schema";
import * as argon2 from "argon2";


export const createUserService = async (input : createUserInput) => {


    const password = await argon2.hash(input.password)

    const user = await prisma.user.create(
        {
            data : {

                ...input, password : password
            }
        }
    )

    return user;


}


export const fetchUsersService = async (perPage : string = '50' , page  : string = '1') => {

      
      const size = Number.isNaN(parseInt(perPage, 10)) || perPage === '0'  ? 50 : Number(perPage) 

      const index = Number.isNaN(parseInt(page, 10)) ||  page === '0'  ? 1 : Number(page) 

      const skip = size * (index - 1)

      const recordsCount = await prisma.user.count()

      const records = await prisma.user.findMany({

        skip : skip,
        take : size,
        select : {

            id : true,
            name : true,
            email : true,
            role : true

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


export const fetchUserByIDService = async (id : string) => {

    const numericId : number = parseInt(id, 10)

    if  (Number.isNaN(numericId)){throw Error ('invalid user id')}

    const user = await prisma.user.findFirstOrThrow({

        where : {
            id : numericId
        }
    });


    return user
}


export const fullUpdateUserService = async (id : string , input : createUserInput) => {


    const numericId : number = parseInt(id, 10)

    if  (Number.isNaN(numericId)){throw Error ('invalid user id')}

    const user = await prisma.user.update({

        data : input,
        where : {

            id : numericId
        }
    })

    return user


}


export const partialUpdateUserService = async (id : string , input : Partial<createUserInput>) => {


    const numericId : number = parseInt(id, 10)

    if  (Number.isNaN(numericId)){throw Error ('invalid user id')}

    const user = await prisma.user.update({

        data : input,
        where : {

            id : numericId
        }
    })


    return user


}


export const deleteUserService = async (id : string) => {


    const numericId : number = parseInt(id, 10)

    if  (Number.isNaN(numericId)){throw Error ('invalid user id')}

     await prisma.user.delete({

        where : {

            id : numericId
        }
    })

    return

}

export const loginFetch = async (input : loginInput) => {


    const user = await prisma.user.findFirst({

        where : {

            email : input.email,
    
        },
        select : {

            id : true,
            role : true,
            password : true

        }


       
    })

    if(!user){

        throw Error("invalid email or password")
    }

    return user


}