import { Router, Request, Response } from 'express';
import { Problem, IProblem } from '../models/index.js';

const router = Router();

// --- Get All Problems ---
router.get('/', async (_req: Request, res: Response) => {
  try {
    const problems = await Problem.find().select('-testCases').sort({ createdAt: -1 });
    res.json(problems);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// --- Get Single Problem ---
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// --- Create Problem ---
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, difficulty, category, starterCode, testCases } = req.body;
    const problem = await Problem.create({
      title, description, difficulty, category, starterCode, testCases
    });
    res.status(201).json(problem);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
