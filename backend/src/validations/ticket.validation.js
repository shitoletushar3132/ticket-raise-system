import Joi from "joi";

export const createTicketValidation = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Ticket title is required",
    "string.min": "Title must be at least 3 characters long",
    "any.required": "Please provide a ticket title",
  }),

  description: Joi.string().min(5).required().messages({
    "string.empty": "Description is required",
    "any.required": "Please provide a description",
  }),

  priority: Joi.string()
    .valid("Low", "Medium", "High")
    .default("Medium")
    .messages({
      "any.only": "Priority must be Low, Medium, or High",
    }),

  status: Joi.string()
    .valid("Open", "In Progress", "Resolved", "Closed")
    .default("Open")
    .messages({
      "any.only":
        "Status must be one of Open, In Progress, Resolved, or Closed",
    }),

  department: Joi.string()
    .valid("IT", "HR", "Finance", "Operations", "Marketing", "Other")
    .required()
    .messages({
      "any.required": "Department is required",
      "any.only":
        "Department must be one of IT, HR, Finance, Operations, Marketing, or Other",
    }),

  createdBy: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid createdBy user ID",
      "any.required": "createdBy is required",
    }),
  assignedTo: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null)
    .optional()
    .messages({
      "string.pattern.base": "Invalid assignedTo user ID",
    }),

  attachment: Joi.string().uri().allow(null, "").optional().messages({
    "string.uri": "Attachment must be a valid URL",
  }),
});
