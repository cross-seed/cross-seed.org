---
id: utils
title: Utility commands
sidebar_position: 0
---

The `cross-seed` app has several subcommand utilities. Some of these can help
you debug your system, or help you find more information to file a bug report.

### `cross-seed gen-config`

Generate an empty config file in its proper location.

#### Usage

```shell
cross-seed gen-config
```

### `cross-seed clear-cache`

:::danger

Do not use unless instructed to, this rarely necessary. Please seek support if
you believe it's needed.

:::

Clear the cache without causing torrents to be re-snatched and reset the
timestamps for [`excludeOlder`](../basics/options.md#excludeolder) and
[`excludeRecentSearch`](../basics/options.md#excluderecentsearch).

#### Usage

```shell
cross-seed clear-cache
```

### `cross-seed update-torrent-cache-trackers`

Update the announce urls for torrents in the torrent cache.
This is useful if your passkey has changed or the tracker urls have changed.

#### Usage

```shell
cross-seed update-torrent-cache-trackers "https://tracker1.example.com/announce/123" "https://tracker2.example.com/announce/abc"
cross-seed update-torrent-cache-trackers "example.com:1234" "example.org"
cross-seed update-torrent-cache-trackers "oldpasskey" "newpasskey"
```

### `cross-seed restore`

Use snatched torrents from the torrent_cache to attempt to restore cross seeds.
You will need to run `cross-seed inject` afterwards with dataDirs configured.

This can be helpful if you have lost your torrent client session information but
still have the downloaded data.

#### Usage

```shell
cross-seed restore
```

### `cross-seed test-notification`

Send a notification to the configured urls

[**Read more**](../basics/options.md#notificationwebhookurls)

#### Usage

```shell
cross-seed test-notification
```

### `cross-seed diff`

See if and why two torrents pass the matching algorithm.

#### Usage

```shell
cross-seed diff <owned torrent> <candidate torrent>
```

### `cross-seed tree`

Check a torrent's file tree from `cross-seed`'s perspective.

#### Usage

```shell
cross-seed tree file.torrent
```

### `cross-seed api-key`

Show the api key.

#### Usage

```shell
cross-seed api-key
```

### `cross-seed reset-api-key`

Reset the api key.

#### Usage

```shell
cross-seed reset-api-key
```

### `cross-seed clear-indexer-failures`

Clears all indexer failures from the database

:::caution

This should be used sparingly, and never repeatedly (back-to-back) in a short
period, to clear failures that are otherwise latent/expired or erroneous in
Prowlarr/Jackett due to indexers being down.

:::

#### Usage

```shell
cross-seed clear-indexer-failures
```

### `cross-seed inject`

Injects previously saved, or manually added, torrents from
[`outputDir`](../basics/options.md#outputdir).

By default this command will use [`outputDir`](../basics/options.md#outputdir),
however, you can also specify an `inject dir` by providing the argument.

[Read More...](../tutorials/injection.md#manual-or-scheduled-injection)

#### Usage

```shell
cross-seed inject
cross-seed inject --inject-dir /path/to/dir
```

### `cross-seed rss`

:::danger

Do not run this command while the [daemon](../basics/managing-the-daemon.mdx)
is running. This will create errors with the sqlite database. If you want to
trigger a rss scan, use the [`job api`](../basics/faq-troubleshooting.md#is-there-a-way-to-trigger-a-specific-cross-seed-job-ahead-of-schedule)
instead.

:::

Runs a manual RSS scan (like [`rssCadence`](../basics/options.md#rsscadence))
and performs your specified [`action`](../basics/options.md#action) on the
trackers in your [`torznab`](../basics/options.md#torznab) option.

[Read about automating this with "daemon" mode...](../basics/getting-started.mdx)

#### Usage

```shell
cross-seed rss
```

### `cross-seed search`

:::danger

Do not run this command while the [daemon](../basics/managing-the-daemon.mdx)
is running. This will create errors with the sqlite database. If you want to
trigger a search, use the
[`job api`](../basics/faq-troubleshooting.md#how-can-i-disable-the-time-based-exclude-options-in-a-cross-seed-search)
instead. This supports overriding the time based exclusions as well.

:::

Runs a manual search (like
[`searchCadence`](../basics/options.md#searchcadence)) and performs your
specified [`action`](../basics/options.md#action) on the trackers in your
[`torznab`](../basics/options.md#torznab) option.

You can optionally override the
[time based exclusions](../v6-migration.md#stricter-configjs-validation) in your
config for this search only.

[Read about automating this with "daemon" mode...](../basics/getting-started.mdx)

#### Usage

```shell
cross-seed search
cross-seed search --no-exclude-recent-search --no-exclude-older
```
