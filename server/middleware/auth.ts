const protectedRoutePatterns = [
  { pattern: /^\/api\/subscription\/[^/]+\/whatsapp\/?$/i, method: 'POST' },
  { pattern: /^\/api\/subscription\/[^/]+\/email\/?$/i, method: 'POST' },
  { pattern: /^\/api\/subscription\/[^/]+\/notification\/?$/i, method: 'POST' },
  { pattern: /^\/api\/photo\/?$/i, method: 'POST' },
  { pattern: /^\/api\/video\/?$/i, method: 'POST' },
]

export default defineEventHandler((event) => {
  const isProtected = protectedRoutePatterns.some(({ pattern, method }) => pattern.test(event.node.req.url || '') && event.node.req.method?.toUpperCase() === method)
  if (!isProtected) {
    return
  }

  const config = useRuntimeConfig()
  const authHeader = getRequestHeader(event, 'authorization')

  if (extractBearerToken(authHeader) !== config.private.serverValidationKey) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unauthorized',
      data: { message: 'Invalid or missing API token' },
    })
  }
})
