# WishCraft AI API

Base URL: `/api`

All JSON responses use `{ data, total? }` on success and `{ error }` on failure.

## Health

`GET /health`

```json
{ "status": "ok", "service": "wishcraft-ai", "templates": 50 }
```

## Templates

`GET /templates` — summary catalog  
`GET /templates/full` — full JSON configs (50 cards)  
`GET /templates/:id` — one template

## Sessions

`POST /sessions`  
Body: `{ "name": "Aanya" }`  
Creates a generation session.

`GET /sessions/:id`

`POST /sessions/:id/photo`  
`multipart/form-data` field `photo` (JPG or PNG, default max 8MB).  
Returns the session plus `photoUrl`.

`POST /sessions/:id/generate`  
Creates 50 cards (one per template) for the session.

`GET /sessions/:id/cards`  
`GET /sessions/:id/cards/:position`  
Position is 1–50.

`POST /sessions/:id/download`  
Body: `{ "templateId": 12 }`  
Records an HD download event.

## Notes

- Photo framing, typography, and PNG export happen on the client with Konva for instant HD output.
- SQLite stores templates, sessions, generated card order, and download history.
- In production the Express server also serves the Vite `frontend/dist` build.
