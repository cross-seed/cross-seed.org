---
id: injection
sidebar_position: 1
title: Direct Client Injection
---

If you use **rTorrent**, **Transmission**, **Deluge**, or **qBittorrent**, `cross-seed`
can inject the torrents it finds directly into your torrent client. This satisfies most
simple use cases. For more complex cases, [**autotorrent2**](https://github.com/JohnDoee/autotorrent2)
or [**qbit_manage**](https://github.com/StuffAnThings/qbit_manage) is recommended.

### `rTorrent` setup

`cross-seed` will inject torrents into **rTorrent** with a `cross-seed` label.

1. Make sure **rTorrent** has access to your `outputDir` (if Docker, make sure
   they're mapped to the same path).
2. Edit your config file:
   1. Set your [`action`](../basics/options#action) option to `inject`.
   2. Set your [`rtorrentRpcUrl`](../basics/options#rtorrentrpcurl) option.
      It should look like an `http` url that looks like
      `http://user:pass@localhost:8080/rutorrent/RPC2` (if you have ruTorrent
      installed). See the [reference](../basics/options#rtorrentrpcurl) for
      more details.
3. Start or restart `cross-seed`. The logs at startup will tell you if
   `cross-seed` was able to connect to rTorrent.

:::tip Docker

In order for `cross-seed` to prove to **rTorrent** that a torrent is completed,
it must check the modification timestamps of all the torrent's files.

Make sure that your `cross-seed` container has **read** access to the **data
directories** of your torrents, mapped to the same path as **rTorrent**.

:::

### `qBittorrent` setup

:::caution

Injection will work best if you use the `Original` content layout.

:::

2. Edit your config file:
   1. Set your [`action`](../basics/options#action) option to `inject`.
   2. Set your [`qbittorrentUrl`](../basics/options#qbittorrenturl) option.
      It should look like an `http` url that looks like
      `http://user:pass@localhost:8080/qbittorrent` See the
      [reference](../basics/options#qbittorrenturl) for more details.

:::caution Arr Users

There is a potential problem with duplication of imports using an Arr On Download/Upgrad, Qbit Download
Complete, or search/rss/announce race conditions to trigger cross-seed if you use inject with `cross-seed`,
**qBittorrent**, and an **Arr** where new cross-seeds will be added with the Arr category, and then get stuck
in Sonarr's import queue. The workaround is to enable the `duplicateCategories` option which will
append your category with `.cross-seed` and:

- you don't use separate **pre/post import categories** in your Arr OR
- your Arr's **pre/post import categories** have the same **save path** in
  qBittorrent.

:::

### `Transmission` setup

1. Edit your config file:
   1. Set your [`action`](../basics/options#action) option to `inject`.
   2. Set your [`transmissionRpcUrl`](../basics/options#rtorrentrpcurl) option.
      It should look like an `http` url that looks like
      `http://user:pass@localhost:9091/transmission/rpc`
2. Start or restart `cross-seed`. The logs at startup will tell you if
   `cross-seed` was able to connect to Transmission.

### `Deluge` setup

:::caution

Deluge is a work in progress at the moment, but is available for now on the `deluge` branch

:::

1. Edit your config file:
   1. Set your [`action`](../basics/options#action) option to `inject`.
   2. Set your [`delugenRpcUrl`](../basics/options#delugerpcurl) option.
      It should look like an `http` url that looks like
      `http://:pass@localhost:8112/json`
2. Start or restart `cross-seed`. The logs at startup will tell you if
   `cross-seed` was able to connect to Deluge.
