module.exports.TX_DETAILS = {
  0: {name: 'NODE', description: 'Adds a new node to the pool, or updates existing node in the pool.'},
  1: {name: 'NYM', description: 'Creates a new NYM record for a specific user, trust anchor, steward or trustee.'},
  100: {name: 'ATTRIB', description: 'Adds attribute to a NYM record.'},
  101: {name: 'SCHEMA', description: 'Adds Claim\'s schema.'},
  102: {
    name: 'CLAIM_DEF',
    description: 'Adds a claim definition (in particular, public key), that Issuer creates and publishes for a particular Claim Schema'
  },
  109: {
    name: 'POOL_UPGRADE',
    description: 'Command to upgrade the Pool (sent by Trustee). It upgrades the specified Nodes (either all nodes in the Pool, or some specific ones).    '
  },
  110: {name: 'NODE_UPGRADE', description: 'Indicates state of upgrading an Indy node to different version.'},
  111: {name: 'POOL_CONFIG', description: 'Command to change Pool\'s configuration'},
  20000: {name: 'UNKNOWN_FEES_TX', description: 'TODO: Find out what this is.' }
}

module.exports.LEDGER_TX_NAMES = {
  'domain': ['NYM', 'ATTRIB', 'SCHEMA', 'CLAIM_DEF'],
  'pool': ['NODE'],
  'config': ['NODE_UPGRADE', 'POOL_UPGRADE', 'POOL_CONFIG', 'UNKNOWN_FEES_TX']
}

module.exports.TYPE_TO_NAME = {
  '0': 'NODE',
  '1': 'NYM',
  '100': 'ATTRIB',
  '101': 'SCHEMA',
  '102': 'CLAIM_DEF',
  '109': 'POOL_UPGRADE',
  '110': 'NODE_UPGRADE',
  '111': 'POOL_CONFIG',
  '20000': 'UNKNOWN_FEES_TX',
}

module.exports.NAME_TO_TYPE = {
  'NODE': '0',
  'NYM': '1',
  'ATTRIB': '100',
  'SCHEMA': '101',
  'CLAIM_DEF': '102',
  'POOL_UPGRADE': '109',
  'NODE_UPGRADE': '110',
  'POOL_CONFIG': '111',
  'UNKNOWN_FEES_TX': '20000'
}