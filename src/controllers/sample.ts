import type { Request, Response } from 'express';
import type { ControllerClass } from '@/controllers/index';

export async function SampleController(
    this: ControllerClass,
    request: Request,
    response: Response
): Promise<void> {
    response.status(200).json({ message: 'This is a sample route' });
}
