import { Sequelize } from 'sequelize';
import config from '../../config/config.cjs';

const sequelize = new Sequelize(config.development);

export default sequelize;

// sequelize.js serve para criar a conexão com o banco de dados usando as configurações
// definidas no config.js. Ele exporta a instância do Sequelize para ser usada em outros
// arquivos do projeto, como os modelos e as migrações.
