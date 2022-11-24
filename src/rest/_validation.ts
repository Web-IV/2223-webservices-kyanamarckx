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

export const validate = (schema: any) => {
  const validateBody = (ctx: any, next: any) => {
    return async (ctx: any, next: any) => {
      try {
        const value = await schema.validateAsync(ctx.request.body, JOI_OPTIONS);
        ctx.request.body = value;
        await next();
      } catch (error) {
        throw cleanupJoiError(error);
      }
    };
  };

  const validateQuery = (schema: any) => {
    return async (ctx: any, next: any) => {
      try {
        const value = await schema.validateAsync(ctx.query, JOI_OPTIONS);
        ctx.query = value;
        await next();
      } catch (error) {
        throw cleanupJoiError(error);
      }
    };
  };

  const validateParams = (schema: any) => {
    return async (ctx: any, next: any) => {
      try {
        const value = await schema.validateAsync(ctx.params, JOI_OPTIONS);
        ctx.params = value;
        await next();
      } catch (error) {
        throw cleanupJoiError(error);
      }
    };
  };
};

