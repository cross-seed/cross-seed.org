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

For instructions on creating and editing the config file, use the
[getting started guide](./getting-started.mdx#2-create-a-config-file).

:::tip

[**What should I do after updating my config?**](#what-should-i-do-after-updating-my-config)

:::

## Options used in `cross-seed search`

| Option                                                | Required     |
| ----------------------------------------------------- | ------------ |
| [`delay`](#delay)                                     |              |
| [`torznab`](#torznab)                                 | **Required** |
| [`outputDir`](#outputdir)                             |              |
| [`useClientTorrents`](#useclienttorrents)             |              |
| [`torrentDir`](#torrentdir)                           |              |
| [`dataDirs`](#datadirs)                               |              |
| [`maxDataDepth`](#maxdatadepth)                       |              |
| [`linkCategory`](#linkcategory)                       |              |
| [`duplicateCategories`](#duplicatecategories)         |              |
| [`linkDirs`](#linkdirs)                               |              |
| [`linkType`](#linktype)                               |              |
| [`matchMode`](#matchmode)                             |              |
| [`skipRecheck`](#skiprecheck)                         |              |
| [`includeSingleEpisodes`](#includesingleepisodes)     |              |
| [`includeNonVideos`](#includenonvideos)               |              |
| [`seasonFromEpisodes`](#seasonfromepisodes)           |              |
| [`autoResumeMaxDownload`](#autoresumemaxdownload)     |              |
| [`fuzzySizeThreshold`](#fuzzysizethreshold)           |              |
| [`excludeOlder`](#excludeolder)                       |              |
| [`excludeRecentSearch`](#excluderecentsearch)         |              |
| [`action`](#action)                                   |              |
| [`duplicateCategories`](#duplicatecategories)         |              |
| [`rtorrentRpcUrl`](#rtorrentrpcurl)                   |              |
| [`delugeRpcUrl`](#delugerpcurl)                       |              |
| [`transmissionRpcUrl`](#rtorrentrpcurl)               |              |
| [`qbittorrentUrl`](#qbittorrenturl)                   |              |
| [`snatchTimeout`](#snatchtimeout)                     |              |
| [`searchTimeout`](#searchtimeout)                     |              |
| [`searchLimit`](#searchlimit)                         |              |
| [`notificationWebhookUrls`](#notificationwebhookurls) |              |
| [`flatLinking`](#flatlinking)                         |              |
| [`blockList`](#blocklist)                             |              |
| [`sonarr`](#sonarr)                                   |              |
| [`radarr`](#radarr)                                   |              |

## Options used in `cross-seed daemon`

| Option                                                | Required     |
| ----------------------------------------------------- | ------------ |
| [`delay`](#delay)                                     |              |
| [`torznab`](#torznab)                                 | **Required** |
| [`outputdir`](#outputdir)                             |              |
| [`useClientTorrents`](#useclienttorrents)             |              |
| [`torrentDir`](#torrentdir)                           |              |
| [`dataDirs`](#datadirs)                               |              |
| [`maxDataDepth`](#maxdatadepth)                       |              |
| [`linkCategory`](#linkcategory)                       |              |
| [`duplicateCategories`](#duplicatecategories)         |              |
| [`linkDirs`](#linkdirs)                               |              |
| [`linkType`](#linktype)                               |              |
| [`matchMode`](#matchmode)                             |              |
| [`skipRecheck`](#skiprecheck)                         |              |
| [`includeSingleEpisodes`](#includesingleepisodes)     |              |
| [`includeNonVideos`](#includenonvideos)               |              |
| [`seasonFromEpisodes`](#seasonfromepisodes)           |              |
| [`autoResumeMaxDownload`](#autoresumemaxdownload)     |              |
| [`fuzzySizeThreshold`](#fuzzysizethreshold)           |              |
| [`excludeOlder`](#excludeolder)                       |              |
| [`excludeRecentSearch`](#excluderecentsearch)         |              |
| [`action`](#action)                                   |              |
| [`duplicateCategories`](#duplicatecategories)         |              |
| [`rtorrentRpcUrl`](#rtorrentrpcurl)                   |              |
| [`delugeRpcUrl`](#delugerpcurl)                       |              |
| [`transmissionRpcUrl`](#rtorrentrpcurl)               |              |
| [`qbittorrentUrl`](#qbittorrenturl)                   |              |
| [`notificationWebhookUrls`](#notificationwebhookurls) |              |
| [`host`](#host)                                       |              |
| [`port`](#port)                                       |              |
| [`rssCadence`](#rsscadence)                           |              |
| [`searchCadence`](#searchcadence)                     |              |
| [`snatchTimeout`](#snatchtimeout)                     |              |
| [`searchTimeout`](#searchtimeout)                     |              |
| [`searchLimit`](#searchlimit)                         |              |
| [`apiKey`](#apikey)                                   |              |
| [`flatLinking`](#flatlinking)                         |              |
| [`blockList`](#blocklist)                             |              |
| [`sonarr`](#sonarr)                                   |              |
| [`radarr`](#radarr)                                   |              |

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
[v6 Migration Guide](../v6-migration.md#searching-by-media-ids)

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
[v6 Migration Guide](../v6-migration.md#searching-by-media-ids)

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

### `useClientTorrents`

| Config file name    | CLI short form | CLI Long form           | Format    | Default |
| ------------------- | -------------- | ----------------------- | --------- | ------- |
| `useClientTorrents` | N/A            | `--use-client-torrents` | `boolean` | `true`  |

:::warning

Deluge does not currently support useClientTorrents, use [`torrentDir`](#torrentdir) instead.

:::

Query the torrent client APIs to find matches against its contents. This is a replacement
for torrentDir and is generally recommended. This method supports qBittorrent's `SQLite` mode.

#### `useClientTorrents` Examples (CLI)

```shell
cross-seed search --use-client-torrents
cross-seed search --no-use-client-torrents
```

#### `useClientTorrents` Examples (Config file)

```js
useClientTorrents: true,
```

### `torrentDir`

| Config file name | CLI short form | CLI long form         | Format   | Default |
| ---------------- | -------------- | --------------------- | -------- | ------- |
| `torrentDir`     | `-i <dir>`     | `--torrent-dir <dir>` | `string` |         |

:::danger qBittorrent

You **MUST** use [`useClientTorrents`](#useclienttorrents) instead if any apply:
- You are using `SQLite` in `Preferences -> Advanced`
- You have renamed torrents or its files in client
- You have torrents added _WITHOUT_ `Content Layout` set to `Original`

:::

Point this at a directory containing torrent files, **or if you're using a
torrent client integration and injection** - your torrent client's `.torrent`
file store/cache.

:::caution What directory is supported

More details on why using paths other than the .torrent store from the client's
config/appdata directory (ex: 'state' or 'BT_backup') is not supported and
discouraged
[can be found here.](./faq-troubleshooting.md#what-is-could-not-ensure-all-torrents-from-the-torrent-client-are-in-torrentdir)

:::

If you don't know where your torrent client stores its files, **please use the
table below to find the client's store of .torrent files**. This folder can then
either be mounted as something like `/torrents` (with read only (`:ro`)
permissions) as a "shorthanded" path if you're using Docker or used outright as
your `torrentDir`.

:::tip Data-Only Searching

If you wish to search only your data, we previously recommended pointing this to
an empty directory. You can now set this to `null` if you wish to search only
your `dataDirs`.

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

[**It is necessary to insert double-slashes for your paths, back-slashes are "escape characters" and "\\\\" equates to "\\".**](./faq-troubleshooting.md#windows-paths)

:::

### `outputDir`

| Config file name | CLI short form | CLI long form        | Format   | Default |
| ---------------- | -------------- | -------------------- | -------- | ------- |
| `outputDir`      | `-s <dir>`     | `--output-dir <dir>` | `string` | `null`  |

:::danger

**DO NOT USE THIS DIRECTORY AS A WATCH FOLDER FOR YOUR TORRENT CLIENT!**

Keep this set to `outputDir: null` for the best experience with `cross-seed`.
This will map outputDir into your `cross-seed` [config directory](./faq-troubleshooting.md#what-is-configdb-torrent_cache-and-cross-seeds-in-the-config-directory)

:::

With [`action: "inject"`](#action), `cross-seed` will use this directory to
retry injections only, it will be empty nearly all the time. With
[`action: "save"`](#action), `cross-seed` will store the .torrent files it
finds in this directory. Only change this from `null` if you are using
`action: "save"` and the path would be more convenient.

#### `outputDir` Examples (CLI)

```shell
cross-seed search
cross-seed search --output-dir /path/to/folder
```

#### `outputDir` Examples (Config file)

```js
outputDir: null,

outputDir: "/path/to/folder",
```

:::info WINDOWS USERS

[**It is necessary to insert double-slashes for your paths, back-slashes are "escape characters" and "\\\\" equates to "\\".**](./faq-troubleshooting.md#windows-paths)

:::

### `dataDirs`

| Config file name | CLI short form          | CLI long form           | Format      | Default |
| ---------------- | ----------------------- | ----------------------- | ----------- | ------- |
| `dataDirs`       | `--data-dirs <dirs...>` | `--data-dirs <dirs...>` | `string(s)` |         |

:::tip

[**Usages and Configuration**](../tutorials/data-based-matching.md)

:::

`cross-seed` will search the paths provided (separated by spaces). If you use
[Injection](../tutorials/injection) `cross-seed` will use the specified linkType
to create a link to the original file in the linkDirs.

:::warning

You cannot include your [`linkDirs`](#linkdirs) in the `dataDirs` option.

:::

:::caution Docker

You will need to mount the volume for `cross-seed` to have access to the data
and linkDirs.

:::

#### `dataDirs` Examples (CLI)

```shell
cross-seed search --data-dirs /data/usenet/movies
```

#### `dataDirs` Examples (Config file)

```js
dataDirs: ["/data/usenet/movies"],

dataDirs: ["/data/usenet/movies", "/data/torrents/tv"],

dataDirs: ["C:\\My Data\\Downloads\\Movies"],
```

:::info WINDOWS USERS

[**It is necessary to insert double-slashes for your paths, back-slashes are "escape characters" and "\\\\" equates to "\\".**](./faq-troubleshooting.md#windows-paths)

:::

### `maxDataDepth`

| Config file name | CLI short form | CLI long form              | Format   | Default |
| ---------------- | -------------- | -------------------------- | -------- | ------- |
| `maxDataDepth`   | N/A            | `--max-data-depth <value>` | `number` | `2`     |

:::tip

[**What value should I set my `maxDataDepth` to?**](../tutorials/data-based-matching.md#setting-up-data-based-matching)

:::

Determines how deep into the specified [`dataDirs`](#datadirs) `cross-seed` will
go to generate searchees. Setting this to higher values will result in more
searchees and more API hits to your indexers.

#### `maxDataDepth` Examples (CLI)

```shell
cross-seed search --max-data-depth 2
```

#### `maxDataDepth` Examples (Config file)

```js
maxDataDepth: 2,
```

### `linkCategory`

| Config file name | CLI short form | CLI long form                | Format   | Default           |
| ---------------- | -------------- | ---------------------------- | -------- | ----------------- |
| `linkCategory`   | N/A            | `--link-category <category>` | `string` | `cross-seed-link` |

`cross-seed` will use this category for all injected torrents when
[linking](../tutorials/linking.md) is enabled.

:::caution Docker

You will need to mount the volume for `cross-seed` to have access to the data
and linkDirs.

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
attempting to import cross-seeds. You do not need to set this to `true`
if you are using linking.

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

### `linkDirs`

| Config file name | CLI short form | CLI long form           | Format      | Default |
| ---------------- | -------------- | ----------------------- | ----------- | ------- |
| `linkDirs`       | N/A            | `--link-dirs <dirs...>` | `string(s)` |         |

:::tip

Ideally, you should only have a single linkDir and use drive pooling. Using
multiple linkDirs should be reserved for setups with cache/temp drives or where
drive pooling is impossible.

[**Read more**](../tutorials/linking.md)

:::

`cross-seed` will link (symlink/hardlink) in the path provided. If you use
[Injection](../tutorials/injection) `cross-seed` will use the specified linkType
to create a link to the original file in one of the `linkDirs` during searches
where the original data is accessible (both torrent and data-based matches). The
correct linkDir is chosen by matching the `stat.st_dev` for the source and link
paths. If no linkDir shares a `stat.st_dev` with the source, the injection will
fail for hardlinks and fallback to the first linkDir for symlinks.

[**How to configure linking?**](../tutorials/linking.md)

:::tip

[**If you are using `dataDirs`**](../tutorials/data-based-matching.md#general-usage-for-datadirs),
your `linkDirs` can not reside _INSIDE_ of your included [`dataDirs`](#datadirs) folders.
This is to prevent recursive and erroneous searches of folders used in linking folder structure.

:::

:::caution Docker

You will need to mount the volume for `cross-seed` to have access to the dataDir
and linkDirs.

:::

#### `linkDirs` Examples (CLI)

```shell
cross-seed search --linkDirs /data/torrents/xseeds /data1/torrents/cross-seed-links
```

#### `linkDirs` Examples (Config file)

```js
linkDirs: ["/data/torrents/SomeLinkDirName"],

linkDirs: ["C:\\cross-seed-links", "D:\\xseeds"],
```

:::info WINDOWS USERS

[**It is necessary to insert double-slashes for your paths, back-slashes are "escape characters" and "\\\\" equates to "\\".**](./faq-troubleshooting.md#windows-paths)

:::

### `linkType`

| Config file name | CLI short form       | CLI long form        | Format   | Default |
| ---------------- | -------------------- | -------------------- | -------- | ------- |
| `linkType`       | `--link-type <type>` | `--link-type <type>` | `string` |         |

`cross-seed` will link (symlink/hardlink/reflink) in the method provided. If you use
[Injection](../tutorials/injection) `cross-seed` will use the specified linkType
to create a link to the original file in one of the linkDirs.

Valid methods for linkType are `symlink`, `hardlink`, and `reflink`.

[**Read more**](../tutorials/linking.md)

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

| Config file name | CLI short form        | CLI long form         | Format                         | Default   |
| ---------------- | --------------------- | --------------------- | ------------------------------ | --------- |
| `matchMode`      | `--match-mode <mode>` | `--match-mode <mode>` | `strict`/`flexible`/`partial*` | `strict`  |

`cross-seed` uses three types of matching algorithms `strict`, `flexible`, and
`partial`. All types are equally safe. `strict` is required if you cannot use
linking. Using `partial` will find all possible cross seeds of your data and
allows setting [`seasonFromEpisodes`](#seasonfromepisodes) to a value below 1.

:::note

These algorithms can only be ran if `cross-seed` has snatched the torrent files.
The vast majority of candidates get rejected before a snatch has happened by
parsing information from the title. Using `partial` minimizes the amount of
wasted snatches since it's the most complete.

:::

| option     | description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| `strict`   | requires all file names to match exactly along with file sizes           |
| `flexible` | allows for file renames and slight inconsistencies                       |
| `partial`  | can be read about in detail [here](../tutorials/partial-matching.md)     |

For media library searches `flexible` or `partial` is necessary due to the renaming
of files.

#### `matchMode` Examples (CLI)

```shell
cross-seed search --match-mode flexible
cross-seed search --match-mode strict
```

#### `matchMode` Examples (Config file)

```js
matchMode: "partial",

matchMode: "strict",
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

:::tip

It's recommended to use `includeSingleEpisodes: false` in your config and override it for webhook
commands triggered on [`download completion`](../tutorials/triggering-searches.md#setting-up-your-torrent-client).
Combined with matching single episodes from announce, this should match all episodes without
the downside of searching for [`trumped/dead torrents`](../v6-migration.md#updated-includesingleepisodes-behavior).

:::

Set this to `true` to include **ALL SINGLE** episodes when searching (which are
ignored by default).

:::info

This will **NOT** include episodes present inside season packs (data-based
searches).

Behavior of this option has changed in v6, please see the
[migration guide](../v6-migration.md#updated-includesingleepisodes-behavior) for
details on the implementation's changes'.

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

:::tip

[**How to ignore `excludeOlder` for a single search?**](./faq-troubleshooting.md#how-can-i-disable-the-time-based-exclude-options-in-a-cross-seed-search)

[**What's the best way to add new trackers?**](./faq-troubleshooting.md#whats-the-best-way-to-add-new-trackers)

:::

When running a search, this option excludes anything first searched more than
this long ago. This option is only relevant in `search` mode or in `daemon` mode
with [`searchCadence`](#searchcadence) turned on.

:::info Note

**Search history is stored on a per-indexer basis.**

Searches that failed on specific indexers (for example - due to timeout or
rate-limiting) will not be marked as having been searched, and thus will not be
excluded by this setting for those specific indexers on the next run.

:::

#### `excludeOlder` Examples (CLI)

```shell
cross-seed search -x 10h # only search for torrents whose first search was less than 10 hours ago or never
cross-seed search --exclude-older "3 days" # only search for torrents whose first search was less than 3 days ago or never
cross-seed search -x 0s # only search for each torrent once ever
cross-seed search --no-exclude-older # disables/overrides the excludeOlder value in config.js
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

:::tip

[**How to ignore `excludeRecentSearch` for a single search?**](./faq-troubleshooting.md#how-can-i-disable-the-time-based-exclude-options-in-a-cross-seed-search)

[**What's the best way to add new trackers?**](./faq-troubleshooting.md#whats-the-best-way-to-add-new-trackers)

:::

When running a search, this option excludes anything that has been searched more
recently than this long ago. This option is only relevant in `search` mode or in
`daemon` mode with [`searchCadence`](#searchcadence) turned on.

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
cross-seed search --no-exclude-recent-search # disables/overrides the excludeRecentSearch value in config.js
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

### `notificationWebhookUrls`

| Config file name          | CLI short form | CLI long form                           | Format | Default |
| ------------------------- | -------------- | --------------------------------------- | ------ | ------- |
| `notificationWebhookUrls` | N/A            | `--notification-webhook-urls <urls...>` | URL[]  |         |

`cross-seed` will send a POST request to these URLs with the following payload:

```json
POST notificationWebhookUrl
Content-Type: application/json

{
  "title": "string",
  "body": "string",
  "extra": {
    "event": "RESULTS | TEST",
    "name": "string",
    "infoHashes": ["string"],
    "trackers": ["string"],
    "source": "announce | inject | rss | search | webhook",
    "result": "SAVED | INJECTED | FAILURE",
    "paused": false,
    "decisions": ["string"],
    "searchee": {
        "category": "string",
        "tags": ["string"],
        "trackers": ["string"],
        "length": 123,
        "infoHash": "string",
        "path": "string",
        "source": "torrentClient | torrentFile | dataDir | virtual"
	}
  }
}
```

Currently, `cross-seed` only sends the "RESULTS" and "TEST" events. In the
future it may send more. This payload supports both
[**apprise**](https://github.com/caronc/apprise-api) and
[**Notifiarr**](https://github.com/Notifiarr/Notifiarr).

#### `notificationWebhookUrls` Examples (CLI)

```shell
cross-seed daemon --notification-webhook-urls http://apprise:8000/notify http://apprise:8001/notify
```

#### `notificationWebhookUrls` Examples (Config file)

```js
notificationWebhookUrls: ["http://apprise:8000/notify", "http://apprise:8001/notify"],
```

### `host`

| Config file name | CLI short form | CLI long form   | Format    | Default   |
| ---------------- | -------------- | --------------- | --------- | --------- |
| `host`           | N/A            | `--host <host>` | `host/ip` | `0.0.0.0` |

In [Daemon Mode](../basics/managing-the-daemon), `cross-seed` runs a webserver
listening for a few types of HTTP requests. You can use this option to change
the host to bind to and listen on.

Unless you have an address on your interface you wish **NOT** to listen on, or
have a special set of networking requirements, you likely **DO NOT** need to
change the host from `"0.0.0.0"`.

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

:::tip

[**How to cross seed new releases as soon as they are uploaded?**](../tutorials/announce.md)

[**How to trigger ahead of schedule?**](./faq-troubleshooting.md#is-there-a-way-to-trigger-a-specific-cross-seed-job-ahead-of-schedule)

:::

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

:::tip

[**How to trigger a search on download completion?**](../tutorials/triggering-searches.md)

[**How to trigger ahead of schedule?**](./faq-troubleshooting.md#is-there-a-way-to-trigger-a-specific-cross-seed-job-ahead-of-schedule)

:::

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

qBittorrent users using an external program or script, such as qbit_manage, will
need extra considerations for `flatLinking: false`.

[**Read more about specific usage**](../v6-migration.md#new-folder-structure-for-links)

:::

Set this to `true` to use the flat-folder style linking previously used in v5.
This option will otherwise link any matches to a tracker-specific folder inside
of `linkDirs` (if set). This prevents cross seeds from conflicting with each
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

Use the blocklist on categories, tags, or trackers on torrents you do not want
to cross seed from your torrent client.

:::

`cross-seed` will exclude any of the files/releases from cross-seeding during
the prefiltering done for each search/inject/rss/announce/webhook use. The full
list of supported prefixes are:

- `name:` A substring of the name inside the .torrent file or parsed name from
  path if data based.
- `nameRegex:` Similar to name but uses your own custom regex.
- `folder:` A substring of any parent folder in the path. Only applies to
  [`dataDirs`](#datadirs) searchees, not ones from your torrent client.
- `folderRegex:` Similar to folder but uses your own custom regex on the entire
  parent path.
- `category:` Deluge labels are considered categories. `"category:"` blocklists
  torrents without a category.
- `tag:` Transmission and rTorrent labels are considered tags. `"tag:"`
  blocklists torrents without a tag.
- `tracker:` If the announce url (from client/.torrent) is
  `https://user:pass@tracker.example.com:8080/announce/key` you must use host
  `tracker.example.com:8080`.
- `infoHash:` Blocklist the torrent that matches this infohash
  (case-insensitive).
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
