export const up = async (knex) => {
  await knex.schema.alterTable("comments", (table) => {
    table.dropForeign(["userProfilId"])
    table.dropForeign(["postId"])
    table
      .integer("userProfilId")
      .notNullable()
      .references("id")
      .inTable("userProfils")
      .onDelete("CASCADE")
      .alter()
    table
      .integer("postId")
      .notNullable()
      .references("id")
      .inTable("posts")
      .onDelete("CASCADE")
      .alter()
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("comments", (table) => {
    table.dropForeign(["userProfilId"])
    table.dropForeign(["postId"])
    table
      .integer("userProfilId")
      .notNullable()
      .references("id")
      .inTable("userProfils")
      .alter()
    table
      .integer("postId")
      .notNullable()
      .references("id")
      .inTable("posts")
      .alter()
  })
}