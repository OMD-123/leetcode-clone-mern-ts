import mongoose, { Schema, Document } from 'mongoose';

// --- User Model ---
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);

// --- Problem Model ---
export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  starterCode: string;
  testCases: Array<{ input: string; expected: string }>;
  createdAt: Date;
}

const problemSchema = new Schema<IProblem>({
  title:       { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty:  { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  category:    { type: String, default: 'General' },
  starterCode: { type: String, default: '' },
  testCases:   { type: Array, default: [] },
}, { timestamps: true });

export const Problem = mongoose.model<IProblem>('Problem', problemSchema);

// --- Submission Model ---
export interface ITestCaseResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface ISubmission extends Document {
  user: mongoose.Types.ObjectId;
  problem: mongoose.Types.ObjectId;
  language: string;
  code: string;
  status: 'Pending' | 'Passed' | 'Failed' | 'Error';
  testResults: ITestCaseResult[];
  runtimeMs: number;
  createdAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
  user:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  problem:    { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
  language:   { type: String, default: 'javascript' },
  code:       { type: String, required: true },
  status:     { type: String, enum: ['Pending', 'Passed', 'Failed', 'Error'], default: 'Pending' },
  testResults:[{ type: Map, of: Boolean }],
  runtimeMs:  { type: Number, default: 0 },
}, { timestamps: true });

export const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);
