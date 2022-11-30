import { NextFunction } from 'express';
import * as Joi from 'joi';

const JOI_OPTIONS = {
  abortEarly: true,
  allowUnknown: false,
  context: true,
  convert: true,
  presence: 'required',
};

const cleanupJoiError = (error: any) => {
  const { details } = error;
  const message = details.map((i: any) => i.message).join(', ');
  return new Error(message);
};

// export const validate = (schema: any) => {
//   const validateBody = (ctx: any, next: any) => {
//     return async (ctx: any, next: any) => {
//       try {
//         const value = await schema.validateAsync(ctx.request.body, JOI_OPTIONS);
//         ctx.request.body = value;
//         await next();
//       } catch (error) {
//         throw cleanupJoiError(error);
//       }
//     };
//   };

//   const validateQuery = (schema: any) => {
//     return async (ctx: any, next: any) => {
//       try {
//         const value = await schema.validateAsync(ctx.query, JOI_OPTIONS);
//         ctx.query = value;
//         await next();
//       } catch (error) {
//         throw cleanupJoiError(error);
//       }
//     };
//   };

//   const validateParams = (schema: any) => {
//     return async (ctx: any, next: any) => {
//       try {
//         const value = await schema.validateAsync(ctx.params, JOI_OPTIONS);
//         ctx.params = value;
//         await next();
//       } catch (error) {
//         throw cleanupJoiError(error);
//       }
//     };
//   };
// };

export const validate = (schema: any) => {
  if (!schema) {
    schema = {
      query: {},
      body: {},
      params: {},
    };
  }

  return (ctx: any, res: any, next: NextFunction) => {
    type Err = Record<string, any>;
    const errors: Err = {};
    if (schema.query) {
      if (!Joi.isSchema(schema.query)) {
        schema.query = Joi.object(schema.query);
      }

      const {
        error: queryErrors,
        value: queryValue,
      } = schema.query.validate(
        ctx.query,
        JOI_OPTIONS,
      );

      if (queryErrors) {
        errors.query = cleanupJoiError(queryErrors);
      } else {
        ctx.query = queryValue;
      }
    }

    if (schema.body) {
      if (!Joi.isSchema(schema.body)) {
        schema.body = Joi.object(schema.body);
      }
    
      const {
        error: bodyErrors,
        value: bodyValue,
      } = schema.body.validate(
        ctx.request,
        JOI_OPTIONS,
      );
    
      if (bodyErrors) {
        errors.body = cleanupJoiError(bodyErrors);
      } else {
        ctx.request.body = bodyValue;
      }
    }

    if (schema.params) {
      if (!Joi.isSchema(schema.params)) {
        schema.params = Joi.object(schema.params);
      }
    
      const {
        error: paramsErrors,
        value: paramsValue,
      } = schema.params.validate(
        ctx.params,
        JOI_OPTIONS,
      );
    
      if (paramsErrors) {
        errors.params = cleanupJoiError(paramsErrors);
      } else {
        ctx.params = paramsValue;
      }
    }

    if (Object.keys(errors).length) {
      ctx.status = 400;
      ctx.body = errors;
    }
      // ctx.body = (400, 'Validation failed, check details for more information', {
      //   code: 'VALIDATION_FAILED',
      //   details: errors,
      // });
    

    return next();
  };
};

