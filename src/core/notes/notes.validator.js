import Joi from "joi";

export const createValidator = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "title kirgizlishi shart!",
        "string.base": "title text bolishi kerak!",
    }),
    description: Joi.string().required().messages({
        "string.empty": "description kirgizlishi shart!",
        "string.base": "description text bolishi kerak!",
    }), 
    user_id: Joi.number().integer().required().messages({
        "number.empty": "user_id kirgizlishi shart!",
        "number.base": "user_id raqam bolishi kerak!",
        "number.integer": "user_id integer bolishi kerak!",
    }),
});

export const updateValidator = Joi.object({
    title: Joi.string().messages({
        "string.empty": "title kirgizlishi shart!",
        "string.base": "title text bolishi kerak!",
    }),
    description: Joi.string().messages({
        "string.empty": "description kirgizlishi shart!",
        "string.base": "description text bolishi kerak!",
    }), 
    user_id: Joi.number().integer().messages({
        "number.empty": "user_id kirgizlishi shart!",
        "number.base": "user_id raqam bolishi kerak!",
        "number.integer": "user_id integer bolishi kerak!",
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
