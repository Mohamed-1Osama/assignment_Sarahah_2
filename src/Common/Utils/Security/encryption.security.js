import crypto from 'node:crypto'

// ============== SYMETRIC ===================
const ENCRYPTION_KEY =  Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
const IV_LENGTH = parseInt (process.env.IV_LENGTH);

export const encrypt = (plainText)=>{
    // Generate random iv bytes
    const iv = crypto.randomBytes(IV_LENGTH)
    
    const cipherObject = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv)
     
    let cipherText = cipherObject.update(plainText, 'utf-8', 'hex')

    cipherText += cipherObject.final('hex')

    return `${iv.toString('hex')}:${cipherText}`
}



// 6cd997cefe4f014ff8b5f261f6383126:948afda828b9a96e95edb6fdb9af4082
export const decrypt = (cipher ) =>{
    const [iv , encryptedText] = cipher.split(':')

    const bufferedIv = Buffer.from(iv, 'hex')
    const decipherObject = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, bufferedIv)

    let decipherText = decipherObject.update(encryptedText, 'hex', 'utf-8')

    decipherText += decipherObject.final('utf-8')

    return decipherText
}