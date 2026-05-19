# API Catalog (RFC 9727)

This site publishes an API catalog at `/.well-known/api-catalog` in `application/linkset+json` format. The catalog contains link relations for:

- `service-desc` — OpenAPI specification at `/openapi.json`
- `service-doc` — Service documentation at the site root
- `status` — Health check endpoint at `/api/health`

## Implementation

The catalog is served by `src/pages/.well-known/api-catalog.ts` as a dynamic Astro endpoint returning JSON with the `linkset` array structure defined in RFC 9727.

## Reference

- [RFC 9727: Finding and Using .well-known URIs](https://www.rfc-editor.org/rfc/rfc9727)
- [RFC 9264: Linkset: Media Types and Link Relations](https://www.rfc-editor.org/rfc/rfc9264)
