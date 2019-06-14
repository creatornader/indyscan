const { jitterize } = require('./util')
const { createLedgerStorageManager } = require('indyscan-storage')

const createIndyClient = require('./indyclient')
const sleep = require('sleep-promise')
const storage = require('indyscan-storage')


const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'LOOPBACKdevuser',
  password: 'LOOPBACKdevpwd',
  database: 'LOOPBACKdevdb'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
});

//const fs = require('fs');
//const readline = require('readline');
//const stream = require('stream');

async function addDids(){
  // load in the target DIDs
  var DIDs = [];
  DIDs.push('did:sov:NMjQb59rKTJXKNqVYfcZFi');
  DIDs.push('did:sov:K2ze2xR8MAxkQscdkboKnD');
  //var DIDs = require('fs').readFileSync('dids.txt').toString().split('\n').forEach(function (line) { line; });
  //console.log(DIDs);
  /*
  
  var instream = fs.createReadStream('./dids.txt');
  var outstream = new stream;
  var rl = readline.createInterface(instream, outstream);

  rl.on('line', function(line) {
    // process line here
    DIDs.push(line);
  })

  rl.on('close', function() {
    // do something on finish here
    console.log('DIDs', DIDs);
    console.log('done');
  })
  */
  console.log('Connected to MySQL##########################################################################');
  //console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  // retrieve all transactions from Mongo related to target DIDs
  //findTx();
  //console.log(DIDs);
  //console.log(DIDs[1]);
  //console.log(DIDs[0]);

  // for each DID, assemble the DID Doc and store it in MySQL
  
  for(const did of DIDs){
    //console.log(did);
    var sql = "SELECT * FROM LOOPBACKdevdb.DidRecords WHERE owner_did='";
    sql += did;
    sql += "' ORDER BY update_time DESC";
    //console.log(sql);
    //console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    
    // construct DID Document
    var DID_Document_JS = {
      id:did,
      service:[],
      authentication:{},
      publicKey:[],
      context:'https://w3id.org/did/v1'
    };
    var DID_Document = JSON.stringify(DID_Document_JS);
    console.log(DID_Document);

    // construct DID Record
    var DID_Record_JS = {
      owner_did:did,
      update_time:'123',
      version_nr:0,
      version_id:'0',
      did_doc:DID_Document,
      version_metadata:{},
      method:'sov'
    };
    var DID_Record = JSON.stringify(DID_Record_JS);
    console.log(DID_Record);
    
    console.log(typeof DID_Record)
    //connection.query('INSERT INTO LOOPBACKdevdb.DidRecords SET ?', DID_Record, (error, results, fields) => {
    /*
    connection.query('INSERT INTO LOOPBACKdevdb.DidRecords SET {owner_did:,update_time:,version_nr:,version_id:,did_doc:,version_metadata:,method:}', (error, results, fields) => {
      if (error) {
        console.error('An error occurred while executing the query')
        throw error
      }
    })
    */
    
    connection.query('SELECT * FROM LOOPBACKdevdb.DidRecords', function (error, results, fields){
      if (error)
        throw error;

      results.forEach(result => {
        console.log(result);
      });
    });

    
    
  }
  
}
/*
  
*/

//* `owner_did` (type: string) -> REQUIRED
//* `update_time` (type: string) -> REQUIRED
//* `version_nr` (type: number) -> REQUIRED
//* `version_id` (type: string)
//* `did_doc` (type: JSON) -> REQUIRED
//* `version_metadata` (type: JSON)
//* `method` (type: string) -> REQUIRED
//* `id` (type: number) -> auto-injected ID which serves as the primary key for the DID Records database


const URL_MONGO = process.env.URL_MONGO || 'mongodb://localhost:27017'
const INDY_NETWORKS = process.env.INDY_NETWORKS
let ledgerManager

const LEDGER_NAME_TO_CODE = {
  'POOL': '0',
  'DOMAIN': '1',
  'CONFIG': '2'
}

const indyNetworks = INDY_NETWORKS.split(',')
const scanModes = {
  'SLOW': { secTimeoutOnFailure: 20, secTimeoutIfNewTxFound: 12, secTimeoutIfNoNewTxFound: 30, jitterRatio: 0.1 },
  'MEDIUM': { secTimeoutOnFailure: 20, secTimeoutIfNewTxFound: 6, secTimeoutIfNoNewTxFound: 15, jitterRatio: 0.1 },
  'INDYSCAN.IO': { secTimeoutOnFailure: 30, secTimeoutIfNewTxFound: 3, secTimeoutIfNoNewTxFound: 6, jitterRatio: 0.15 },
  'FAST': { secTimeoutOnFailure: 20, secTimeoutIfNewTxFound: 1, secTimeoutIfNoNewTxFound: 1, jitterRatio: 0.1 },
  'TURBO': { secTimeoutOnFailure: 20, secTimeoutIfNewTxFound: 0.3, secTimeoutIfNoNewTxFound: 1, jitterRatio: 0.1 },
  'FRENZY': { secTimeoutOnFailure: 20, secTimeoutIfNewTxFound: 0.1, secTimeoutIfNoNewTxFound: 1, jitterRatio: 0.1 }
}

const SCAN_MODE = process.env.SCAN_MODE || 'MEDIUM'

async function run () {
  ledgerManager = await createLedgerStorageManager(URL_MONGO)
  for (const indyNetwork of indyNetworks) {
    await scanNetwork(indyNetwork)
  }
}

async function scanNetwork (networkName) {
  console.log(`Initiating network scan for network '${networkName}'.`)
  try {
    ledgerManager.addIndyNetwork(networkName)
    const indyClient = await createIndyClient(networkName, `sovrinscan-${networkName}`)
    const txCollectionDomain = ledgerManager.getLedger(networkName, storage.txTypes.domain)
    const txCollectionPool = ledgerManager.getLedger(networkName, storage.txTypes.pool)
    const txCollectionConfig = ledgerManager.getLedger(networkName, storage.txTypes.config)
    const { secTimeoutIfNewTxFound, secTimeoutIfNoNewTxFound, secTimeoutOnFailure, jitterRatio } = scanModes[SCAN_MODE]
    console.log(`[${networkName}] Scan mode = ${SCAN_MODE}. Scanning starts soon.
      New-Tx-Found-Timeout=${secTimeoutIfNewTxFound}, 
      No-New-Tx-Found-Timeout=${secTimeoutIfNoNewTxFound}
      Failure-Timeout=${secTimeoutOnFailure} 
      jitterRatio=${jitterRatio}`
    )
    setTimeout(() => {
      scanLedger(indyClient, txCollectionDomain, networkName, 'DOMAIN', secTimeoutIfNewTxFound, secTimeoutIfNoNewTxFound, secTimeoutOnFailure, jitterRatio)
      scanLedger(indyClient, txCollectionPool, networkName, 'POOL', secTimeoutIfNewTxFound, secTimeoutIfNoNewTxFound, secTimeoutOnFailure, jitterRatio)
      scanLedger(indyClient, txCollectionConfig, networkName, 'CONFIG', secTimeoutIfNewTxFound, secTimeoutIfNoNewTxFound, secTimeoutOnFailure, jitterRatio)
    }, 6 * 1000)
  } catch (err) {
    console.error(`Something when wrong creating indy client for network '${networkName}'. Details:`)
    console.error(err)
    console.error(err.stack)
  }
}

async function sleepWithJitter (logPrefix, seconds, jitterRatio) {
  const timeoutMs = jitterize(seconds * 1000, jitterRatio)
  console.debug(`${logPrefix} Sleep for ${timeoutMs}ms.`)
  await sleep(timeoutMs)
}

async function scanLedger (indyClient, txCollection, networkName, ledgerName, regularTimeoutSec, noNewTimeoutSec, failureTimeoutSec, jitterRatio) {
  const ledgerCode = LEDGER_NAME_TO_CODE[ledgerName]
  let txid = (await txCollection.findMaxTxIdInDb()) + 1
  const logPrefix = `[LedgerScan][${networkName}][${ledgerName}]`
  while (true) {
    try {
      console.log(`${logPrefix} Checking ${txid}th transaction.`)
      const tx = await indyClient.getTx(txid, ledgerCode)
      addDids();
      if (tx) {
        console.log(`${logPrefix} Retrieved '${txid}'th tx:\n${txid}:\n${JSON.stringify(tx)}`)
        await txCollection.addTx(tx)
        await sleepWithJitter(logPrefix, regularTimeoutSec, jitterRatio)
        txid++
      } else {
        console.log(`${logPrefix} Seems '${txid}'th tx does not yet exist.`)
        await sleepWithJitter(logPrefix, noNewTimeoutSec, jitterRatio)
      }
    } catch (error) {
      console.log(`${logPrefix} An error occurred:`)
      console.error(error)
      console.error(error.stack)
      await sleepWithJitter(logPrefix, failureTimeoutSec, jitterRatio)
    }
  }
}

run()
