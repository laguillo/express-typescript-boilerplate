import { Router } from 'express';
import Controllers from '@/controllers/index';

export const sampleRoute = Router();

sampleRoute.get('/sample', (req, res) => Controllers.sampleController(req, res));
