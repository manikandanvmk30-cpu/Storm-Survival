import { QuestionItem, GradeLevel, Difficulty } from '../types/game';
import { QUESTION_BANK } from './question_bank';

export const CHALLENGES: QuestionItem[] = QUESTION_BANK;

export function getChallengesForStudent(grade: GradeLevel, difficulty: Difficulty): QuestionItem[] {
  const matches = QUESTION_BANK.filter(q => q.grade === grade && q.difficulty === difficulty);
  if (matches.length > 0) return matches;
  return QUESTION_BANK;
}
