import { database } from '../db/pool.js'
import { HttpError } from '../utils/httpError.js'

function getDatabase(req) {
  return req.app.locals.database || database
}

async function loadTemplate(db, userId, templateId) {
  const result = await db.query(
    `SELECT t.id, t.name, t.description, t.created_at AS "createdAt",
            t.updated_at AS "updatedAt", te.id AS "templateExerciseId",
            te.exercise_id AS "exerciseId", te.position,
            te.target_sets AS "targetSets", te.target_reps AS "targetReps",
            te.target_rpe AS "targetRpe", e.name AS "exerciseName",
            e.muscle_group AS "muscleGroup", e.equipment
     FROM workout_templates t
     LEFT JOIN template_exercises te ON te.template_id = t.id
     LEFT JOIN exercises e ON e.id = te.exercise_id
     WHERE t.id = $1 AND t.user_id = $2
     ORDER BY te.position`,
    [templateId, userId],
  )

  if (result.rows.length === 0) throw new HttpError(404, 'Workout template not found.')
  const first = result.rows[0]
  return {
    id: String(first.id),
    name: first.name,
    description: first.description,
    createdAt: first.createdAt,
    updatedAt: first.updatedAt,
    exercises: result.rows
      .filter((row) => row.templateExerciseId)
      .map((row) => ({
        id: String(row.templateExerciseId),
        exerciseId: String(row.exerciseId),
        name: row.exerciseName,
        muscleGroup: row.muscleGroup,
        equipment: row.equipment,
        position: row.position,
        targetSets: row.targetSets,
        targetReps: row.targetReps,
        targetRpe: row.targetRpe === null ? null : Number(row.targetRpe),
      })),
  }
}

async function insertTemplateExercises(client, templateId, userId, exercises) {
  for (const [index, exercise] of exercises.entries()) {
    const allowed = await client.query(
      'SELECT id FROM exercises WHERE id = $1 AND (owner_user_id IS NULL OR owner_user_id = $2)',
      [exercise.exerciseId, userId],
    )
    if (allowed.rows.length === 0) {
      throw new HttpError(400, 'A selected exercise is unavailable.')
    }

    await client.query(
      `INSERT INTO template_exercises
         (template_id, exercise_id, position, target_sets, target_reps, target_rpe)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        templateId,
        exercise.exerciseId,
        index + 1,
        exercise.targetSets,
        exercise.targetReps,
        exercise.targetRpe ?? null,
      ],
    )
  }
}

export async function listTemplates(req, res) {
  const result = await getDatabase(req).query(
    `SELECT id FROM workout_templates
     WHERE user_id = $1
     ORDER BY updated_at DESC`,
    [req.user.id],
  )
  const templates = []
  for (const row of result.rows) {
    templates.push(await loadTemplate(getDatabase(req), req.user.id, row.id))
  }
  res.json({ templates })
}

export async function getTemplate(req, res) {
  const template = await loadTemplate(getDatabase(req), req.user.id, req.validatedParams.id)
  res.json({ template })
}

export async function createTemplate(req, res) {
  const { name, description, exercises } = req.validatedBody
  let templateId

  try {
    templateId = await getDatabase(req).transaction(async (client) => {
      const created = await client.query(
        `INSERT INTO workout_templates (user_id, name, description)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [req.user.id, name, description],
      )
      const id = created.rows[0].id
      await insertTemplateExercises(client, id, req.user.id, exercises)
      return id
    })
  } catch (error) {
    if (error.code === '23505') {
      throw new HttpError(409, 'A template with this name already exists.')
    }
    throw error
  }

  res.status(201).json({
    template: await loadTemplate(getDatabase(req), req.user.id, templateId),
  })
}

export async function updateTemplate(req, res) {
  const { name, description, exercises } = req.validatedBody
  const templateId = req.validatedParams.id

  try {
    await getDatabase(req).transaction(async (client) => {
      const updated = await client.query(
        `UPDATE workout_templates
         SET name = $1, description = $2, updated_at = NOW()
         WHERE id = $3 AND user_id = $4
         RETURNING id`,
        [name, description, templateId, req.user.id],
      )
      if (updated.rows.length === 0) throw new HttpError(404, 'Workout template not found.')

      await client.query('DELETE FROM template_exercises WHERE template_id = $1', [templateId])
      await insertTemplateExercises(client, templateId, req.user.id, exercises)
    })
  } catch (error) {
    if (error.code === '23505') {
      throw new HttpError(409, 'A template with this name already exists.')
    }
    throw error
  }

  res.json({
    template: await loadTemplate(getDatabase(req), req.user.id, templateId),
  })
}

export async function deleteTemplate(req, res) {
  const result = await getDatabase(req).query(
    'DELETE FROM workout_templates WHERE id = $1 AND user_id = $2 RETURNING id',
    [req.validatedParams.id, req.user.id],
  )
  if (result.rows.length === 0) throw new HttpError(404, 'Workout template not found.')
  res.status(204).end()
}
