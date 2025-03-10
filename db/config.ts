import { defineDb, defineTable, column } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    createdOn: column.date({ default: new Date() }),
    updatedOn: column.date({ default: new Date() }),
    email: column.text(),
    name: column.text(),
    githubId: column.text(),
    isPremium: column.boolean({ default: false }),
  },
});

export default defineDb({
  tables: { User },
})