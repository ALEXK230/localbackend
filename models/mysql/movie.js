import { randomUUID } from 'node:crypto'
import { getPool } from '../../config/dbMysql.js'

export class MovieModel {
  static _mapRow(row) {
    // normalize DB row to model
    return {
      id: row.id,
      title: row.title,
      year: row.year,
      director: row.director,
      duration: row.duration,
      poster: row.poster,
      genre: row.genre ? JSON.parse(row.genre) : [],
      rate: row.rate,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }
  }

  static async getAll({ genre } = {}) {
    const pool = getPool()
    if (genre) {
      const [rows] = await pool.query('SELECT * FROM movies WHERE JSON_CONTAINS(genre, ?)', [JSON.stringify(genre)])
      return rows.map(this._mapRow)
    }
    const [rows] = await pool.query('SELECT * FROM movies')
    return rows.map(this._mapRow)
  }

  static async getById(id) {
    const pool = getPool()
    const [rows] = await pool.query('SELECT * FROM movies WHERE id = ? LIMIT 1', [id])
    if (rows.length === 0) return null
    return this._mapRow(rows[0])
  }

  static async create({ input }) {
    const pool = getPool()
    const id = randomUUID().replace(/-/g, '')
    const now = new Date()
    const genre = JSON.stringify(input.genre || [])
    const params = [id, input.title, input.year, input.director, input.duration, input.poster, genre, input.rate ?? 5, now, now]
    await pool.query(
      'INSERT INTO movies (id, title, year, director, duration, poster, genre, rate, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)',
      params
    )
    return { id, ...input, genre: input.genre }
  }

  static async delete({ id }) {
    const pool = getPool()
    const [result] = await pool.query('DELETE FROM movies WHERE id = ?', [id])
    return result.affectedRows > 0
  }

  static async update({ id, input }) {
    const pool = getPool()
    const fields = []
    const values = []
    if (input.title !== undefined) { fields.push('title = ?'); values.push(input.title) }
    if (input.year !== undefined) { fields.push('year = ?'); values.push(input.year) }
    if (input.director !== undefined) { fields.push('director = ?'); values.push(input.director) }
    if (input.duration !== undefined) { fields.push('duration = ?'); values.push(input.duration) }
    if (input.poster !== undefined) { fields.push('poster = ?'); values.push(input.poster) }
    if (input.genre !== undefined) { fields.push('genre = ?'); values.push(JSON.stringify(input.genre)) }
    if (input.rate !== undefined) { fields.push('rate = ?'); values.push(input.rate) }

    if (fields.length === 0) return false

    values.push(new Date()) // updatedAt
    values.push(id)

    const sql = `UPDATE movies SET ${fields.join(', ')}, updatedAt = ? WHERE id = ?`
    const [result] = await pool.query(sql, values)
    if (result.affectedRows === 0) return false
    return this.getById(id)
  }

  static async clearAll() {
    const pool = getPool()
    await pool.query('DELETE FROM movies')
    return true
  }
}
