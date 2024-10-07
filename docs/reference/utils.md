The `cross-seed` app has several subcommand utilities. Some of these can help
you debug your system, or help you find more information to file a bug report.

### `cross-seed gen-config`

Generate an empty config file in its proper location.

#### Options

| short form | long form  | note                                                                                                         |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `-d`       | `--docker` | Specifying this flag will configure `outputDir` and `torrentDir` to `/output` and `/torrents`, respectively. |

#### Usage

```shell
cross-seed gen-config
cross-seed gen-config -d
```

### `cross-seed clear-cache`

:::danger
Do not use unless instructed to, this rarely necessary. Seek support if you believe it's necessary.
:::

Clear the cache without causing torrents to be re-snatched and reset the timestamps for [`excludeOlder`](../basics/options.md#excludeolder) and [`excludeRecentSearch`](../basics/options.md#excluderecentsearch).

### `cross-seed test-notification`

Send a notification to the specified URL.

#### Usage

```shell
cross-seed test-notification <url>
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
This should be used sparingly, and never repeatedly (back-to-back) in a short period, to clear failures that are otherwise latent/expired or erroneous in Prowlarr/Jackett due to indexers being down.
:::

#### Usage

```shell
cross-seed clear-indexer-failures
```

### `cross-seed inject`

Injects previously saved, or manually added, torrents from [`outputDir`](../basics/options.md#outputdir).

By default this command will use [`outputDir`](../basics/options.md#outputdir), however, you can also specify
an `inject dir` by providing the argument.

[Read More...](../tutorials/injection.md#manual-or-scheduled-injection)

#### Usage

```shell
cross-seed inject
cross-seed inject --inject-dir /path/to/dir
```

### `cross-seed rss`

Runs a manual RSS scan (like [`rssCadence`](../basics/options.md#rsscadence)) and performs your specified [`action`](../basics/options.md#action) on the trackers in your [`torznab`](../basics/options.md#torznab) option.

[Read about automating this with "daemon" mode...](../basics/daemon.md#set-up-rss)

#### Usage

```shell
cross-seed rss
```
