import validate from "../middlewares/validate.js"
import {validateDisplayName, validateAccountStatus, validateAvatar} from "../validators.js"

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
  //READ single
  //UPDATE partial
  //DELETE
}

export default makeProfilRoutes
