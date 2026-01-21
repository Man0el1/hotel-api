//em vez de Model.create usamos queryInterface.bulkInsert

export async function up(queryInterface) {
  await queryInterface.bulkInsert('quarto', [
    { numero: 101, tipo: 'SOLTEIRO', is_smoker: false, is_front_view: true },
    { numero: 102, tipo: 'SOLTEIRO', is_smoker: false, is_front_view: false },
    { numero: 103, tipo: 'CASAL', is_smoker: false, is_front_view: true },
    { numero: 104, tipo: 'CASAL', is_smoker: true, is_front_view: false },
    { numero: 105, tipo: 'FAMILIA', is_smoker: false, is_front_view: false },
    { numero: 106, tipo: 'SOLTEIRO', is_smoker: false, is_front_view: false },
    { numero: 107, tipo: 'CASAL', is_smoker: false, is_front_view: true },
    { numero: 108, tipo: 'FAMILIA', is_smoker: true, is_front_view: false },
    { numero: 109, tipo: 'LUXO', is_smoker: false, is_front_view: true },
    { numero: 110, tipo: 'SOLTEIRO', is_smoker: false, is_front_view: false },

    { numero: 201, tipo: 'SOLTEIRO', is_smoker: false, is_front_view: true },
    { numero: 202, tipo: 'CASAL', is_smoker: false, is_front_view: false },
    { numero: 203, tipo: 'CASAL', is_smoker: false, is_front_view: true },
    { numero: 204, tipo: 'FAMILIA', is_smoker: false, is_front_view: false },
    { numero: 205, tipo: 'SOLTEIRO', is_smoker: true, is_front_view: false },
    { numero: 206, tipo: 'CASAL', is_smoker: false, is_front_view: false },
    { numero: 207, tipo: 'FAMILIA', is_smoker: false, is_front_view: true },
    { numero: 208, tipo: 'SOLTEIRO', is_smoker: false, is_front_view: false },
    { numero: 209, tipo: 'LUXO', is_smoker: false, is_front_view: true },
    { numero: 210, tipo: 'LUXO', is_smoker: false, is_front_view: true }
  ]);
}
export async function down(queryInterface) {
  await queryInterface.bulkDelete('quarto', null, {});
}
