import { encrypt, decrypt, PrivateKey } from 'eciesjs'

interface IKeyPair {
    pk:string,
    sk:string,
    secret:Buffer
}

export function generateKeyPair():IKeyPair {
    const sk = new PrivateKey();
    const keyPair:IKeyPair = {
        pk: sk.publicKey.toHex(),
        sk: sk.toHex(),
        secret: sk.secret
    };
    return keyPair;
}

export function encryptMessage(msg:string, publicKey:string):Buffer {
    try {
        const data = Buffer.from(msg);
        const encryptedMessage = encrypt(publicKey, data);
        return encryptedMessage;
    } catch (error:any) {
        return Buffer.alloc(0);
    }
}

export function decryptMessage(msg:Buffer, publicKey:string, secret:Buffer):string {
    try {
        let decryptedMessage = decrypt(secret, encrypt(publicKey, msg)).toString();
        return decryptedMessage;
    } catch (error:any) {
        return 'DECRYPTION_ERROR';
    }
}