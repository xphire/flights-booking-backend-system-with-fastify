import { generateKeyPair } from "crypto";

import { writeFile, mkdir  } from "fs/promises";

generateKeyPair("rsa",{

    modulusLength : 2048,
    publicKeyEncoding : {
        type : "pkcs1",
        format : "pem"
    },
    privateKeyEncoding : {

        type : "pkcs1",
        format : "pem"
    
    }
}, async (error : Error | null , publicKey : string , privateKey : string) => {

    if (error) {

        console.log(error)
    }


   await mkdir("../keys")

   await  writeFile("../keys/publicKey.pem",publicKey)

   await  writeFile("../keys/privateKey.pem",privateKey)


})
