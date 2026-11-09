import { Router } from 'express';
import Controllers from '@/controllers/index';

export const pingRoute = Router();

// Return the controller's promise: Express 5 forwards rejections to the error handler.
// Wrapping it with `void` would swallow the error and leave the request hanging.
pingRoute.get('/ping', (req, res) => Controllers.pingController(req, res));
