import { encrypt, decrypt, PrivateKey, PublicKey } from 'eciesjs'

interface IKeyPair {
    pk:string,
    sk:string
}

interface IMessageBody {
    message:string
}

/**
 * Generate an IKeyPair to encrypt and decrypt data.
 * Not exposed by service. Method is used as an example of how the keys are generated.
 * Keys are generated offline, passed in as environment variables.
 * (SERVER_PUBLIC_KEY, SERVER_SECRET_KEY, CAMPAIGN_PUBLIC_KEY)
 * @returns IKeyPair object with a PublicKey and SecretKey.
 */
function generateKeyPair():IKeyPair {
    const sk = new PrivateKey();
    const keyPair:IKeyPair = {
        pk: sk.publicKey.toHex(),
        sk: sk.toHex()
    };
    return keyPair;
}

export function decodeMessage(messageBody:IMessageBody, privateKey:string):Buffer {
    const message = messageBody.message;
    const decData = decryptMessage(Buffer.from(message, 'hex'), privateKey);
    const bufferFromHex = Buffer.from(decData.toString(), 'hex');
    return bufferFromHex;
}

export function encryptMessage(msg:string, publicKey:string):string {
    try {
        const data = Buffer.from(msg);
        const encryptedMessage = encrypt(publicKey, data);
        return encryptedMessage.toString('hex');
    } catch (error:any) {
        return 'ENCRYPTION_ERROR';
    }
}

export function decryptMessage(msg:Buffer, privateKey:string):string {
    try {
        let decryptedMessage = decrypt(PrivateKey.fromHex(privateKey).secret, msg).toString('hex');
        return decryptedMessage;
    } catch (error:any) {
        return 'DECRYPTION_ERROR';
    }
}

export function hexToPublicKey(hex:string):PublicKey {
    return PublicKey.fromHex(hex);
}

export function hexToPrivateKey(hex:string):PrivateKey {
    return PrivateKey.fromHex(hex);
}
