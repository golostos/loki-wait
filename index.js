class LokiWait {
  /** @type {{id: string, status: string}[]} */
  #lokiRequests = []
  /** @type {import('node:worker_threads').MessageChannel | null} */
  #messageChannel = null
  /**
   * @param {{id: string, status: string}} request 
   */
  addLokiRequest(request) {
    const existingRequest = this.requests.find(r => r.id === request.id)
    if (existingRequest) existingRequest.status = request.status
    else this.#lokiRequests.push(request);
  }
  get requests() {
    return this.#lokiRequests;
  }
  /**
   * @param {import('node:worker_threads').MessageChannel} messageChannel 
   */
  registerMessageChannel(messageChannel) {
    this.#messageChannel = messageChannel
  }
  get channel() {
    return this.#messageChannel
  }
  awaitRequests() {
    return new Promise((resolve, reject) => {
      let interval;
      const stopFunction = () => {
        const timeout = setTimeout(() => {
          process.exit()
        }, 1000);
        this.channel.port2.close()
        this.channel.port2.on('close', () => {
          clearTimeout(timeout)
        })
        clearInterval(interval);
        resolve();
      }
      interval = setInterval(() => {
        if (this.requests.length) {
          if (this.requests.every(request => request.status.startsWith('FINISHED'))) {
            stopFunction()
          } else if (this.requests.some(request => request.status.startsWith('ERROR'))
            && !this.requests.some(request => request.status.startsWith('STARTING'))) {
            this.requests
              .filter(request => request.status.startsWith('ERROR'))
              .forEach(request => console.error(request.status))
            stopFunction()
          }
        } else {
          stopFunction()
        }
      }, 5)      
    })
  }
}

module.exports = LokiWait