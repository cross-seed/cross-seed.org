---
 id: getting-started
 title: Getting Started
 sidebar_position: 0
 ---

## Introduction

Cross-seeding is the practice of downloading a torrent from one tracker and
using that data to seed across other trackers. This results in minimal downloads
and instant seeding, making it a great way to build ratio and contribute to the
community.

:::info

This software is designed primarily for **private trackers**. If you plan on
cross-seeding on public trackers,
[please see our FAQ](./faq-troubleshooting.md#does-cross-seed-work-on-public-trackers)
for more details.

:::

---

## Setting Up the Daemon

The most efficient way to use `cross-seed` is to run it in **daemon mode**,
which continuously monitors for new downloads and cross-seeds them
automatically. Here’s how to get everything up and running.

### 1. Install `cross-seed`

You can install `cross-seed` using one of the following methods:

#### With `npm` (recommended if you're not using Docker)

You’ll need **Node.js 20** or greater.

```shell
npm install -g cross-seed
cross-seed --version
```

#### With Docker

```shell
docker run ghcr.io/cross-seed/cross-seed --version
```

#### With Unraid
For Unraid installation, see the [Unraid guide](../tutorials/unraid.md).

---

### 2. Create a Config File

You’ll need to generate a configuration file before running the daemon. Both
Docker and non-Docker users will use the same method for this.

#### For non-Docker users:

Run the following command to generate a config file:

```shell
cross-seed gen-config
```

This will create a basic `config.js` file at `~/.cross-seed/config.js` or
`AppData\Local\cross-seed\config.js`. You can then edit this file to add the
necessary configurations.

#### For Docker users:

Docker users can generate the config file by running the following command:

```shell
docker run \
-v /path/to/config:/config \
ghcr.io/cross-seed/cross-seed gen-config
```

This will create a `config.js` file inside the `/config` directory you
specified. You’ll need to open this file and edit it as described below.

---

### 3. Edit the Config File

Once you’ve created your config file, you’ll need to fill in the necessary
fields to connect to your torrent client and indexer. At a minimum, you should
configure the following:

-   **`torznab`**: URLs of your Torznab indexers (from Prowlarr or Jackett).
-   **`torrentDir`**: The directory where your .torrent files are located (from
    your torrent client).
-   **`outputDir`**: Create a new directory somewhere to house the torrent files `cross-seed` outputs.
-   **Connection to your torrent client**: Depending on your client, you'll need
    to specify one of the following:
    -   `rtorrentRpcUrl`: For rTorrent users. Often looks like `http://user:pass@localhost:8080/RPC2`
    -   `qbittorrentUrl`: For qBittorrent users. Often looks like `http://user:pass@localhost:8080`
    -   `transmissionRpcUrl`: For Transmission users. Often looks like `http://user:pass@localhost:9091/transmission/rpc`
    -   `delugeRpcUrl`: For Deluge users. Often looks like `http://:pass@localhost:8112/json` (the colon before pass is intentional)

Here’s an example of what your `config.js` might look like:

```js
module.exports = {
	torznab: ["http://localhost:9696/1/api?apikey=123456"],
	torrentDir: "/path/to/torrent_dir",
    outputDir: "/path/to/output_dir",
	qbittorrentUrl: "http://username:password@localhost:8080",
	... several other settings you can read later ...
};
```

For more details on configuring the connection to your torrent client, refer to
the [reference guide on torrent client configuration](../tutorials/injection.md).

---

### 4. Run the Daemon

Once you’ve set up your configuration, you’re ready to run the daemon. Start the
daemon with this command:

```shell
cross-seed daemon
```

Or, if you are using Docker, make sure to expose the paths cross-seed needs to
access:

```shell
docker run \
-v /path/to/config:/config \
-v /path/to/torrent_dir:/path/to/torrent_dir \
-v /path/to/output:/path/to/output \
ghcr.io/cross-seed/cross-seed daemon
```

After a few moments, you should see `cross-seed` automatically starting to
search for things in your catalog. It will also automatically scan your
trackers' RSS feeds for new releases you can cross-seed.

For now, you can leave the terminal open to keep the daemon running. If any
configuration issues arise, `cross-seed` will provide feedback in the terminal,
which helps guide you through fixing them.

---

## Next Steps

Once you have the daemon up and running, here are a few additional features you
might want to explore:

-   **Managing the daemon** with Docker or systemd for long-term use.
-   **Notifying cross-seed of completed downloads** to search for new things
    more quickly.
-   **Setting up partial matches** to increase your seed size even more (at the
    cost of downloading a few extra NFO files).

For more information on these topics, check out the [Daemon Mode](./daemon.md)
guide.
