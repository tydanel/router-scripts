import * as dotenv from 'dotenv';;
import SshCommand from './lib/runner';
import createLogger from "./lib/logger";
import argv from './lib/args';
import { writeFileSync } from 'fs';
dotenv.config();



const log = createLogger('log', 'cli');
const logWarn  = createLogger('warn', 'cli');
const logError = createLogger('error', 'cli');


interface ArgumentProvider {
  getOpt: (name: string) => string | null,
  getFlag: (name: string) => boolean
}


function trimLines(str : string) {
  return str
  .split('\n')
  .map(line => line.trim())
  .filter(line => line !== '')
  .join('\n');
}

type CpeTemplateData =
  { identity : string
  , username : string 
  , password : string    
  }

function cpeTeplate({ identity, username, password } : CpeTemplateData) {
  return trimLines(`
  /interface/bridge
  add name=bridge-lan
  
  /interface/bridge/port
  add bridge=bridge-lan interface=ether1


  /interface/pppoe-client
  add add-default-route=yes interface=wlan1 name=internet use-peer-dns=yes user=${username} password=${password}

  /system/identity name=${identity}

  `);
}

function makeCreateCpeConfigFn( opts : ArgumentProvider ) {
  return function doCreasteCpeConfig() {
    const username = opts.getOpt('username');
    const password = opts.getOpt('password');
    const identity = opts.getOpt('identity');

    if ( !username ) throw new Error('Username is required');
    if ( !password ) throw new Error("Password is required");
    if ( !identity ) throw new Error("Identity is required");

    const config = cpeTeplate({ username, password, identity });
    
    writeFileSync(`cpe-${username}.rsc`, config);
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
