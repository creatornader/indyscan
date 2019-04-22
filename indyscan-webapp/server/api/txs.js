const createHistogram = require('../../services/timeseries')
const url = require('url')
const { buildFilterByTxNames } = require('indyscan-storage')

function initTxsApi (router, ledgerStorageManager) {
  router.get('/txs', async (req, res) => {
    const parts = url.parse(req.url, true)
    console.log(`GET /txs, query=${JSON.stringify(parts.query)}`)
    const fromRecentTx = parseInt(parts.query.fromRecentTx)
    const toRecentTx = parseInt(parts.query.toRecentTx)
    const network = parts.query.network
    const ledger = parts.query.ledger
    const filterTxNames = (parts.query.filterTxNames) ? JSON.parse(parts.query.filterTxNames) : []

    if (!(fromRecentTx >= 0 && toRecentTx >= 0 && toRecentTx - fromRecentTx < 150 && toRecentTx - fromRecentTx > 0)) {
      console.log(`Query string failed validation checks.`)
      res.status(400).send({ message: 'i don\'t like your query string' })
      return
    }
    const txFilter = buildFilterByTxNames(filterTxNames)
    const limit = toRecentTx - fromRecentTx
    const txs = await ledgerStorageManager.getLedger(network, ledger).getTxRange(fromRecentTx, limit, txFilter)
    res.status(200).send({ txs })
  })

  router.get('/txs/:seqNo', async (req, res) => {
    console.log(`API GET ${req.url}`)
    const parts = url.parse(req.url, true)
    const seqNo = parseInt(req.params.seqNo)
    const network = parts.query.network

    const ledger = parts.query.ledger
    const tx = await ledgerStorageManager.getLedger(network, ledger).getTxBySeqNo(seqNo)
    console.log(JSON.stringify(tx))
    res.status(200).send(tx)
  })

  const oneDayInMiliseconds = 1000 * 60 * 60 * 24

  router.get('/txs/stats/series', async (req, res) => {
    console.log(`API GET  ${req.url}`)
    const parts = url.parse(req.url, true)
    const network = parts.query.network
    const ledger = parts.query.ledger
    const timestamps = await ledgerStorageManager.getLedger(network, ledger).getAllTimestamps()
    const histogram = await createHistogram(timestamps, oneDayInMiliseconds)
    res.status(200).send({ histogram })
  })

  router.get('/txs/stats/count', async (req, res) => {
    console.log(`API GET ${req.url}`)
    const parts = url.parse(req.url, true)
    const network = parts.query.network
    const ledger = parts.query.ledger
    const filterTxNames = (parts.query.filterTxNames) ? JSON.parse(parts.query.filterTxNames) : []
    const txFilter = buildFilterByTxNames(filterTxNames)
    const txCount = await ledgerStorageManager.getLedger(network, ledger).getTxCount(txFilter)
    res.status(200).send({ txCount })
  })

  return router
}

module.exports = initTxsApi
