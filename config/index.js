import path from 'path';
import process from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { __dirname } from '#lib/getFileDir';
import { jsonLoaderSync } from '#lib/fileLoader';
import { isObject } from '#utils/isObject';

// TODO: this needs to be replaced once node supports json imports natively
const config = jsonLoaderSync(path.join(__dirname(import.meta), 'config.json'));

const envPre = config.ENV_PREFIX || '';

config.NODE_ENV = process.env.NODE_ENV || 'development';
config.isDev = config.NODE_ENV === 'development';

// # Custom parsing and validating values
const validateAndParseConfig = (config) => {
  for (const key in config) {
    let value = config[key];
    if (isObject(value)) validateAndParseConfig(value);
    else if (value === 'true') config[key] = true;
    else if (value === 'false') config[key] = false;
    else if (value === '') throw new Error(`Config key ${key} has no value`);
  }
};

const yargsCheck = (argvs) => {
  let arr = hideBin(argvs);
  let idx = arr.indexOf('--');
  if (~idx) arr.splice(idx, 1);
  let tmp1 = yargs(arr).env(envPre).argv;
  const defKey = Object.keys(tmp1.db);
  let tmp = yargs(arr)
    .scriptName('npm run')
    .usage('Usage: npm run <command> -- [options]')
    .usage('Usage: npm run <command> [filename] -- [options]')
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
        return yargs.positional('filename', {
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
        return yargs.positional('filename', {
          description: 'The name of the seed file',
          type: 'string',
        });
      },
    })
    .command({
      command: 'h',
      desc: 'Show this help',
    })
    .positional('filename', {
      description: 'The name of file for migrate:make and seed:make',
    })
    .positional('worker-name', {
      description: 'The name of file of worker to start an instance of',
    })
    .example('npm run migrate', 'run all migrations for default database')
    .example('npm run migrate -- -d 1', 'run all migrations for database 1')
    .example('npm run migrate:make user -- -d 1', 'create migrations for database 1')
    .example('npm run seed', 'run all seeds for default database')
    .example('npm run seed -- -d 2', 'run all seeds for database 2')
    .example('npm run seed:make roles -- -d 2', 'create seed file for database 2');

  tmp
    .command({
      command: 'startWorker <worker-name>',
      desc: 'start an worker instance',
      builder: (yargs) => {
        return yargs.positional('worker-name', {
          describe: 'the name of the worker to start',
          required: true,
        });
      },
    })
    .example('npm run startWorker mail', 'starts a new worker instance of mail');

  if (tmp1['$0'] === 'jobs/worker/worker.js') {
    tmp.option({
      'worker-name': {
        description: 'name of worker to start instance of',
        required: true,
        alias: 'w',
        nargs: 1,
        number: false,
      },
    });
  }

  if (~tmp1['$0'].indexOf('knex')) {
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
    .epilogue('For more information, visit https://github.com/bitDaft/nodejs-express-boilerplate');
  return tmp.argv;
};

export const init = async () => {
  // # Loads env vars from file
  if (config.isDev) await import('./injectEnv.js').then((_) => _.injectEnv(config.ENV_FILENAME));
  // # Combines cli args and env into config for uniform access
  const parsedArgs = yargsCheck(process.argv);
  for (const key in parsedArgs) config[key] = parsedArgs[key];

  // # Parse any boolean value in config since yargs does not parse it
  validateAndParseConfig(config);

  delete config._;
  delete config.ENV_PREFIX;
  delete config.ENV_FILENAME;
  delete config['$0'];
  return config;
};

await init();

export default config;
