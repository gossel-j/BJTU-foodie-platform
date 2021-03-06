"use strict"
if (require.main === module) {
  if (process.env.NODE_ENV === undefined) {
    process.env.NODE_ENV = "development"
  }

  let loader = require("./server")

  loader().then(function(server) {
    server.start(function () {
      server.log("info", `Server running at: ${server.info.uri}`)
    })

    function onSignals() {
      server.log("info", "Received signal, waiting for last connections...")
      if (process.env.NODE_ENV != "production") return process.exit(0)
      server.stop(function() {
        process.exit(0)
      })
    }

    process.once("SIGTERM", onSignals)
    process.once("SIGINT", onSignals)
  }).catch(function(err) {
    console.error(err.stack)
    process.exit(1)
  })
}
