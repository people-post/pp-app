(function (ext) {
function buf2str(buf) { return new TextDecoder().decode(buf); }

async function cat(cid, options, helia, fLog, abortFlag) {
    const parts = [];
    let length = 0, offset = 0;

    for await (const buf of helia.cat(cid, options)) {
        parts.push(buf);
        length += buf.length;
        if (abortFlag[0]) {
            fLog('Cancel reading from ipfs');
            break;
        }
    }

    const value = new Uint8Array(length)
    for (const buf of parts) {
        value.set(buf, offset)
        offset += buf.length
    }

    fLog(`Received data for file '${cid}' size: ${value.length} in ${parts.length} blocks`);
    return value
}

async function getFile(helia, rootHash, filename, options, fLog, abortFlag) {
    fLog(`Fetching hash for '${rootHash}/${filename}'`)
    const path = `${rootHash}/${filename}`
    try {
        return await cat(path, options, helia, fLog, abortFlag);
    } catch (ex) {
        throw new Error(`File not found: ${rootHash}/${filename}`);
    }
}

class HlsIpfsLoader {
    #helia;
    #fLog;
    #m3u8Provider = null;
    #tsListProvider = null;
    #abortFlags = [false];

    constructor(config) {
        this.#helia = config.ipfs
        this.hash = config.ipfsHash
        if (config.m3u8provider) {
            this.#m3u8Provider = config.m3u8provider;
        }
        if (config.tsListProvider) {
            this.#tsListProvider = config.tsListProvider;
        }

        if (config.debug === false) {
            this.#fLog = function () { }
        } else if (config.debug === true) {
            this.#fLog = console.log
        } else {
            this.#fLog = config.debug
        }
    }

    // Call this by getting the HlsIpfsLoader instance from hls.js hls.coreComponents[0].loaders.manifest.setM3U8Provider()
    setM3U8Provider(provider) { this.#m3u8Provider = provider; }
    setTsListProvider(provider) { this.#tsListProvider = provider; }

    abort() { this.#abortFlags[0] = true; }
    destroy() {}

    load(context, config, callbacks) {
        this.context = context
        this.config = config
        this.callbacks = callbacks
        this.stats = { trequest: performance.now(), retry: 0 }
        this.retryDelay = config.retryDelay
        this.loadInternal()
    }

    loadInternal() {
        const { stats, context, callbacks } = this

        stats.tfirst = Math.max(performance.now(), stats.trequest)
        stats.loaded = 0

        //When using absolute path (https://example.com/index.html) vs https://example.com/
        const urlParts = window.location.href.split("/");
        if (urlParts[urlParts.length - 1] !== "") {
            urlParts[urlParts.length - 1] = "";
        }
        const filename = context.url.replace(urlParts.join("/"), "");

        const options = {};
        if (Number.isFinite(context.rangeStart)) {
            options.offset = context.rangeStart;
            if (Number.isFinite(context.rangeEnd)) {
                options.length = context.rangeEnd - context.rangeStart;
            }
        }

        if (filename.split(".")[1] === "m3u8" && this.#m3u8Provider !== null) {
            const res = this.#m3u8Provider();
            let data;
            if (Buffer.isBuffer(res)) {
                data = buf2str(res);
            } else {
                data = res;
            }
            const response = { url: context.url, data: data }
            callbacks.onSuccess(response, stats, context)
            return;
        }
        if (filename.split(".")[1] === "m3u8" && this.#tsListProvider !== null) {
            var tslist = this.#tsListProvider();
            var hash = tslist[filename];
            if (hash) {
                this.cat(hash).then(res => {
                    let data;
                    if (Buffer.isBuffer(res)) {
                        data = buf2str(res);
                    } else {
                        data = res;
                    }
                    stats.loaded = stats.total = data.length;
                    stats.tload = Math.max(stats.tfirst, performance.now());
                    const response = { url: context.url, data: data };
                    callbacks.onSuccess(response, stats, context);
                });
            }
            return;
        }
        this.#abortFlags[0] = false;
        getFile(this.#helia, this.hash, filename, options, this.#fLog, this.#abortFlags).then(res => {
            const data = (context.responseType === 'arraybuffer') ? res : buf2str(res)
            stats.loaded = stats.total = data.length
            stats.tload = Math.max(stats.tfirst, performance.now())
            const response = { url: context.url, data: data }
            callbacks.onSuccess(response, stats, context)
        }, console.error)
    }
};

/*
Usage example:
    const testhash = "QmdpAidwAsBGptFB3b6A9Pyi5coEbgjHrL3K2Qrsutmj9K";
    Hls.DefaultConfig.loader = HlsIpfsLoader;
    Hls.DefaultConfig.debug = false;
    if (Hls.isSupported()) {
      const video = document.getElementById('video');
      const hls = new Hls();
      hls.config.ipfs = node;
      hls.config.ipfsHash = testhash;
      hls.loadSource('master.m3u8');
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    }
*/
ext.HlsIpfsLoader = HlsIpfsLoader;
}(window.ext = window.ext || {}));