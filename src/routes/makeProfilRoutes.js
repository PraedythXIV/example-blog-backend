import validate from "../middlewares/validate.js"
import {
  validateDisplayName,
  validateAccountStatus,
  validateAvatar,
  validateId,
  validateOffset,
  validateLimit,
} from "../validators.js"

const makeProfilRoutes = ({ app, db }) => {

  //CREATE
  app.post(
    "/profil",
    validate({
      body: {
        displayName: validateDisplayName.required(),
        accountStatus: validateAccountStatus.required(),
        avatar: validateAvatar.required(),
      }
    }),
    async (req, res) => {
      const { displayName, accountStatus, avatar } = req.body

      try {
        const [profil] = await db("profil")
          .insert({
            displayName,
            accountStatus,
            avatar,
          })
          .returning("*")
        
        res.send(profil)
      } catch (err) {
        if (err.code === '23505') {
          res.status(409).send({
            error: [
            `Duplicated value for "${err.detail.match(/^Key \((\w+)\)/)[1]}"`,
            ],
          })

          return
        }

        console.error(err)

        res.status(500).send({error:"Oops, something went wrong."})
      }
    }
  )

  //READ collection
  app.get(
      "/userProfils",
      validate({
      query: {
        offset: validateOffset,
        limit: validateLimit,
      },
    }),
    async (req, res) => {
      const { limit, offset } = req.query
      const userProfils = await db("userProfils").limit(limit).offset(offset)
      const [{ count }] = await db("userProfils").count()

      res.send({ result: filterDBResult(userProfils), count })
    }
  )
  //READ single
  app.get(
    "/userProfils/:userProfilId",
    validate({
    params: {
      userProfilId: validateId.required(),
    },
  }),
  async (req, res) => {
    const { userProfilId } = req.params
    const [userProfil] = await db("userProfils").where({id: userProfilId})

    if (!userProfil) {
      res.status(404).send({error: ["UserProfil not found"] })

      return
    }
    
    res.send({ result: filterDBResult([userProfil]), count: 1})
  }
)
  //UPDATE partial
  app.patch(
  "/userProfils/:userProfilId",
  validate({
    params: {
      userProfilId: validateId.required(),
    },
    body: {
      email: validateDisplayName,
      password: validateAccountStatus,
      username: validateAvatar,
    },
  }),
    async (req, res) => {
      const {
        params: { userProfilId },
        body: { displayname, accountStatus, avatar },
      } = req

      const [userProfil] = await db("userProfils").where({id: userProfilId})

      if (!userProfil) {
        res.status(404).send({error: ["UserProfil not found"] })

        return

      }
      
      try{
      const [updatedUserProfil] = await db("userProfils")
      .where({id: userProfilId})
        .update({
          displayname,
          accountStatus,
          avatar,
      })
      .returning("*")

      res.send({ result: updatedUserProfil, count: 1 })
      } catch (err) {
        if (err.code === "23505") {
          res.status(409).send({
            error: [
              `Duplicated value for "${err.detail.match(/^Key \((\w+)\)/)[1]}"`,
            ],
          })

          return
        }

        // eslint-disable-next-line no-console
        console.error(err)

        res.status(500).send({ error: "Oops. Something went wrong." })
      }
    }
  )
  //DELETE
  app.delete(
      "/userProfils/:userProfilId",
      validate({
      params: {
        userProfilId: validateId.required(),
      },
    }),
    async (req, res) => {
      const {userProfilId} = req.params
      const [userProfil] = await db("userProfils").where({id: userProfilId})

      if (!userProfil) {
        res.status(404).send({error: ["User not found"] })

        return
      }
      await db("userProfils").delete().where({id: userProfilId})

      res.send({ result: filterDBResult([userProfil]), count: 1 })
    }
  )
}

export default makeProfilRoutes
