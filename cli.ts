import * as dotenv from 'dotenv';;
import createLogger from "./lib/logger";
import argv from './lib/args';
import { SshCommand } from './lib/runner';
dotenv.config();



const log = createLogger('log', 'cli');
const logWarn  = createLogger('warn', 'cli');
const logError = createLogger('error', 'cli');



async function doAddUser() {
  
  const shouldRandomizeMissing = argv.getFlag('randomize');
  const username = argv.getOpt('username');
  const password = argv.getOpt('password');
  const vendor = argv.getOpt('vendor');

  if ( vendor === 'mikrotik' ) {

    log('doAddUser', argv.getRaw());

  }
  else {
    throw new Error('Unknown Vendor');
  }


  log('doAddUser', `Created user: ${username}:${password}`);
}


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
        return doAddUser();
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
