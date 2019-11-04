const crossSpawn = require('cross-spawn')

module.exports.spawnSync = function (cmd, params, opts, onFail) {
  console.log(`[sync] Running "${cmd} ${params.join(' ')}"\n`)

  const runner = crossSpawn.sync(
    cmd,
    params,
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', ...opts }
  )

  if (runner.status || runner.error) {
    console.log()
    console.error(`⚠️  Command "${cmd}" failed with exit code: ${runner.status}`)
    if (runner.status === null) {
      console.error(`⚠️  Please globally install "${cmd}"`)
    }
    onFail && onFail()
  }
}
