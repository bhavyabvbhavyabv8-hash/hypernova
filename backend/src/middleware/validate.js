function validate(schema, source) {
  return (req, res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid request',
        details: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      })
    }

    req[`validated${source[0].toUpperCase()}${source.slice(1)}`] = result.data
    next()
  }
}

export const validateBody = (schema) => validate(schema, 'body')
export const validateParams = (schema) => validate(schema, 'params')
export const validateQuery = (schema) => validate(schema, 'query')
