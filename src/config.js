import "dotenv/config"

const config = {
  server: {
    port: process.env.SERVER_PORT,
  },
  view: {
    results: {
      minLimit: 1,
      maxLimit: 20,
      defaultLimit: 10,
    },
  },
  db: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      directory: "./src/db/migrations",
      stub: "./src/db/migrations.stub",
    },
  },
  security: {
    password: {
      iterations: 100000,
      keylen: 256,
      digest: "sha512",
      pepper: process.env.SECURITY_PASSWORD_PEPPER,
    },
    jwt: {
      expiresIn: "2 days",
      secret: process.env.SECURITY_JWT_SECRET,
    },
  },
}

/*console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})
*/

export default config
