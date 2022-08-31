import validate from "../middlewares/validate.js"
import {
  validateDisplayName,
} from "../validators.js"

const makeProfilRoutes = ({ app, db }) => {
  //CREATE
  app.post(
    "/profil",
    validate({
      displayName: validateDisplayName.required(),
    }),
    async (req, res) => {
      const { displayName } = req.body

      const [profil] = await db("profil")
        .insert({
          displayName,
        })
        .returning("*")

      res.send(profil)
    }
  )
  //READ collection
  app.get("/profil", async (req, res) => {
    const profil = await db("profil")

    res.send(profil)
  })
  app.get("/profil/:profilId", async (req, res) => {})
  app.patch("/profil", async (req, res) => {})
  app.delete("/profil", async (req, res) => {})
}

export default makeProfilRoutes
