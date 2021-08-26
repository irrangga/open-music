/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    year: {
      type: 'INT',
      notNull: true
    },
    performer: {
      type: 'TEXT',
      notNull: true
    },
    genre: {
      type: 'TEXT',
      notNull: true
    },
    duration: {
      type: 'INT',
      notNull: true
    },
    insertedAt: {
      type: 'DATE',
      notNull: true
    },
    updatedAt: {
      type: 'DATE',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('songs')
}
