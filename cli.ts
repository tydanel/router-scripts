import * as dotenv from 'dotenv';;
import SshCommand from './lib/runner';
import createLogger from "./lib/logger";
import argv from './lib/args';
dotenv.config();



const log = createLogger('log', 'cli');
const logWarn  = createLogger('warn', 'cli');
const logError = createLogger('error', 'cli');


interface ArgumentProvider {
  getOpt: (name: string) => string | null,
  getFlag: (name: string) => boolean
}


function makeCreateCpeConfigFn( opts : ArgumentProvider ) {
  return function doCreasteCpeConfig() {

    const username = opts.getOpt('username');
    const password = opts.getOpt('password');

    log('doCreateCpeConfig', { username, password });
  }
}

const doCreateCpeConfig = makeCreateCpeConfigFn(argv);

async function doRunScript() {
  const script = argv.getOpt('script');  
  const command = new SshCommand(`/system/script/run ${script}`);
  await command.execute();
}


(async function main () {
  try {
    switch ( argv.getAction() )
    {
      case 'create-cpe-config': {
        return doCreateCpeConfig();
      };
      case 'run-script': {
        return doRunScript();
      };
      default: {
        throw new Error('unknown action ' + argv.getAction());
      }
    }
  } catch (error) {
    logError('main', error);
    process.exit(44);
  }

})();
