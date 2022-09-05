import { pbkdf2,pbkdf2Sync , randomBytes } from "crypto"
import config from './config.js'


const hashPassword = async (
    password,
    salt = randomBytes(128).toString("hex"),
    iteration = config.password.iterations,
    keylen = config.password.keylen,
    digest = config.password.digest,
    pepper = config.security.password.pepper
    ) => [
        pbkdf2Sync(`${pepper}${password}`, salt, iterations, keylen, digest),
        salt,
    ]
    .toString("hex")

export default hashPassword