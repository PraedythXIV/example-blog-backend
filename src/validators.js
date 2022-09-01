import * as yup from "yup"
import config from "./config.js"

//validate page
export const validateLimit = yup
.number()
.min(config.view.results.minLimit)
.max(config.view.results.maxLimit)
.integer()
.default(config.view.results.defaultLimit)

export const validateOffset = yup
.number()
.min(0)
.integer()

//users
export const validateEmail = yup.string().email().trim().label("E-mail")

export const validatePassword = yup
  .string()
  .min(8)
  .matches(/\W/, "Password must contain at least a special character")
  .label("Password")

export const validateUsername = yup
  .string()
  .min(2)
  .max(15)
  .matches(
    /^[a-z][a-z0-9._]*/,
    "Username must contain only letters, numbers, '.' and '_'"
  )
  .trim()
  .label("Username")

export const validateFirstName = yup
 .string()
 .min(2)
 .max(15)
 .matches(
   /^[a-z][a-z0-9._]*/,
   "first name must contain only letters, numbers, '.' and '_'"
   )
  .trim()
  .label("First Name")

export const validateLastName = yup
 .string()
 .min(2)
 .max(15)
 .matches(
   /^[a-z][a-z0-9._]*/,
    "first name must contain only letters, numbers, '.' and '_'"
  )
  .trim()
  .label("Last Name")

export const validateId = yup.number().integer().min(1).label("User ID")

//displayName
export const validateDisplayName = yup
  .string()
  .min(1)
  .max(20)
  .trim()
  .matches(/[^\n\r\u00a0]/)
  .label("Display Name")
