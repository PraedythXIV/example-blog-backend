import validate from "../middlewares/validate.js"
import {validateEmailOrUsername, validatePassword} from "../validators.js"
import hashPassword from "../hashPassword.js"

const makeSessionRoutes = ({ app, db }) => {
    app.post("/sign-in", validate({
        emailOrUsername: validateEmailOrUsername.required(),
        password: validatePassword.required(),
    }), async (req, res) => {
        const {emailOrUsername, password} = req.body

        if (!emailOrUsername) {
            res.status(401).send({ error: ["Invalid credentials."] })

            return
        }
        const [user] = await db("users").where({
            email : emailOrUsername,
        }).orWhere({
            user : emailOrUsername,
        })

        if (!user) {
            res.status(401).send({ error: ["Invalid credentials."] })

            return
        }

        const [passwordHash] = hashPassword(password, user.passwordSalt)
        if (passwordHash !== user.passwordHash ) {
            res.status(401).send({ error: ["Invalid credentials."] })

            return
        }

        res.send({result: {status:"OK"} })
    })
}

export default makeSessionRoutes