---
id: injection
sidebar_position: 1
title: Direct Client Injection
---

If you use **rTorrent**, **Transmission**, **Deluge**, or **qBittorrent**,
`cross-seed` can inject the torrents it finds directly into your torrent client.
This feature is extremely robust and can be leveraged manually or through
automation external to `cross-seed`.

## Setting up your client

::::tip

[**What should I do after updating my config?**](../basics/faq-troubleshooting.md#what-should-i-do-after-updating-my-config)

:::danger Permissions

`cross-seed` must share the same
[user and group](../basics/getting-started.mdx#with-docker) permissions as the
torrent clients to prevent errors.

:::

:::caution Arr Users

You need to configure [`linking`](./linking.md) or use
[`duplicateCategories: true`](../basics/options.md#duplicatecategories) if you
are using qBittorrent or Deluge. This will prevent injected cross seeds from
being added to your Arr's import queue.

:::

::::

1. Edit your config file:
    1. Set your [`action`](../basics/options#action) option to `inject`.
    2. Set your [`torrentClients`](../basics/options#torrentclients) option.
        - If desired, add `readonly:` after the client prefix to only source
          cross seeds from that client without injecting.
2. Start or restart `cross-seed` and confirm all clients was successfully
   connected.

:::tip Docker

In order for `cross-seed` to prove to **rTorrent** that a torrent is completed,
it must check the modification timestamps of all the torrent's files.

Make sure that your `cross-seed` container has **read** access to the **data
directories** of your torrents, mapped to the same path as **rTorrent**.

:::

## Manual or Scheduled Injection

::::warning

`cross-seed` is the **only** program that understands how to properly link and
inject its [partial](./partial-matching.md) and
[seasonFromEpisodes](../basics/options.md#seasonfromepisodes) matches. Other
programs, like [**autotorrent**](https://github.com/JohnDoee/autotorrent), will
not work. You do not need to do anything with torrents saved to
`outputDir`—`cross-seed` will handle them unless the torrent is stalled.

:::danger

**DO NOT USE [`outputDir`](../basics/options.md#outputdir) AS A WATCH FOLDER FOR
YOUR TORRENT CLIENT!**

:::

::::

In v6, `cross-seed` has the ability to add .torrent files for injection
directly. You can either opt to wait for the hourly cadence, or alternatively
run the [`cross-seed inject`](../reference/utils.md#cross-seed-inject) command
to attempt injection for .torrent files in your
[`outputDir`](../basics/options.md#outputdir). You can alternatively use
`cross-seed inject --inject-dir /path/to/folder` to specify another directory.

:::tip

If you have configured [webhook on completion](./triggering-searches.md),
`cross-seed` will automatically trigger an early run of the inject job to retry
any saved torrents faster.

:::

For torrent files being injected manually, if using
[`flatLinking: false`](../basics/options.md#flatlinking) will require a
`[mediatype][tracker]` prefix (where tracker is the name corresponding to that
tracker's `linkDir` folder) in order to inject within your existing folder
structure.

::::tip To achieve optimal injection behavior, adding the prefix
`[mediatype][tracker-name]` as you would normally see it in
[`outputDir`](../basics/options.md#outputdir) when saving the torrent file is
recommended (e.g. `[movie][ProwlarrName]abc.torrent`).

:::info

Current "mediatypes" support are `episode`, `pack`, `movie`, `anime`, `video`,
`audio`, `book`, and `unknown`.

:::

Even though the mediatype is required to be valid, it is not currently used
during the injection process. This means that if you have lots of torrents files
to inject, you can just use `[unknown][tracker-name]` as a prefix for all of
them.

::::

This is the same format in which `cross-seed` normally saves .torrent files. If
you do not specify both of these parameters, `cross-seed` will link the torrents
into the `UnknownTracker` directory for you, and will require your intervention
to sort them if you wish to do so.

Using this command or utilizing the injection hourly cadence will perform
minimal filtering on injection attempts. This means there is the possibility of
slightly increased chance of false-positives with .torrent files you add for
injection. All torrent files saved by `cross-seed` for retrying have already
been filtered for matching.

If the .torrent files follow the naming format above, they will be elligible for
cleanup if they fall into one of these categories:

- The torrent is in client and complete (successful injection or already exists)
- The torrent has no matches (source torrent/data was likely removed)
- The torrent matches your blocklist

Stalled torrents (either the cross seeded torrent or it's source) will require
your intervention before `cross-seed` will remove the .torrent file. You will
need to remove these torrents from your client and the .torrent file from
outputDir. If you wish to keep them in client, only remove their .torrent file
from outputDir.

In some cases, `cross-seed` may refuse to inject torrents if their titles are
too different to prevent false positives. To override this, you can use
[`cross-seed inject --ignore-titles`](../reference/utils.md#cross-seed-inject).
Without this flag, the .torrent files that are rejected for this reason will not
be deleted. You will need to remove them manually or use the command with the
flag to inject them.

:::tip You can find more information about this feature in the
[`v6 migration guide`](../v6-migration.md#failed-injection-saved-retry). :::
