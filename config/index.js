import path from 'path';
import process from 'process';
import yargs, { strict, strictCommands } from 'yargs';
import { hideBin } from 'yargs/helpers';

import { __dirname } from '../lib/getFileDir.js';
import { jsonLoaderSync } from '../lib/jsonLoader.js';

import { injectEnv } from './injectEnv.js';

// TODO: this needs to be replaced once node supports json imports natively
const config = jsonLoaderSync(path.join(__dirname(import.meta), 'config.json'));

const envPre = config.ENV_PREFIX || '';

config.NODE_ENV = process.env.NODE_ENV || 'development';

const regex =
  /(?<field>[A-Z]+)_(?<index>\d+)_(?<key>client|host|port|user|pass|db|debug|pool_min|pool_max)/;

// # Custom parsing of values to correct types from string and validation checks
const validateAndGetParsedValue = (new_key) => {
  let lnew_key = new_key + '';
  const key = `${envPre}${new_key}`;
  const value = process.env[key];

  const tempMatch = lnew_key.match(regex);
  if (tempMatch) {
    // ^ Reformat the key temporarily to a common form for parsing, example given below for db
    const { field, index, key } = tempMatch.groups;
    lnew_key = `${field}_${key}`;
  }

  // ^ Add or change env key validation here based on requirement
  switch (lnew_key) {
    case 'PROXY':
    case 'DB_debug':
      return value === 'true';
    case 'DB_pool_max':
    case 'DB_pool_min':
    case 'DB_port':
    case 'PORT':
    case 'SMTP_port':
      if (isNaN(+value)) throw Error(`Invalid value provided for env variable ${key}`);
      return +value;
    default:
      return value;
  }
};

const yargsCheck = (arr) => {
  // yargs(arr)
  // .command('get', 'make a get HTTP request', {
  //   url: {
  //     alias: 'u',
  //     default: 'http://yargs.js.org/'
  //   }
  // })
  // .help('h')
  // .argv
  let tmp1 = yargs(arr).env(envPre).argv;
  console.log(tmp1);
  const defKey = Object.keys(tmp1.db);
  let tmp = yargs(arr)
    .scriptName('npm run')
    .usage('Usage: npm run <command> -- -- [options]')
    // .usage('Usage: knex --esm <command> -- [options]')
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
    .positional('filename', {
      description: 'The name of file for migrate:make and seed:make',
      default: 'test',
    })
    .option({
      database: {
        description: 'Select the database to run the associated migration',
        required: defKey.length > 1,
        alias: 'd',
        choices: defKey.map(Number),
        nargs: 1,
        number: true,
      },
    })
    .example('npm run migrate -- -- -d 1', 'run all migrations for database 1')
    .example('npm run seed -- -- -d 2', 'run all seeds for database 2')
    .example('knex --esm migrate:latest -- -d 1', 'run all migrations for database 1')
    .example('knex --esm seed:run -- -d 2', 'run all seeds for database 2');
  if (defKey.length === 1) tmp.default('database', +defKey[0]);
  else tmp.demandOption('database', 'Provide the db to be used with -d or --database option');

  tmp.env(envPre);

  tmp
    .help('h')
    .alias('h', 'help')
    .showHelpOnFail(true)
    .epilogue('For more information, visit https://github.com/bitDaft/express-sql-template');
  console.log('----------------------');
  console.log(tmp.argv);
  return tmp.argv;
};

export const init = (extra = {}) => {
  // # Combines process.env into config for uniform access
  if (config.NODE_ENV !== 'production') injectEnv(config);

  // # parse any grouped multi key values like for multitenant db connections
  // parseFromConfig();

  // # Combines extra into config for uniform access
  for (let key in extra) config[key] = extra[key];

  // # Combines cli args into config for uniform access
  let arr = hideBin(process.argv);
  let idx = arr.indexOf('--');
  if (~idx) arr.splice(idx, 1);

  const parsedArgs = yargsCheck(arr);
  for (let key in parsedArgs) config[key] = parsedArgs[key];

  console.log(parsedArgs);
  console.log(config);
  return config;
};

init();

export default config;
