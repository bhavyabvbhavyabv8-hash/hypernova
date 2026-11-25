import { z } from 'zod'

const id = z.string().regex(/^[1-9]\d*$/, 'Must be a valid ID')

export const idParams = z.object({ id })

export const registerBody = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  displayName: z.string().trim().min(1).max(80),
  password: z.string().min(12).max(72),
})

export const loginBody = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(72),
})

export const exerciseQuery = z.object({
  search: z.string().trim().max(100).optional(),
  muscleGroup: z.string().trim().max(60).optional(),
  equipment: z.string().trim().max(60).optional(),
})

export const exerciseBody = z.object({
  name: z.string().trim().min(2).max(100),
  muscleGroup: z.string().trim().min(2).max(60),
  equipment: z.string().trim().min(2).max(60),
  description: z.string().trim().max(500).default(''),
})

const templateExercise = z.object({
  exerciseId: id,
  targetSets: z.number().int().min(1).max(20),
  targetReps: z.number().int().min(1).max(100),
  targetRpe: z.number().min(1).max(10).multipleOf(0.5).nullable().optional(),
})

export const templateBody = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).default(''),
  exercises: z.array(templateExercise).min(1).max(40),
})

export const startWorkoutBody = z.object({
  templateId: id.optional(),
  name: z.string().trim().min(2).max(100).optional(),
}).refine((value) => value.templateId || value.name, {
  message: 'A template or workout name is required',
})

export const addWorkoutExerciseBody = z.object({
  exerciseId: id,
})

export const workoutSetBody = z.object({
  workoutExerciseId: id,
  setNumber: z.number().int().min(1).max(100),
  reps: z.number().int().min(1).max(500),
  weight: z.number().min(0).max(2000),
  weightUnit: z.enum(['kg', 'lb']),
  rpe: z.number().min(1).max(10).multipleOf(0.5),
})
