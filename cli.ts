import createLogger from "./lib/logger";
import argv from './lib/args';
// import Ejs from 'ejs';




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



(async function main () {

  switch ( argv.getAction() )
  {
    case 'create-cpe-config': {
      return doAddUser();
    };

    default: {
      throw new Error('unknown action ' + argv.getAction());
    }
  }

})();