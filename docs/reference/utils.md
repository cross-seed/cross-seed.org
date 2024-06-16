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

Clear the cache of previous decisions.

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
