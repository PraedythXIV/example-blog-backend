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

//validate users
export const validateEmail = yup
  .string()
  .email()
  .trim()
  .label("E-mail")

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

export const validateId = yup
  .number()
  .integer()
  .min(1)
  .label("User ID")

//Validate username or email for login session
export const validateEmailOrUsername = yup
.string()
.min(2)
.label("Email or username")


//validate profil
export const validateDisplayName = yup
  .string()
  .min(1)
  .max(20)
  .trim()
  .matches(/[^\n\r\u00a0]/)
  .label("Display Name")

export const validateAccountStatus = yup
  .object()
  .shape(
    {
      showStatus: yup
        .boolean(),
      status: yup
        .when(
          "showStatus",
          { is: true, }
        )
    })

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
export const validateAvatar = yup
  .object()
  .shape(
    {
      uriImage: yup
        .mixed()
        .nullable()
        .required('A file is required')
        .test('file size', 'upload file', (value) => !value || (value && value.size <= 1024 * 1024))
        .test('format', 'upload file', (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type))),
    });