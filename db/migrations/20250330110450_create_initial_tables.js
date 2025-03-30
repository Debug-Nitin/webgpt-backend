export function up(knex) {
    return knex.schema
      .createTable('websites', (table) => {
        table.increments('website_id').primary()
        table.string('url').unique().notNullable()
        table
          .enum('crawl_status', ['pending', 'crawling', 'completed', 'error'])
          .defaultTo('pending')
        table.timestamp('last_crawled').defaultTo(null)
      })
      .createTable('pages', (table) => {
        table.increments('page_id').primary()
        table
          .integer('website_id')
          .references('website_id')
          .inTable('websites')
          .onDelete('CASCADE')
        table.string('url').unique().notNullable()
        table.text('content')
        table.text('extracted_text')
      })
      .createTable('query_logs', (table) => {
        table.increments('query_id').primary()
        table.timestamp('timestamp').defaultTo(knex.fn.now())
        table.text('user_query').notNullable()
        table.string('website_url')
        table.text('answer')
        table.string('source_url')
        table.float('confidence')
      })
  }
  
export function down(knex) {
    return knex.schema
      .dropTableIfExists('query_logs')
      .dropTableIfExists('pages')
      .dropTableIfExists('websites')
  }
  