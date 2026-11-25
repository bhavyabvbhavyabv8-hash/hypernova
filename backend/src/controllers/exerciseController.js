import { database } from '../db/pool.js'
import { HttpError } from '../utils/httpError.js'

function getDatabase(req) {
  return req.app.locals.database || database
}

export async function listExercises(req, res) {
  const { search, muscleGroup, equipment } = req.validatedQuery
  const values = [req.user.id]
  const filters = ['(owner_user_id IS NULL OR owner_user_id = $1)']

  if (search) {
    values.push(`%${search}%`)
    filters.push(`name ILIKE $${values.length}`)
  }
  if (muscleGroup) {
    values.push(muscleGroup)
    filters.push(`muscle_group ILIKE $${values.length}`)
  }
  if (equipment) {
    values.push(equipment)
    filters.push(`equipment ILIKE $${values.length}`)
  }

  const result = await getDatabase(req).query(
    `SELECT id, name, muscle_group AS "muscleGroup", equipment, description,
            owner_user_id IS NOT NULL AS "isCustom"
     FROM exercises
     WHERE ${filters.join(' AND ')}
     ORDER BY muscle_group, name`,
    values,
  )

  res.json({ exercises: result.rows })
}

export async function createExercise(req, res) {
  const { name, muscleGroup, equipment, description } = req.validatedBody
  try {
    const result = await getDatabase(req).query(
      `INSERT INTO exercises (owner_user_id, name, muscle_group, equipment, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, muscle_group AS "muscleGroup", equipment, description,
                 TRUE AS "isCustom"`,
      [req.user.id, name, muscleGroup, equipment, description],
    )
    res.status(201).json({ exercise: result.rows[0] })
  } catch (error) {
    if (error.code === '23505') {
      throw new HttpError(409, 'You already have a custom exercise with this name.')
    }
    throw error
  }
}
