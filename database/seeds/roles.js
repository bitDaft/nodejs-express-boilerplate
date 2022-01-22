export const { seed } = {
  seed: (knex) => {
    // # Deletes ALL existing entries
    return knex("role")
      .del()
      .then(() => {
        // ^ Inserts seed entries
        return knex("role").insert([{ name: "user" }, { name: "admin" }]);
      });
  },
};
