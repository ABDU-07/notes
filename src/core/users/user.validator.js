import Joi from "joi";

export const createValidator = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "username kirgizlishi shart!",
    "string.base": "username text bolishi kerak!",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "email kirgizlishi shart!",
    "string.base": "email text bolishi kerak!",
    "string.email": "email togri kirgizing bolishi kerak!",
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": "password kirgizlishi shart!",
    "string.base": "password text bolishi kerak!",
    "string.min": "password kamida {#limit} bolishi kerak!",
  }),
});

export const updateValidator = Joi.object({
  username: Joi.string().messages({
    "string.empty": "username kirgizlishi shart!",
    "string.base": "username text bolishi kerak!",
  }),
  email: Joi.string().email().messages({
    "string.empty": "email kirgizlishi shart!",
    "string.base": "email text bolishi kerak!",
    "string.email": "email togri kirgizing bolishi kerak!",
  }),
  password: Joi.string().min(6).messages({
    "string.empty": "password kirgizlishi shart!",
    "string.base": "password text bolishi kerak!",
    "string.min": "password kamida {#limit} bolishi kerak!",
  }),
});

export const idValidator = Joi.object({
  id: Joi.required().custom((value, helper) => {
      if (isNaN(value)) {
          return helper.message("Notog'ri id kirgizildi");
      }
      return value;
  }),
});

export const loginValidator = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "username kirgizlishi shart!",
    "string.base": "username text bolishi kerak!",
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": "password kirgizlishi shart!",
    "string.base": "password text bolishi kerak!",
    "string.min": "password kamida {#limit} bolishi kerak!",
  }),
});