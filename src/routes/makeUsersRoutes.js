import { config } from "dotenv"
import hashPassword from "../hashPassword.js"
import validate from "../middlewares/validate.js"
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateFirstName,
  validateLastName,
  validateOffset,
  validateLimit,
  validateId,
} from "../validators.js"

const makeUsersRoutes = ({ app, db }) => {
  //CREATE
  app.post(
    "/users",
    validate({
      body: {
        email: validateEmail.required(),
        password: validatePassword.required(),
        username: validateUsername.required(),
        firstName: validateFirstName.required(),
        lastName: validateLastName.required(),
      },
    }),
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body
      const [passwordHash, passwordSalt] = hashPassword(password)

      try{
      const [user] = await db("users")
        .insert({
          username,
          firstName,
          lastName,
          email,
          passwordHash,
          passwordSalt,
        })
        .returning("*")

      res.send(user) // TODO never send password, even hash!!!
      } catch (err) {
        if (err.code === '23505') {
          res.status(409).send({error: [
            `Duplicated value for "${err.detail.match(/^Key \((\w+)\)/)[1]}"`,
          ],
          })

          return
        }

        console.error(err)

        res.status(500).send({error:"Oops. Something went wrong."})
      }
    }
  )
  //READ collection
  app.get(
      "/users",
      validate({
      query: {
        offset: validateOffset,
        limit: validateLimit,
      },
    }),
    async (req, res) => {
      const { offset, limit } = req.query
      const users = await db("users")
        .limit(limit)
        .offset(offset * limit)

      res.send(users)
    }
  )
  //READ single
  app.get(
    "/users/:userId",
    validate({
    params: {
      userId: validateId.required(),
    },
  }),
  async (req, res) => {
    const {userId} = req.params
    const [user] = await db("users").where({id: userId})

    if (user) {
      res.status(404).send({error: ["User not found"] })

      return
    }
    
    res.send(user)
  }
)

//UPDATE partial
app.patch(
  "/users/:userId",
  validate({
    params: {
      userId: validateId.required(),
    },
    body: {
      email: validateEmail,
      password: validatePassword,
      username: validateUsername,
      firstName: validateFirstName,
      lastName: validateLastName,
    },
  }),
    async (req, res) => {
      const {
        params: { userId },
        body: { username, firstName, lastName, email, password },
      } = req
      const [user] = await db("users").where({id: userId})

      if (user) {
        res.status(404).send({error: ["User not found"] })

        return
      }

      let passwordHash
      let passwordSalt
      if (password) {
        const [hash, salt] = hashPassword(password, user.passwordSalt)
        passwordHash = hash
        passwordSalt = salt
      }
      
      try{
      const [updatedUser] = await db("users")
      .where({id: userId})
      .update({
        username,
        firstName,
        lastName,
        email,
        passwordHash: password,
        passwordSalt: password,
        updatedAt : new Date(),
      }).returning("*")

      res.send(updatedUser)
    } catch (err) {
      if (err.code === '23505') {
        res.status(409).send({error:[`Duplicated value for "${err.
          detail.match(/^Key \((\w+)/)
        [1]}"`,
        ],
        })

        return
      }

      console.error(err)

      res.status(500).send({error:"Oops. Something went wrong."})
    }
    }
  )

//DELETE
  app.delete(
      "/users/:userId",
      validate({
      params: {
        userId: validateId.required(),
      },
    }),
    async (req, res) => {
      const {userId} = req.params
      const [user] = await db("users").where({id: userId})

      if (user) {
        res.status(404).send({error: ["User not found"] })

        return
      }
      await db("users").delete().where({id: userId})

      res.send(user)
    }
  )
}

export default makeUsersRoutes
