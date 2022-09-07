import jsonwebtoken from 'jsonwebtoken'

const auth = (req, res, next) => {
  const {
    headers: { authorization = "" },
  } = req

  const jwt = authorization.slice(7)

  try {
    const payload = jsonwebtoken
      .verify(jwt, config.security.jwt.secret)
    
    req.session = payload.user

    next()
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      res.status(403).send({ error: ["Forbidden."] })
      
      return
    }

    res.status(500).send({error: ["Oops, something went wrong."]})
  }
}

export default auth