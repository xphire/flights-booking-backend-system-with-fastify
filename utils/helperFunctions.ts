export const notInArray = (target : number , holedArray : Array<number>) => {


    const targetArray = Array.from(
        {
            length : target
        },
        (_,index) => index + 1
    )


    return targetArray.filter((x) => !holedArray.includes(x))


}


export const sortArray = (collection  : Array<number>) => {

      return collection.sort((a,b) => a - b)
}


export const randomizeIndex = (length : number ) => {

    return Math.floor(Math.random() * length)
}


//console.log(sortArray([1,5000,3000,4,80000,0]))