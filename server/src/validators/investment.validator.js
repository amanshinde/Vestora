import Joi from 'joi';
import { INVESTMENT_PLANS } from '../constants/transactionTypes.js';

const validPlanNames = Object.values(INVESTMENT_PLANS).map(p => p.name);

export const createInvestmentSchema = Joi.object({
  amount: Joi.number().positive().min(1000).required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be greater than 0',
      'number.min': 'Minimum investment amount is ₹1,000',
      'any.required': 'Investment amount is required',
    }),
  planName: Joi.string().valid(...validPlanNames).required()
    .messages({
      'any.only': `Plan must be one of: ${validPlanNames.join(', ')}`,
      'any.required': 'Plan name is required',
    }),
});
