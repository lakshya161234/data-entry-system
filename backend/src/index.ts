import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@libsql/client/web'
import type { Context, Env } from 'hono'

const app = new Hono()

app.use('*', cors())


const getDB = (env: Env) =>
  createClient({
    url: env.TURSO_DB_URL,
    authToken: env.TURSO_DB_TOKEN
  })

app.post('/entries', async (c: Context) => {
  const body = await c.req.json()
  const { name, age, gender, charges, payment } = body
  const timestamp = new Date().toISOString()

  try {
    const db = getDB(c.env)
    await db.execute({
      sql: 'INSERT INTO entries (name, age, gender, timestamp, charges, payment) VALUES (?, ?, ?, ?, ?, ?)',
      args: [name, age, gender, timestamp, charges, payment]
    })
    return c.json({ success: true })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

app.get('/entries', async (c: Context) => {
  try {
    const db = getDB(c.env)
    const result = await db.execute('SELECT * FROM entries ORDER BY id DESC')
    return c.json(result.rows)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

app.get('/api', (c) => c.text('API Running'))

app.put('/entries/:id', async (c: Context) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { name, age, gender, charges, payment } = body;

  try {
    const db = getDB(c.env);
    await db.execute({
      sql: `UPDATE entries SET name = ?, age = ?, gender = ?, charges = ?, payment = ? WHERE id = ?`,
      args: [name, age, gender, charges, payment, id]
    });
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default app
