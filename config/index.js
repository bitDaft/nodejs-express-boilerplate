import path from 'path';
import process from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { __dirname } from '../lib/getFileDir.js';
import { jsonLoaderSync } from '../lib/jsonLoader.js';

import { injectEnv } from './injectEnv.js';

// TODO: this needs to be replaced once node supports json imports natively
const config = jsonLoaderSync(path.join(__dirname(import.meta), 'config.json'));

const envPre = config.ENV_PREFIX || '';

config.NODE_ENV = process.env.NODE_ENV || 'development';

// # Custom parsing of values to correct types from string and validation checks
const validateAndParseBooleanConfig = (config) => {
  for (let key in config) {
    let value = config[key];
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      validateAndParseBooleanConfig(value);
    } else if (value === 'true') {
      config[key] = true;
    } else if (value === 'false') {
      config[key] = false;
    }
  }
};

const yargsCheck = (arr) => {
  let tmp1 = yargs(arr).env(envPre).argv;
  const defKey = Object.keys(tmp1.db);
  let tmp = yargs(arr)
    .scriptName('npm run')
    .usage('Usage: npm run <command> -- -- [options]')
    .usage('Usage: knex --esm <command> -- [options]')
    .command({
      command: 'migrate',
      desc: 'Run all remaining migration',
    })
    .command({
      command: 'migrate:one',
      desc: 'Run the next migration in line',
    })
    .command({
      command: 'migrate:make <filename>',
      desc: 'Create a new migration',
      builder: (yargs) => {
        yargs.positional('filename', {
          description: 'The name of the migration file',
          type: 'string',
        });
      },
    })
    .command({
      command: 'migrate:list',
      desc: 'List all migrations',
    })
    .command({
      command: 'rollback',
      desc: 'Revert last migration batch',
    })
    .command({
      command: 'rollback:one',
      desc: 'Revert a single migration',
    })
    .command({
      command: 'seed',
      desc: 'Run all seeds',
    })
    .command({
      command: 'seed:make <filename>',
      desc: 'Create a new seed',
      builder: (yargs) => {
        yargs.positional('filename', {
          description: 'The name of the seed file',
          type: 'string',
        });
      },
    })
    .command({
      command: 'help',
      desc: 'Show this help',
    })
    .positional('filename', {
      description: 'The name of file for migrate:make and seed:make',
    })
    .example('npm run migrate -- -- -d 1', 'run all migrations for database 1')
    .example('npm run seed -- -- -d 2', 'run all seeds for database 2')
    .example('knex --esm migrate:latest -- -d 1', 'run all migrations for database 1')
    .example('knex --esm seed:run -- -d 2', 'run all seeds for database 2');

  if (tmp1['$0'] !== 'bin/www.js') {
    tmp.option({
      database: {
        description: 'Select the database to run the associated migration',
        required: defKey.length > 1,
        alias: 'd',
        choices: defKey.map(Number),
        nargs: 1,
        number: true,
      },
    });
    if (defKey.length === 1) tmp.default('database', +defKey[0]);
    else tmp.demandOption('database', 'Provide the db to be used with -d or --database option');
  }

  tmp.env(envPre);

  tmp
    .help('h')
    .alias('h', 'help')
    .showHelpOnFail(true)
    .epilogue('For more information, visit https://github.com/bitDaft/express-sql-template');
  return tmp.argv;
};

export const init = (extra = {}) => {
  // # Loads env vars from file
  if (config.NODE_ENV !== 'production') injectEnv(config);

  // # Combines extra into config for uniform access
  for (let key in extra) config[key] = extra[key];

  // # Combines cli args into config for uniform access
  let arr = hideBin(process.argv);
  let idx = arr.indexOf('--');
  if (~idx) arr.splice(idx, 1);

  const parsedArgs = yargsCheck(arr);
  for (let key in parsedArgs) config[key] = parsedArgs[key];

  // # Parse any boolean value in config since yargs does not parse it
  validateAndParseBooleanConfig(config);

  delete config._;
  delete config.ENV_PREFIX;
  delete config.ENV_FILENAME;
  delete config['$0'];
  return config;
};

init();

export default config;
