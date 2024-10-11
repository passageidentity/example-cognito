import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateRequest = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e) {
      if (!(e instanceof ZodError)) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      const errorMessages = e.errors.map((issue: any) => ({
        message: `${issue.path.join('.')} is ${issue.message}`,
      }));
      res.status(400).json({ error: 'Invalid data', details: errorMessages });
    }
  };
};
