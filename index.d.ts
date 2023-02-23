/// <reference types="node" />
export = LokiWait;
declare class LokiWait {
    /**
     * @param {{id: string, status: string}} request
     */
    addLokiRequest(request: {
        id: string;
        status: string;
    }): void;
    get requests(): {
        id: string;
        status: string;
    }[];
    /**
     * @param {import('node:worker_threads').MessageChannel} messageChannel
     */
    registerMessageChannel(messageChannel: import('node:worker_threads').MessageChannel): void;
    get channel(): import("worker_threads").MessageChannel;
    awaitRequests(): Promise<any>;
    #private;
}
