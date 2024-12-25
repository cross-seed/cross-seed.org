---
id: options
title: Options
sidebar_position: 3
---

`cross-seed` has several program options, which can either be specified on the
command line or in a configuration file. The priority is shown below.

```
CLI > config file > defaults
```

If you specify an option both on the command line and in the config file, the
command line value will override the config file's value.

## Options on the command line

All options on the command line have a long form, which looks like
`--long-form-option <value>`. Some more common options have a single-letter
short form as well, which look like `-f <value>`.

Some options take multiple arguments, which are always separated by spaces:

```
--variadic-option arg1 arg2 arg3
```

:::tip

Any references to options you see in `camelCase` have their corresponding
long-form option name as the `kebab-cased` variant. For example, the
`excludeRecentSearch` option's long-form CLI option name is
`--exclude-recent-search`.

:::

## Options in the config file

`cross-seed` will look for a configuration file at

- **Mac**/**Linux**/**Unix**: `~/.cross-seed/config.js`
- **Windows**: `AppData\Local\cross-seed\config.js`

:::tip

If you would like to use a custom config directory, you can set the `CONFIG_DIR`
environment variable.

:::

To create an editable config file, run the following command:

```shell script
cross-seed gen-config
```

:::tip

Add `-d` to this command to generate a config for Docker

:::

From there, you can open the config file in your favorite editor and set up your
configuration.

:::tip

The configuration file uses JavaScript syntax, which means:

- Array/multi options must be enclosed in \['brac', 'kets'\].
- Strings must be enclosed in "quotation" marks.
- Array elements and options must be separated by commas.
- **Windows users will need to use `\\` for paths. (e.g. `c:\\torrents`)**

:::

## Options used in `cross-seed search`

| Option                                              | Required     |
| --------------------------------------------------- | ------------ |
| [`delay`](#delay)                                   |              |
| [`torznab`](#torznab)                               | **Required** |
| [`torrentDir`](#torrentdir)                         | **Required** |
| [`outputDir`](#outputdir)                           | **Required** |
| [`dataDirs`](#datadirs)                             |              |
| [`linkCategory`](#linkcategory)                     |              |
| [`duplicateCategories`](#duplicatecategories)       |              |
| [`linkDir`](#linkdir)                               |              |
| [`linkType`](#linktype)                             |              |
| [`matchMode`](#matchmode)                           |              |
| [`skipRecheck`](#skiprecheck)                       |              |
| [`includeSingleEpisodes`](#includesingleepisodes)   |              |
| [`includeNonVideos`](#includenonvideos)             |              |
| [`seasonFromEpisodes`](#seasonfromepisodes)         |              |
| [`autoResumeMaxDownload`](#autoresumemaxdownload)   |              |
| [`fuzzySizeThreshold`](#fuzzysizethreshold)         |              |
| [`excludeOlder`](#excludeolder)                     |              |
| [`excludeRecentSearch`](#excluderecentsearch)       |              |
| [`action`](#action)                                 |              |
| [`duplicateCategories`](#duplicatecategories)       |              |
| [`rtorrentRpcUrl`](#rtorrentrpcurl)                 |              |
| [`delugeRpcUrl`](#delugerpcurl)                     |              |
| [`transmissionRpcUrl`](#rtorrentrpcurl)             |              |
| [`qbittorrentUrl`](#qbittorrenturl)                 |              |
| [`snatchTimeout`](#snatchtimeout)                   |              |
| [`searchTimeout`](#searchtimeout)                   |              |
| [`searchLimit`](#searchlimit)                       |              |
| [`notificationWebhookUrl`](#notificationwebhookurl) |              |
| [`flatLinking`](#flatlinking)                       |              |
| [`blockList`](#blocklist)                           |              |
| [`sonarr`](#sonarr)                                 |              |
| [`radarr`](#radarr)                                 |              |

## Options used in `cross-seed daemon`

| Option                                              | Required     |
| --------------------------------------------------- | ------------ |
| [`delay`](#delay)                                   |              |
| [`torznab`](#torznab)                               | **Required** |
| [`torrentdir`](#torrentdir)                         | **Required** |
| [`outputdir`](#outputdir)                           | **Required** |
| [`dataDirs`](#datadirs)                             |              |
| [`linkCategory`](#linkcategory)                     |              |
| [`duplicateCategories`](#duplicatecategories)       |              |
| [`linkDir`](#linkdir)                               |              |
| [`linkType`](#linktype)                             |              |
| [`matchMode`](#matchmode)                           |              |
| [`skipRecheck`](#skiprecheck)                       |              |
| [`includeEpisodes`](#includeepisodes)               |              |
| [`includeSingleEpisodes`](#includesingleepisodes)   |              |
| [`includeNonVideos`](#includeNonvideos)             |              |
| [`seasonFromEpisodes`](#seasonfromepisodes)         |              |
| [`autoResumeMaxDownload`](#autoresumemaxdownload)   |              |
| [`fuzzySizeThreshold`](#fuzzysizethreshold)         |              |
| [`excludeOlder`](#excludeolder)                     |              |
| [`excludeRecentSearch`](#excluderecentsearch)       |              |
| [`action`](#action)                                 |              |
| [`duplicateCategories`](#duplicatecategories)       |              |
| [`rtorrentRpcUrl`](#rtorrentrpcurl)                 |              |
| [`delugeRpcUrl`](#delugerpcurl)                     |              |
| [`transmissionRpcUrl`](#rtorrentrpcurl)             |              |
| [`qbittorrentUrl`](#qbittorrenturl)                 |              |
| [`notificationWebhookUrl`](#notificationwebhookurl) |              |
| [`host`](#host)                                     |              |
| [`port`](#port)                                     |              |
| [`rssCadence`](#rsscadence)                         |              |
| [`searchCadence`](#searchcadence)                   |              |
| [`snatchTimeout`](#snatchtimeout)                   |              |
| [`searchTimeout`](#searchtimeout)                   |              |
| [`searchLimit`](#searchlimit)                       |              |
| [`apiKey`](#apikey)                                 |              |
| [`flatLinking`](#flatlinking)                       |              |
| [`blockList`](#blocklist)                           |              |
| [`sonarr`](#sonarr)                                 |              |
| [`radarr`](#radarr)                                 |              |

## All options

### `delay`\*

| Config file name | CLI short form | CLI Long form     | Format             | Default |
| ---------------- | -------------- | ----------------- | ------------------ | ------- |
| `delay`          | `-d <value>`   | `--delay <value>` | `number` (seconds) | `30`    |

When running a search with `cross-seed search` or using `searchCadence` in
daemon mode, the `delay` option lets you set how long you want `cross-seed` to
sleep in between searching for each torrent.

If you set it higher, it will smooth out the load on your indexer, however
setting this lower will result in `cross-seed` running faster.

:::warning DISCLAIMER

You need to read your tracker's rules and be aware of their limits.

**You and you alone are responsible for following your tracker's rules.**

:::

#### `delay` Examples (CLI)

```shell
cross-seed search -d 60
cross-seed search --delay 30
```

#### `delay` Examples (Config file)

```js
delay: 30,
```

### `torznab`\*

| Config file name | CLI short form | CLI Long form         | Format     | Default           |
| ---------------- | -------------- | --------------------- | ---------- | ----------------- |
| `torznab`        | `-T <urls...>` | `--torznab <urls...>` | `string[]` | `[]` (empty list) |

List of Torznab URLs. You can use Jackett, Prowlarr, or indexer built-in Torznab
implementations.

This entry **MUST** be wrapped in []'s and strings inside wrapped with quotes
and separated by commas.

:::caution

```
http://localhost:9117/p/a/t/h?query=string
└────────host───────┘└─path─┘└───query───┘
```

The **path** of each URL should end in `/api`.

:::

#### Finding your Torznab URLs

For [Prowlarr](https://github.com/Prowlarr/Prowlarr) and
[Jackett](https://github.com/Jackett/Jackett) you can simply copy the **RSS
URL** from the WebUI.

:::note

This works because in Torznab, "RSS feeds" are just a search for the first page
of unfiltered (no search query) results from the indexer.

:::

#### `torznab` Examples (CLI)

```shell
cross-seed search --torznab https://localhost/prowlarr/1/api?apikey=12345
cross-seed search -T http://prowlarr:9696/1/api?apikey=12345 http://prowlarr:9696/2/api?apikey=12345
cross-seed search -T http://jackett:9117/api/v2.0/indexers/oink/results/torznab/api?apikey=12345
```

#### `torznab` Examples (Config file)

```js
torznab: ["https://localhost/prowlarr/1/api?apikey=12345"],

torznab: [
	"http://prowlarr:9696/1/api?apikey=12345",
    "http://prowlarr:9696/2/api?apikey=12345"
],

torznab: ["http://jackett:9117/api/v2.0/indexers/oink/results/torznab/api?apikey=12345"],
```

### `sonarr`

| Config file name | CLI short form | CLI Long form       | Format     | Default   |
| ---------------- | -------------- | ------------------- | ---------- | --------- |
| `sonarr`         |                | `--sonarr <url(s)>` | `string[]` | undefined |

:::info NOTICE

Read about the functionality in the
[v6 Migration Guide](../v6-migration.md#sonarr-and-radarr-id-lookup-searching)

:::

The URL to your [Sonarr](https://sonarr.tv) instance with your `?apikey=`
parameter appended to the end.

#### Finding your Sonarr URL

For [Sonarr](https://sonarr.tv) you can simply append `?apikey=` to the end of
your WebUI base URL with your API key after the `=`.

#### `sonarr` Examples (CLI)

```shell
cross-seed search --sonarr https://localhost/?apikey=12345
cross-seed search --sonarr https://localhost/?apikey=12345 https://localhost4k/?apikey=12345
```

#### `sonarr` Examples (Config file)

```js
sonarr: ["https://sonarr/?apikey=12345"],

sonarr: ["http://sonarr:8989/?apikey=12345","http://sonarr4k:8990/?apikey=12345"],

```

### `radarr`

| Config file name | CLI short form | CLI Long form       | Format     | Default   |
| ---------------- | -------------- | ------------------- | ---------- | --------- |
| `radarr`         |                | `--radarr <url(s)>` | `string[]` | undefined |

:::warning NOTICE

Read about the functionality in the
[v6 Migration Guide](../v6-migration.md#sonarr-and-radarr-id-lookup-searching)

:::

The URL to your [Radarr](https://radarr.video) instance with your `?apikey=`
parameter appended to the end.

#### Finding your Radarr URL

For [Radarr](https://radarr.video) you can simply append `?apikey=` to the end
of your WebUI base URL with your API key after the `=`.

#### `radarr` Examples (CLI)

```shell
cross-seed search --radarr https://localhost/?apikey=12345
cross-seed search --radarr https://localhost/?apikey=12345 https://localhost4k/?apikey=12345
```

#### `radarr` Examples (Config file)

```js
radarr: ["https://radarr/?apikey=12345"],

radarr: ["http://radarr:7878/?apikey=12345","https://radarr4k:7879/?apikey=12345"],

```

### `torrentDir`\*

| Config file name | CLI short form | CLI long form         | Format   | Default |
| ---------------- | -------------- | --------------------- | -------- | ------- |
| `torrentDir`     | `-i <dir>`     | `--torrent-dir <dir>` | `string` |         |

Point this at a directory containing torrent files. If you don't know where your
torrent client stores its files, the table below might help.

:::tip Data-Only Searching

If you wish to search only your data, we previously recommended pointing this to
an empty directory. You can now set this to `null` if you wish to search only
your `dataDirs`.

:::

:::caution qBittorrent

If you are using qBittorrent 4.6.x, 5.x (or later) and `SQLite database` in
`Preferences -> Advanced` you will need to switch to `fastresume` and restart
qBittorrent for compatibility with `cross-seed`. We have no ETA on SQLite
integration currently.

:::

:::danger Docker

Leave the `torrentDir` as `/torrents` and use Docker to map your directory to
`/torrents`.

:::

| Client           | Linux                                                      | Windows                                                   | Mac                                                   |
| ---------------- | ---------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------- |
| **rTorrent**     | your session directory as configured in .rtorrent.rc       | your session directory as configured in .rtorrent.rc      | your session directory as configured in .rtorrent.rc  |
| **Deluge**       | `/home/<username>/.config/deluge/state`                    | %APPDATA%\deluge\state                                    | current version of Deluge not officially supported    |
| **Transmission** | `/home/<username>/.config/transmission/torrents`           | Unknown (please submit a [PR][pr]!)                       | Unknown (please submit a [PR][pr]!)                   |
| **qBittorrent**  | `/home/<username>/.local/share/data/qBittorrent/BT_backup` | `C:\Users\<username>\AppData\Local\qBittorrent\BT_backup` | `~/Library/Application Support/qBittorrent/BT_backup` |

#### `torrentDir` Examples (CLI)

```shell
cross-seed search --torrent-dir ~/.config/deluge/state
cross-seed search -i ~/.config/transmission/torrents
```

#### `torrentDir` Examples (Config file)

```js
torrentDir: "/home/<username>/.config/deluge/state",

torrentDir: "C:\\torrents",
```

:::info WINDOWS USERS

It is necessary to insert double-slashes for your paths, as seen in the examples
above. Back-slashes are "escape characters" and "\\\\" equates to "\\"

:::

### `outputDir`\*

| Config file name | CLI short form | CLI long form        | Format   | Default |
| ---------------- | -------------- | -------------------- | -------- | ------- |
| `outputDir`      | `-s <dir>`     | `--output-dir <dir>` | `string` |         |

`cross-seed` will store the torrent files it finds in this directory. If you use
[Injection](../tutorials/injection) with rtorrent you'll need to make sure that
the client has access to this path also.

:::caution Docker

Leave the `outputDir` as `/cross-seeds` and use Docker to map your directory to
`/cross-seeds`.

:::

#### `outputDir` Examples (CLI)

```shell
cross-seed search -s .
cross-seed search --output-dir /tmp/output
```

#### `outputDir` Examples (Config file)

```js
outputDir: "/output",

outputDir: "/tmp/output",

outputDir: ".",
```

:::info WINDOWS USERS

It is necessary to insert double-slashes for your paths, as seen in the examples
above. Back-slashes are "escape characters" and "\\\\" equates to "\\"

:::

### `dataDirs`

| Config file name | CLI short form          | CLI long form           | Format      | Default |
| ---------------- | ----------------------- | ----------------------- | ----------- | ------- |
| `dataDirs`       | `--data-dirs <dirs...>` | `--data-dirs <dirs...>` | `string(s)` |         |

`cross-seed` will search the paths provided (separated by spaces). If you use
[Injection](../tutorials/injection) `cross-seed` will use the specified linkType
to create a link to the original file in the linkDir during data-based searches
where it cannot find a associated torrent file.

#### General Usage in v6

Starting in v6.0.0, this option is generally only applicable in two cases:

1. You are downloading through Usenet or other non-torrent methods in order to
   match new content not present in your torrent client.

2. You have content in your media or data directories that is not already
   present in your torrent client. In this scenario, you only need to perform a
   search with `dataDirs` **once**. After the initial search, you should remove
   the directories from `dataDirs` entirely.

:::tip

You cannot include your [`linkDir`](#linkdir) in the `dataDirs` option.

:::

:::caution Docker

You will need to mount the volume for `cross-seed` to have access to the data
and linkDir.

:::

#### `dataDirs` Examples (CLI)

```shell
cross-seed search --data-dirs /data/torrents/completed
```

#### `dataDirs` Examples (Config file)

```js
dataDirs: ["/data/torrents/completed"],

dataDirs: ["/data/torrents/completed", "/media/library/movies"],

dataDirs: ["C:\\My Data\\Downloads\\Movies"],
```

:::info WINDOWS USERS

It is necessary to insert double-slashes for your paths, as seen in the examples
above. Back-slashes are "escape characters" and "\\\\" equates to "\"

:::

### `linkCategory`

| Config file name | CLI short form | CLI long form                | Format   | Default           |
| ---------------- | -------------- | ---------------------------- | -------- | ----------------- |
| `linkCategory`   | N/A            | `--link-category <category>` | `string` | `cross-seed-link` |

`cross-seed` will, when performing **data-based** searches with
[injection](../tutorials/injection), use this category for all injected
torrents.

:::caution Docker

You will need to mount the volume for `cross-seed` to have access to the data
and linkDir.

:::

#### `linkCategory` Examples (CLI)

```shell
cross-seed search --link-category category
```

#### `linkCategory` Examples (Config file)

```js
linkCategory: "Category1",

```

### `duplicateCategories`

| Config file name      | CLI short form | CLI long form            | Format    | Default |
| --------------------- | -------------- | ------------------------ | --------- | ------- |
| `duplicateCategories` | N/A            | `--duplicate-categories` | `boolean` | `false` |

`cross-seed` will inject using the original category, appending '.cross-seed',
with the same save paths as your normal categories. For qBittorrent with linking
enabled, this will be applied as tag instead while keeping
[`linkCategory`](#linkcategory).

:::info

This will prevent an Arr from seeing duplicate torrents in Activity, and
attempting to import cross-seeds.

Example: if you have a category called "Movies", this will automatically inject
cross-seeds to "Movies.cross-seed"

:::

#### `duplicateCategories` Examples (CLI)

```shell
cross-seed search --duplicate-categories
```

#### `duplicateCategories` Examples (Config file)

```js
duplicateCategories: true,

duplicateCategories: false,

```

### `linkDir`

| Config file name | CLI short form     | CLI long form      | Format   | Default |
| ---------------- | ------------------ | ------------------ | -------- | ------- |
| `linkDir`        | `--link-dir <dir>` | `--link-dir <dir>` | `string` |         |

`cross-seed` will link (symlink/hardlink) in the path provided. If you use
[Injection](../tutorials/injection) `cross-seed` will use the specified linkType
to create a link to the original file in the `linkDir` during searches where the
original data is accessible (both torrent and data-based matches).

[**What `linkType` should I use?**](./faq-troubleshooting.md#what-linktype-should-i-use)

:::warning

If you are utilizing [`hardlinks`](../tutorials/linking#hardlink) with Docker,
it is necessary that you to use a single mount/volume for both the `linkDir` and
the data in your client and/or `dataDirs` from which you're linking . Using
`hardlinks` across two volumes/mounts in Docker will error and fail.

All paths need to be accessible in the same structure as your torrent client for
injection to succeed.

:::

:::tip

[If you are using `dataDirs` (click for v6 use-cases)](../v6-migration.md#data-based-matching-use-cases),
your `linkDir` can not reside _INSIDE_ of your included [`dataDirs`](#datadirs)
folders. This is to prevent recursive and erroneous searches of folders used in
linking folder structure.

:::

:::caution Docker

You will need to mount the volume for `cross-seed` to have access to the dataDir
and linkDir.

:::

#### `linkDir` Examples (CLI)

```shell
cross-seed search --linkDir /data/torrents/xseeds
```

#### `linkDir` Examples (Config file)

```js
linkDir: "/path/to/your/linkDir",

linkDir: "C:\\cross-seed-links",

```

:::info WINDOWS USERS

It is necessary to insert double-slashes for your paths, as seen in the examples
above. Back-slashes are "escape characters" and "\\\\" equates to "\\"

:::

### `linkType`

| Config file name | CLI short form       | CLI long form        | Format   | Default |
| ---------------- | -------------------- | -------------------- | -------- | ------- |
| `linkType`       | `--link-type <type>` | `--link-type <type>` | `string` |         |

`cross-seed` will link (symlink/hardlink) in the method provided. If you use
[Injection](../tutorials/injection) `cross-seed` will use the specified linkType
to create a link to the original file in the linkDir during data-based searchs
where it cannot find a associated torrent file.

Valid methods for linkType are `symlink` and `hardlink`.

[**What `linkType` should I use?**](./faq-troubleshooting.md#what-linktype-should-i-use)

:::danger PATH ADVISORY

If you are utilizing [`hardlinks`](../tutorials/linking#hardlink) with Docker,
it is necessary that you to use a single mount/volume for both the `linkDir` and
the data in your client and/or `dataDirs` from which you're linking . Using
`hardlinks` across two volumes/mounts in Docker will error and fail.

All paths need to be accessible in the same structure as your torrent client for
injection to succeed.

:::

#### `linkType` Examples (CLI)

```shell
cross-seed search --linkType hardlink
```

#### `linkType` Examples (Config file)

```js
linkType: "hardlink",

linkType: "symlink",

```

### `matchMode`

| Config file name | CLI short form        | CLI long form         | Format                    | Default |
| ---------------- | --------------------- | --------------------- | ------------------------- | ------- |
| `matchMode`      | `--match-mode <mode>` | `--match-mode <mode>` | `safe`/`risky`/`partial*` | `safe`  |

`cross-seed` uses three types of matching algorithms `safe`, `risky`, and
`partial`. All types are extremely safe and will have no false positives.
`partial` will roughly double the number of found cross seeds,
effectively finding all possible cross seeds.

:::note

These algorithms can only be ran if `cross-seed` has snatched the
torrent files. The vast majority of candidates get rejected before a snatch has
happened by parsing information from the title.

:::

| option    | description                                                          |
| --------- | -------------------------------------------------------------------- |
| `safe`    | the default which matches based on file naming and sizes.            |
| `risky`   | matches based on file sizes only.                                    |
| `partial` | can be read about in detail [here](../tutorials/partial-matching.md) |

For media library searches `risky` or `partial` is necessary due to the renaming
of files.

#### `matchMode` Examples (CLI)

```shell
cross-seed search --match-mode risky
cross-seed search --match-mode safe
```

#### `matchMode` Examples (Config file)

```js
matchMode: "risky",

matchMode: "safe",
```

### `skipRecheck`

| Config file name | CLI short form | CLI long form    | Format    | Default |
| ---------------- | -------------- | ---------------- | --------- | ------- |
| `skipRecheck`    | `N/A`          | `--skip-recheck` | `boolean` | `true`  |

Set this to `false` to recheck all torrents upon injection. Set this to `true`
to only recheck necessary injections such those from [`partial`](#matchmode).

:::tip

Torrents will be resumed even with `skipRecheck: false`, if applicable.

:::

#### `skipRecheck` Examples (CLI)

```shell
cross-seed search # will skip rechecking
cross-seed search --no-skip-recheck # will not skip rechecking
```

#### `skipRecheck` Examples (Config file)

```js
skipRecheck: true,

skipRecheck: false,
```

### `includeSingleEpisodes`

| Config file name        | CLI short form | CLI long form               | Format    | Default |
| ----------------------- | -------------- | --------------------------- | --------- | ------- |
| `includeSingleEpisodes` | `N/A`          | `--include-single-episodes` | `boolean` | `false` |

:::warning NOTICE

Behavior of this option has changed in v6, please see the
[migration guide](../v6-migration.md#updated-includesingleepisodes-behavior) for
details on the implementation's changes'.

:::

Set this to `true` to include **ALL SINGLE** episodes when searching (which are
ignored by default).

:::info

This will **NOT** include episodes present inside season packs (data-based
searches).

:::

:::tip

This option has explicit usage examples given in the
[config templates](https://github.com/cross-seed/cross-seed/blob/master/src/config.template.cjs#L261-L275)
which outlines the most common scenarios.

:::

#### `includeSingleEpisodes` Examples (CLI)

```shell
cross-seed search --include-single-episodes # will include single episodes not from season pack
cross-seed search # will not include episodes
```

#### `includeSingleEpisodes` Examples (Config file)

```js
includeSingleEpisodes: true,

includeSingleEpisodes: false,
```

### `seasonFromEpisodes`

| Config file name     | CLI short form | CLI long form            | Format                         | Default |
| -------------------- | -------------- | ------------------------ | ------------------------------ | ------- |
| `seasonFromEpisodes` | `N/A`          | `--season-from-episodes` | `number` (decimal from 0 to 1) | `null`  |

`cross-seed` will also aggregate individual episodes into season packs for
searching (when applicable) or to match with season packs from rss/announce.
This will only match season packs where you have at least the specified ratio of
episodes. `null` disables this feature. If enabled, values below 1 requires
matchMode [partial](#matchmode).

:::tip

This feature works best with matchMode [partial](#matchmode) and
[Sonarr](#sonarr). You can avoid downloading the same missing episodes on
multiple trackers by following
[these steps](./faq-troubleshooting.md#my-partial-matches-from-related-searches-are-missing-the-same-data-how-can-i-only-download-it-once).

:::

#### `seasonFromEpisodes` Examples (CLI)

```shell
cross-seed search --season-from-episodes 0.8 # will also combine episodes into season packs if you have at least 80%
cross-seed search --no-season-from-episodes # will not attempt to join episodes to season packs
```

#### `seasonFromEpisodes` Examples (Config file)

```js
seasonFromEpisodes: 0.8, // requires 80% of the episodes to cross-seed a season pack

seasonFromEpisodes: null, // will disable season pack from episodes
```

### `autoResumeMaxDownload`

| Config file name        | CLI short form | CLI long form                | Format                   | Default             |
| ----------------------- | -------------- | ---------------------------- | ------------------------ | ------------------- |
| `autoResumeMaxDownload` | `N/A`          | `--auto-resume-max-download` | `number` (0 to 52428800) | `52428800` (50 MiB) |

The amount remaining for an injected torrent in bytes for `cross-seed` to
resume. For torrents with a larger amount remaining, you will need to manually
resume as you can avoid downloading the same missing data on multiple trackers
by following
[these steps](./faq-troubleshooting.md#my-partial-matches-from-related-searches-are-missing-the-same-data-how-can-i-only-download-it-once).

#### `autoResumeMaxDownload` Examples (CLI)

```shell
cross-seed search --auto-resume-max-download 0 # only resume complete matches
```

#### `autoResumeMaxDownload` Examples (Config file)

```js
autoResumeMaxDownload: 52428800,

autoResumeMaxDownload: 0,
```

### `includeNonVideos`

| Config file name   | CLI short form | CLI long form          | Format    | Default |
| ------------------ | -------------- | ---------------------- | --------- | ------- |
| `includeNonVideos` | N/A            | `--include-non-videos` | `boolean` | `false` |

:::warning NOTICE

Behavior of this option has changed in v6, please see the
[migration guide](../v6-migration.md#updated-includenonvideos-behavior) for
details on the implementation's changes.

:::

Set this to `true` to include torrents that contain a majority of files other
than video files (`.mp4`, `.avi`, `.mkv`) in the search.

#### `includeNonVideos` Examples (CLI)

```shell
cross-seed search --include-non-videos # will include non-videos
cross-seed search --no-include-non-videos # will not include non-videos
cross-seed search # will not include non-videos
```

#### `includeNonVideos` Examples (Config file)

```js
includeNonVideos: true,

includeNonVideos: false,
```

### `fuzzySizeThreshold`

| Config file name     | CLI short form | CLI long form                    | Format                           | Default |
| -------------------- | -------------- | -------------------------------- | -------------------------------- | ------- |
| `fuzzySizeThreshold` | N/A            | `--fuzzy-size-threshold <value>` | `number` (decimal from 0 to 0.1) | `0.02`  |

Increase this number to reject fewer torrents based on size. There is no
guarantee that it will increase your match rate.

:::caution

This option has very limited utility and under normal operation does not need to
be modified.

:::

#### `fuzzySizeThreshold` Examples (CLI)

```shell
cross-seed search --fuzzy-size-threshold 0.02
cross-seed daemon --fuzzy-size-threshold 0.02
```

#### `fuzzySizeThreshold` Examples (Config file)

```js
fuzzySizeThreshold: 0.02,
```

### `excludeOlder`

| Config file name | CLI short form | CLI long form             | Format                          | Default |
| ---------------- | -------------- | ------------------------- | ------------------------------- | ------- |
| `excludeOlder`   | `-x <value>`   | `--exclude-older <value>` | `string` in the [ms][ms] format |         |

When running a search, this option excludes anything first searched more than
this long ago. This option is only relevant in `search` mode or in `daemon` mode
with [`searchCadence`](#searchcadence) turned on.

:::tip

`excludeOlder` will never exclude torrents that are completely new to
`cross-seed` or torrents seen via RSS or Announce API.

:::

#### `excludeOlder` Examples (CLI)

```shell
cross-seed search -x 10h # only search for torrents whose first search was less than 10 hours ago or never
cross-seed search --exclude-older "3 days" # only search for torrents whose first search was less than 3 days ago or never
cross-seed search -x 0s # only search for each torrent once ever
```

#### `excludeOlder` Examples (Config file)

```js
excludeOlder: "10 hours",

excludeOlder: "3days",

excludeOlder: "0s",
```

### `excludeRecentSearch`

| Config file name      | CLI short form | CLI long form                     | Format                          | Default |
| --------------------- | -------------- | --------------------------------- | ------------------------------- | ------- |
| `excludeRecentSearch` | `-r <value>`   | `--exclude-recent-search <value>` | `string` in the [ms][ms] format |         |

When running a search, this option excludes anything that has been searched more
recently than this long ago. This option is only relevant in `search` mode or in
`daemon` mode with [`searchCadence`](#searchcadence) turned on.

:::tip

`excludeRecentSearch` will never exclude torrents seen via RSS or Announce API.

:::

:::info Note

**Search history is stored on a per-indexer basis.**

Searches that failed on specific indexers (for example - due to timeout or
rate-limiting) will not be marked as having been searched, and thus will not be
excluded by this setting for those specific indexers on the next run.

:::

#### `excludeRecentSearch` Examples (CLI)

```shell
cross-seed search -r 1day # only search for torrents that haven't been searched in the past day
cross-seed search --exclude-recent-search "2 weeks" # only search for torrents that haven't been searched in the past 2 weeks
```

#### `excludeRecentSearch` Examples (Config file)

```js
excludeRecentSearch: "1 day",

excludeRecentSearch: "2 weeks",
```

### `action`\*

| Config file name | CLI short form     | CLI long form            | Format          | Default |
| ---------------- | ------------------ | ------------------------ | --------------- | ------- |
| `action`         | `-A <save/inject>` | `--action <save/inject>` | `save`/`inject` | `save`  |

`cross-seed` can either save the found cross-seeds, or inject them into your
client. If you use `inject`, you will need to set up your client. Read more in
the [Injection tutorial](../tutorials/injection).

#### `action` Examples (CLI)

```shell
cross-seed search -A inject
cross-seed search --action save
```

#### `action` Examples (Config file)

```js
action: "save",

action: "inject",
```

### `rtorrentRpcUrl`

| Config file name | CLI short form | CLI long form              | Format | Default |
| ---------------- | -------------- | -------------------------- | ------ | ------- |
| `rtorrentRpcUrl` | N/A            | `--rtorrent-rpc-url <url>` | URL    |         |

The url of your **rTorrent** XMLRPC interface. Only relevant with
[Injection](../tutorials/injection). Often ends in `/RPC2`.

:::info

If you use **Sonarr** or **Radarr**, `cross-seed` is configured the same way.
**ruTorrent** installations come with this endpoint configured, but naked
**rTorrent** does not provide this wrapper. If you don't use **ruTorrent**,
you'll have to
[set up the endpoint yourself](https://github.com/linuxserver/docker-rutorrent/issues/122#issuecomment-769009432)
with a webserver.

:::

:::tip

If you use HTTP Digest Auth on this endpoint (recommended), then you can provide
credentials in the following format:
`http://username:password@localhost/rutorrent/RPC2`

:::

#### `rtorrentRpcUrl` Examples (CLI)

```shell
cross-seed search --rtorrent-rpc-url http://rutorrent/rutorrent/RPC2
cross-seed search --rtorrent-rpc-url http://user:pass@localhost:8080/RPC2
```

#### `rtorrentRpcUrl` Examples (Config file)

```js
rtorrentRpcUrl: "http://rutorrent/rutorrent/RPC2",

rtorrentRpcUrl: "http://user:pass@localhost:8080/RPC2",
```

### `qbittorrentUrl`

| Config file name | CLI short form | CLI long form             | Format | Default |
| ---------------- | -------------- | ------------------------- | ------ | ------- |
| `qbittorrentUrl` | N/A            | `--qbittorrent-url <url>` | URL    |         |

The url of your **qBittorrent** Web UI. Only relevant with
[Injection](../tutorials/injection).

:::tip

**qBittorrent** doesn't use HTTP Basic/Digest Auth, but you can provide your
**qBittorrent** credentials at the beginning of the URL like so:
`http://username:password@localhost:8080/`

:::

#### `qbittorrentUrl` Examples (CLI)

```shell
cross-seed search --qbittorrent-url http://qbittorrent:8080/qbittorrent
cross-seed search --qbittorrent-url http://user:pass@localhost:8080
```

#### `qbittorrentUrl` Examples (Config file)

```js
qbittorrentUrl: "http://qbittorrent:8080/qbittorrent",

qbittorrentUrl: "http://user:pass@localhost:8080",
```

### `transmissionRpcUrl`

| Config file name     | CLI short form | CLI long form                  | Format | Default |
| -------------------- | -------------- | ------------------------------ | ------ | ------- |
| `transmissionRpcUrl` | N/A            | `--transmission-rpc-url <url>` | URL    |         |

The url of your **Transmission** RPC Interface. Only relevant with
[Injection](../tutorials/injection).

:::tip

**Transmission** doesn't use HTTP Basic/Digest Auth, but you can provide your
**Transmission** credentials at the beginning of the URL like so:
`http://username:password@localhost:9091/transmission/rpc`

:::

#### `transmissionRpcUrl` Examples (CLI)

```shell
cross-seed search --transmission-rpc-url http://transmission:8080/transmission/rpc
cross-seed search --transmission-rpc-url http://user:pass@localhost:8080
```

#### `transmissionRpcUrl` Examples (Config file)

```js
transmissionRpcUrl: "http://transmission:8080/transmission/rpc",

transmissionRpcUrl: "http://username:password@localhost:9091/transmission/rpc",
```

### `delugeRpcUrl`

| Config file name | CLI short form | CLI long form            | Format | Default |
| ---------------- | -------------- | ------------------------ | ------ | ------- |
| `delugeRpcUrl`   | N/A            | `--deluge-rpc-url <url>` | URL    |         |

The url of your **Deluge** JSON-RPC Interface. Only relevant with
[Injection](../tutorials/injection).

:::tip

**Deluge** doesn't use HTTP Basic/Digest Auth, but you can provide your
**Deluge** password at the beginning of the URL like so:
`http://:password@localhost:8112/json`

:::

#### `delugeRpcUrl` Examples (CLI)

```shell
cross-seed search --deluge-rpc-url http://deluge:8112/json
cross-seed search --deluge-rpc-url http://:pass@localhost:8112/json
```

#### `delugeRpcUrl` Examples (Config file)

```js
delugeRpcUrl: "http://deluge:8112/json",

delugeRpcUrl: "http://:pass@localhost:8112/json",
```

### `notificationWebhookUrl`

| Config file name         | CLI short form | CLI long form                      | Format | Default |
| ------------------------ | -------------- | ---------------------------------- | ------ | ------- |
| `notificationWebhookUrl` | N/A            | `--notification-webhook-url <url>` | URL    |         |

`cross-seed` will send a POST request to this URL with the following payload:

```json
POST notificationWebhookUrl
Content-Type: application/json

{
  "title": "string",
  "body": "string",
  "extra": {
    "event": "RESULTS",
    "name": "string",
    "infoHashes": "string[]",
    "trackers": "string[]",
    "source": "announce | inject | rss | search | webhook",
    "result": "SAVED | INJECTED | FAILURE"
  }
}
```

Currently, `cross-seed` only sends the "RESULTS" and "TEST" events. In the
future it may send more. This payload supports both
[**apprise**](https://github.com/caronc/apprise-api) and
[**Notifiarr**](https://github.com/Notifiarr/Notifiarr).

#### `notificationWebhookUrl` Examples (CLI)

```shell
cross-seed daemon --notification-webhook-url http://apprise:8000/notify
```

#### `notificationWebhookUrl` Examples (Config file)

```js
notificationWebhookUrl: "http://apprise:8000/notify",
```

### `host`

| Config file name | CLI short form | CLI long form   | Format    | Default   |
| ---------------- | -------------- | --------------- | --------- | --------- |
| `host`           | N/A            | `--host <host>` | `host/ip` | `0.0.0.0` |

In [Daemon Mode](../basics/managing-the-daemon), `cross-seed` runs a webserver
listening for a few types of HTTP requests. You can use this option to change
the host to bind to and listen on.

:::tip DOCKER

If you are using Docker, you do not need to set this. Leave the option as
`undefined`.

:::

#### `host` Examples (CLI)

```shell
cross-seed daemon --host 192.168.1.100
```

#### `host` Examples (Config file)

```js
host: "1.3.3.7",
```

### `port`\*

| Config file name | CLI short form | CLI long form   | Format   | Default |
| ---------------- | -------------- | --------------- | -------- | ------- |
| `port`           | `-p <port>`    | `--port <port>` | `number` | `2468`  |

In [Daemon Mode](../basics/managing-the-daemon), `cross-seed` runs a webserver
listening for a few types of HTTP requests. You can use this option to change
the port it listens on.

#### `port` Examples (CLI)

```shell
cross-seed daemon --port 3000
cross-seed daemon -p 3000
```

#### `port` Examples (Config file)

```js
port: 3000,
```

### `rssCadence`

| Config file name | CLI short form | CLI long form             | Format                          | Default |
| ---------------- | -------------- | ------------------------- | ------------------------------- | ------- |
| `rssCadence`     | N/A            | `--rss-cadence <cadence>` | `string` in the [ms][ms] format |         |

In [Daemon Mode](../basics/managing-the-daemon), with this option enabled,
`cross-seed` will run periodic RSS searches on your configured indexers to check
if any new uploads match torrents you already own. Setting this option to
`null`, or not specifying it at all, will disable the feature.

:::tip

There is a minimum cadence of `10 minutes`. We recommend keeping it at a
relatively low number (10-30 mins) because if an indexer has a high frequency of
new uploads, keeping the number low will make sure `cross-seed` gets a chance to
see each new upload.

:::

#### `rssCadence` Examples (CLI)

```shell
cross-seed daemon --rss-cadence 10min
```

#### `rssCadence` Examples (Config file)

```js
rssCadence: null, // disable the RSS feature

rssCadence: "10 minutes",

rssCadence: "20min",
```

### `searchCadence`

| Config file name | CLI short form | CLI long form                | Format                          | Default |
| ---------------- | -------------- | ---------------------------- | ------------------------------- | ------- |
| `searchCadence`  |                | `--search-cadence <cadence>` | `string` in the [ms][ms] format |         |

In [Daemon Mode](../basics/managing-the-daemon), with this option enabled,
`cross-seed` will run periodic searches of your torrents (respecting your
`includeEpisodes`, `includeNonVideos`, `excludeOlder`, and `excludeRecentSearch`
settings).

#### `searchCadence` Examples (CLI)

```shell
cross-seed daemon --search-cadence "2 weeks"
cross-seed daemon --search-cadence "2w"

```

#### `searchCadence` Examples (Config file)

```js
searchCadence: null, // disable the periodic search feature

searchCadence: "2w",

searchCadence: "4 weeks",
```

[pr]:
	https://github.com/cross-seed/cross-seed.org/tree/master/docs/basics/options.md
[ms]: https://github.com/vercel/ms#examples

### `apiKey`

| Config file name | CLI short form | CLI long form     | Format   | Default     |
| ---------------- | -------------- | ----------------- | -------- | ----------- |
| `apiKey`         |                | `--api-key <key>` | `string` | `undefined` |

:::info

[`apiKey`](../basics/options.md#apikey) is disabled in the config file by
default, if you want to specify a key set it to a valid key (24 character min).

:::

To find your generated API key, run the `cross-seed api-key` command. The API
key can be included with your requests in either of two ways:

```shell
# provide api key as a query param
curl -XPOST localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode ...
# provide api key as an HTTP header
curl -XPOST localhost:2468/api/webhook -H "X-Api-Key: YOUR_API_KEY" --data-urlencode ...
```

#### `apiKey` Examples (CLI)

```shell
cross-seed daemon --api-key <key> # will require auth on requests
```

#### `apiKey` Examples (Config file)

```js
apiKey: undefined,
apiKey: "abcdefghijklmn0pqrstuvwxyz",
```

### `snatchTimeout`

| Config file name | CLI short form | CLI long form                | Format                          | Default      |
| ---------------- | -------------- | ---------------------------- | ------------------------------- | ------------ |
| `snatchTimeout`  |                | `--snatch-timeout <timeout>` | `string` in the [ms][ms] format | `30 seconds` |

This option applies to any snatch (download) of a .torrent file via Torznab. If
a response is not given in the amount of time specified then it will consider
the snatch as failed.

#### `snatchTimeout` Examples (CLI)

```shell
cross-seed daemon --snatch-timeout "15s"
cross-seed search --snatch-timeout "30s"

```

#### `snatchTimeout` Examples (Config file)

```js
snatchTimeout: undefined, // disable the snatch timeout (http default)

snatchTimeout: "30s",

snatchTimeout: "15s",
```

[pr]:
	https://github.com/cross-seed/cross-seed.org/tree/master/docs/basics/options.md
[ms]: https://github.com/vercel/ms#examples

### `searchTimeout`

| Config file name | CLI short form | CLI long form                | Format                          | Default     |
| ---------------- | -------------- | ---------------------------- | ------------------------------- | ----------- |
| `searchTimeout`  |                | `--search-timeout <timeout>` | `string` in the [ms][ms] format | `2 minutes` |

This option applies to any search via Torznab. If the search response is not
given in the amount of time specified then it will consider the search failed.

#### `searchTimeout` Examples (CLI)

```shell
cross-seed daemon --search-timeout "20s"
cross-seed search --search-timeout "45s"

```

#### `searchTimeout` Examples (Config file)

```js
searchTimeout: undefined, // disables searchTimeout (http default)

searchTimeout: "60s",

searchTimeout: "20s",
```

[pr]:
	https://github.com/cross-seed/cross-seed.org/tree/master/docs/basics/options.md
[ms]: https://github.com/vercel/ms#examples

### `searchLimit`

| Config file name | CLI short form | CLI long form             | Format   | Default     |
| ---------------- | -------------- | ------------------------- | -------- | ----------- |
| `searchLimit`    |                | `--search-limit <number>` | `number` | `undefined` |

This option applies to any search Torznab. This option will stop searching after
the number of searches meets the number specified.

:::info

This will apply to searching in daemon mode (periodic/cadence or when given a
path which contains many files) or directly with the search command.

:::

#### `searchLimit` Examples (CLI)

```shell
cross-seed daemon --search-limit 50
cross-seed search --search-limit 150

```

#### `searchLimit` Examples (Config file)

```js
searchLimit: undefined, // disable search count limits

searchLimit: 150,
```

### `flatLinking`

| Config file name | CLI short form | CLI long form    | Format    | Default |
| ---------------- | -------------- | ---------------- | --------- | ------- |
| `flatLinking`    | N/A            | `--flat-linking` | `boolean` | `false` |

:::caution Be Advised

qBittorrent users using an external program or script, such as qbit_manage, to
force AutoTMM on torrents (e.g. to apply share limits automatically) will need
to enable `flatLinking` or modify your workflow accordingly.

[**Read more about specific usage**](v6-migration.md#qbittorrent)

:::

Set this to `true` to use the flat-folder style linking previously used in v5.
This option will otherwise link any matches to a tracker-specific folder inside
of `linkDir` (if set). This prevents cross seeds from conflicting with each
other.

With `flatLinking: false` (default):

```
linkDir/
	TrackerA/
		Video.mkv
		Video2/
			Video2.mkv
	TrackerB/
		Pack/
			Pack.1.mkv
			Pack.2.mkv
		Video.mkv
```

With `flatLinking: true`:

```
linkDir/
	Video.mkv   <--- Both TrackerA and TrackerB cross seeds share the same file
	Video2/
		Video2.mkv
	Pack/
		Pack.1.mkv
		Pack.2.mkv
```

#### `flatLinking` Examples (CLI)

```shell
cross-seed search --flat-linking
```

#### `flatLinking` Examples (Config file)

```js
flatLinking: true,

flatLinking: false,
```

### `blockList`

| Config file name | CLI short form | CLI long form            | Format      | Default |
| ---------------- | -------------- | ------------------------ | ----------- | ------- |
| `blockList`      | N/A            | `--block-list <strings>` | `string(s)` |         |

:::tip

Use the blocklist on categories, tags, or trackers on torrents you do not want to cross seed
from your torrent client. This will be necessary if they are on a separate drive.

:::

`cross-seed` will exclude any of the files/releases from cross-seeding during
the prefiltering done for each search/inject/rss/announce/webhook use. The full
list of supported prefixes are:

- `name:` A substring of the name inside the .torrent file or parsed name from path if data based.
- `nameRegex:` Similar to name but uses your own custom regex.
- `folder:` A substring of any parent folder in the path. Only applies to [`dataDirs`](#datadirs) searchees, not [`torrentDir`](#torrentdir).
- `folderRegex:` Similar to folder but uses your own custom regex on the entire parent path.
- `category:` Deluge labels are considered categories. `"category:"` blocklists torrents without a category.
- `tag:` Transmission and rTorrent labels are considered tags. `"tag:"` blocklists torrents without a tag.
- `tracker:` If the announce url (from client/.torrent) is `https://user:pass@tracker.example.com:8080/announce/key` you must use host `tracker.example.com:8080`.
- `infoHash:` Blocklist the torrent that matches this infohash (case-insensitive).
- `sizeBelow:` Blocklist searchees with a size in bytes below this number.
- `sizeAbove:` Blocklist searchees with a size in bytes above this number.

:::danger

The regex (ECMAScript flavor) options are for advanced users only. Do not use
without rigorous testing as `cross-seed` is unable to perform any checks. Use at
your own risk.

:::

#### `blockList` Examples (Config file)

```js
blockList: [
	"name:Release.Name",
	"name:-excludedGroup",
	"name:x265",
	"nameRegex:[Rr]elease[.\s][Nn]ame",
	"folder:folderName",
	"folderRegex:folder\d+",
	"category:icycool",
	"category:",
	"tag:everybody",
	"tag:",
	"tracker:tracker.example.com:8080",
	"infoHash:3317e6485454354751555555366a8308c1e92093",
	"sizeBelow:12345",
	"sizeAbove:98765",
],
```
