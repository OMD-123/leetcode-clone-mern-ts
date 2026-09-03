import { Router, Request, Response } from 'express';
import { Submission, ISubmission, Problem } from '../models/index.js';
import { authMiddleware } from './auth.js';

const router = Router();

// --- Submit Solution ---
router.post('/submit', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { problemId, language, code } = req.body;
    if (!problemId || !code) {
      return res.status(400).json({ message: 'Problem ID and code required' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Run test cases
    const testResults = problem.testCases.map((tc) => {
      try {
        const fn = new Function('input', `"use strict";\n${code}\nreturn solve(input);`);
        const actual = String(fn(JSON.parse(tc.input)));
        const passed = actual === tc.expected;
        return { input: tc.input, expected: tc.expected, actual, passed };
      } catch (e: any) {
        return { input: tc.input, expected: tc.expected, actual: '', passed: false };
      }
    });

    const allPassed = testResults.every((r) => r.passed);
    const submission = await Submission.create({
      user: (req as any).userId,
      problem: problemId,
      language: language || 'javascript',
      code,
      status: allPassed ? 'Passed' : 'Failed',
      testResults,
      runtimeMs: Math.floor(Math.random() * 200) + 5, // placeholder
    });

    res.status(201).json(submission);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// --- Get User Submissions ---
router.get('/my', authMiddleware, async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find({ user: (req as any).userId })
      .populate('problem', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(submissions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// --- Get Submission by ID ---
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('user', 'username')
      .populate('problem', 'title');
    if (!submission) return res.status(404).json({ message: 'Not found' });
    // Only owner can see their own submission
    if (submission.user._id.toString() !== (req as any).userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(submission);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
