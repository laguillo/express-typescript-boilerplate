import type { Request, Response } from 'express';
import { SampleController } from '@/controllers/sample';

export class ControllerClass {
    constructor() {
        // do something
    }

    async pingController(req: Request, res: Response): Promise<void> {
        res.status(200).json({ message: 'Server running' });
    }

    sampleController = SampleController;
}

const Controllers = new ControllerClass();
export default Controllers;
