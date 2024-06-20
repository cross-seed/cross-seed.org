---
id: injection
sidebar_position: 1
title: Direct Client Injection
---

If you use **rTorrent**, **Transmission**, **Deluge**, or **qBittorrent**, `cross-seed`
can inject the torrents it finds directly into your torrent client. This feature is extremely
robust and can be leveraged manually or through automation external to `cross-seed`.

:::tip
If you are having issues with injection errors, and it reverting to save, please [check our FAQ](../basics/faq-troubleshooting.md#failed-to-inject-saving-instead)
:::

:::caution Arr Users

There is a potential problem with duplication of imports using either an Arr On Download/Upgrade, Deluge/qBittorrent on complete execution,
or search/rss/announce trigger, which causes race conditions and bad categorizing/labeling when you use inject with `cross-seed`.

Injecting to **qBittorrent/Deluge** and using an **Arr** can result in new cross-seeds being added with the Arr import
category, causing them to get stuck in your Arr's import queue. The workaround is to enable the `duplicateCategories`
option, which will append your category with `.cross-seed` and **if using qBittorrent** either...

-   use the same **pre/post import categories** in your Arr **OR**
-   your Arr's **pre/post import categories** have the same **save path** in qBittorrent.

:::

:::info
`cross-seed` requires access to the directory where your client's .torrent files are stored.

| Client                              | Torrent/Session Folder          |
| ----------------------------------- | ------------------------------- |
| [qBittorrent](#qbittorrent-setup)   | `BT_Backup`                     |
| [Deluge](#deluge-setup)             | `state`                         |
| [Transmission](#transmission-setup) | `torrents`                      |
| [rTorrent](#rtorrent-setup)         | session dir from `.rtorrent.rc` |

:::

### Manual or Scheduled Injection

Using your [`outputDir`](../basics/options.md#outputdir), in v6 you have the ability to add .torrent files for injection directly. You can either opt to wait for the hourly cadence, or alternatively run the [`cross-seed inject`](../reference/utils.md#cross-seed-inject) command.

Torrent files being injected manually, if using [`flatLinking: false`](../basics/options.md#flatlinking) will require a `[mediatype][tracker]` prefix (where tracker is the name corresponding to that tracker's `linkDir` folder) in order to inject within your existing folder structure.

This is the same format in which `cross-seed` normally saves .torrent files. If you do not specify both of these parameters, `cross-seed` will link the torrents into an `UnknownTracker` directory for you, and will require your intervention to sort them if you wish to do so.

Using this command or utilizing the injection hourly cadence will perform minimal filtering on injection attempts. This means there is the possibility of slightly increased chance of false-positives with .torrent files you add for injection. All torrent files saved by `cross-seed` for retrying have already been filtered for matching.

Torrents that were successfully injected or already existed in client will have their .torrent file removed from the directory being processed if they are complete.

:::tip
To achieve optimal injection behavior, adding the prefix `[mediatype][tracker-name]` as you would normally see it in [`outputDir`](../basics/options.md#outputdir) when saving the torrent file is recommended.

Current "mediatypes" support are `episode`, `pack`, `movie`, `anime`, `audio`, `book`, and `unknown`.
:::

### `rTorrent` setup

`cross-seed` will inject torrents into **rTorrent** with a `cross-seed` label.

1. Edit your config file:
    1. Set your [`action`](../basics/options#action) option to `inject`.
    2. Set your [`rtorrentRpcUrl`](../basics/options#rtorrentrpcurl) option.
       It should look like an `http` url that looks like
       `http://user:pass@localhost:8080/rutorrent/RPC2` (if you have ruTorrent
       installed). See the [reference](../basics/options#rtorrentrpcurl) for
       more details.
2. Start or restart `cross-seed`. The logs at startup will tell you if
   `cross-seed` was able to connect to rTorrent.

:::tip Docker

In order for `cross-seed` to prove to **rTorrent** that a torrent is completed,
it must check the modification timestamps of all the torrent's files.

Make sure that your `cross-seed` container has **read** access to the **data
directories** of your torrents, mapped to the same path as **rTorrent**.

:::

### `qBittorrent` setup

:::info

Injection will work best if you use the `Original` content layout in qBittorrent options.

:::

1. Edit your config file:
    1. Set your [`action`](../basics/options#action) option to `inject`.
    2. Set your [`qbittorrentUrl`](../basics/options#qbittorrenturl) option.
       It should look like an `http` url that looks like
       `http://user:pass@localhost:8080/` See the
       [reference](../basics/options#qbittorrenturl) for more details.
2. Start or restart `cross-seed`. The logs at startup will tell you if
   `cross-seed` was able to connect to qBittorrent.

### `Transmission` setup

1. Edit your config file:
    1. Set your [`action`](../basics/options#action) option to `inject`.
    2. Set your [`transmissionRpcUrl`](../basics/options#rtorrentrpcurl) option.
       It should look like an `http` url that looks like
       `http://user:pass@localhost:9091/transmission/rpc`
2. Start or restart `cross-seed`. The logs at startup will tell you if
   `cross-seed` was able to connect to Transmission.

### `Deluge` setup

1. Edit your config file:
    1. Set your [`action`](../basics/options#action) option to `inject`.
    2. Set your [`delugeRpcUrl`](../basics/options#delugerpcurl) option.
       It should look like an `http` url that looks like
       `http://:pass@localhost:8112/json` (the colon before `pass` is intentional)
2. Start or restart `cross-seed`. The logs at startup will tell you if
   `cross-seed` was able to connect to Deluge.
