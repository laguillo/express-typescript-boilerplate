import { Router } from 'express';
import { pingRoute } from '@/routes/ping';
import { sampleRoute } from '@/routes/sample';

const router = Router();

router.use(pingRoute);
router.use(sampleRoute);

export default router;
