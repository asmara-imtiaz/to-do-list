# Todo REST API Blueprint

This blueprint describes a minimal REST API covering the user stories using Pinia on the client. Even though the current app persists to `localStorage`, this API spec can back the same UI in a real backend later.

## Resource: Todo

Fields
- `id` string – unique identifier
- `title` string – activity text
- `completed` boolean – completion status
- `createdAt` number – epoch ms

## Endpoints

### List Todos
- Method: GET
- Path: `/api/todos`
- Query params:
  - `filter` optional: `all` | `active` | `completed`
- Responses:
  - 200 OK: `[{ id, title, completed, createdAt }]`

### Create Todo
- Method: POST
- Path: `/api/todos`
- Body (JSON): `{ title: string }`
- Responses:
  - 201 Created: `{ id, title, completed, createdAt }`
  - 400 Bad Request: `{ error: 'Title is required' }`

### Toggle/Update Todo
- Method: PATCH
- Path: `/api/todos/{id}`
- Body (JSON): `{ title?: string, completed?: boolean }`
- Responses:
  - 200 OK: `{ id, title, completed, createdAt }`
  - 404 Not Found

### Delete Todo
- Method: DELETE
- Path: `/api/todos/{id}`
- Responses:
  - 204 No Content
  - 404 Not Found

### Clear Completed
- Method: DELETE
- Path: `/api/todos`
- Query: `?completed=true`
- Responses:
  - 204 No Content

## Notes
- Authentication is out of scope for this exercise.
- Rate limiting and pagination can be added later (cursor-based preferred).
- Errors use JSON problem details style: `{ error: string, details?: any }`.


