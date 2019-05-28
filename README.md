# Indyscan
##### Hyperledger Indy Version Tracker

--------

Scan transactions on Hyperledger Indy blockchain to post new DID Records to Version Repo Service

Inputs:
- Array of DIDs to be tracked

Outputs:
- DID Document Versions are periodically posted to Version Repo Service for all the DIDs being tracked

# How it works
The daemon is periodically looking for new transactions. When a new transaction is found, it's
stored in MongoDB. If that transaction involves a DID Document update for one of the DIDs being tracked, 
the daemon queries MongoDB to retrieve and assemble the DID Document at that time and send a POST to 
Version Repo Service.

The list of DIDs being tracked can be updated in two ways:
- Passed in as input parameter at runtime
- Added via an API

# Which networks
The scanner can be easily configured to run against any arbitrary Indy pool. As long as valid Indy pool 
genesis files are supplied, it should work!

# How to run
1. Build images locally
`./build-all.sh`.
2. Find names of your pools
`ls -l ~/.indy_client/pool`
You may already see some pools there, and the command will print
```
drwxr-xr-x  4 prague  staff  128 Feb 13 14:55 PRIVATE_POOL_127.0.0.1
drwxr-xr-x  4 prague  staff  128 Feb 13 22:06 SOVRIN_MAINNET
drwxr-xr-x  4 prague  staff  128 Feb 13 21:54 SOVRIN_TESTNET
```
3. Specify names of pools you want to scan (pool names separated by commas) 
`INDY_NETWORKS="SOVRIN_MAINNET,SOVRIN_TESTNET" docker-compose up`.
4. Watch as the Version Repo Service fills up with new DID Docs

# Scanning
By default, the scanner fetches new transactions every 0.5sec. If none are available, it waits for a few seconds or minutes. 

