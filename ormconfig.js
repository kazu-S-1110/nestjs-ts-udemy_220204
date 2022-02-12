module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  autoLoadEntities: true, //entityを作るたびに登録しないとならないのをAutoにする。
  entities: ['dist/entities/*.entity.js'], //compileされたファイルを扱うので指定しておく
  migrations: ['dist/migrations/*.js'],
  cli: {
    entitiesDir: '../entities',
    migrationsDir: '../migrations',
  },
};
