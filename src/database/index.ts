import { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";

const config: DataSourceOptions = {
    type: 'postgres', //process.env['DB_TYPE'] as 'postgres' | 'postgres',
    host: "localhost", // process.env['DB_HOST'],
    port: 5432, //parseInt(`${process.env['DB_PORT']}`, 5432),
    username: "postgres", //process.env['DB_USERNAME'],
    password: "Odenza@2025", //process.env['DB_PASSWORD'],
    database: "yasser", //process.env['DB_NAME'],
    logging: 'all', //process.env['DB_LOGGING'] === '1',
    entities: [join(__dirname, '/pulse/entity/*{.ts,.js}')],
    // migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
    // entities: [join(__dirname, '/entities/**/*{.ts,.js}')],
    // ...(process.env['DB_TYPE'] === 'mysql' ? { connectorPackage: 'mysql2' } : {}),
    synchronize: true, // ⚠️ Use only in development
};

const dataSource = new DataSource({ ...config });

export {
    config,
    dataSource
};

export default new DataSource({ ...config });