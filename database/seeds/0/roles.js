export const { seed } = {
  seed: (knex) => {
    // # Deletes ALL existing entries
    return knex('role')
      .del()
      .then(() => {
        // # Inserts seed entries here
        return knex('role').insert([{ name: 'admin' }, { name: 'staff' }, { name: 'user' }]);
      });
  },
};
