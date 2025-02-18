---
id: v6-migration
title: v6 Migration Guide
position: 0
---

`cross-seed` 6 comes with several new features, increased match rates and better
matching efficiency. We have also added validation of the config file during
startup which improves error messages and allows us to prevent abusive
configurations.

:::caution

With all these changes and improvements in v6, it might be tempting to delete
your database and perform a "fresh search". **This is unnecessary** and only
serves to create more load for indexers. `cross-seed` will detect when you
change your matching settings or we make an improvement to the matching
algorithm, and **automatically** make previously searched torrents eligible for
matching again. [**Read More**](#expanded-caching-system)

:::

## Upgrading

Upgrade your version of `cross-seed` by pulling from the `6` or `latest` Docker
tag, or by running the following commands for a native installation:

```shell
npm uninstall -g cross-seed
npm install -g cross-seed
```

## Breaking Changes

### Node 20+ required

We have bumped our minimum Node version to Node 20 in order to take advantage of
new features. If you have a native installation (not Docker), you will need to
upgrade Node to at least version 20.

### Configuration Migration

Due to requests for configuration changes being outlined, here is configuration
migration for the changes as of v6.5.1.

:::tip New Options Keys

You can grab the new
[`config.template.js`](https://raw.githubusercontent.com/cross-seed/cross-seed/master/src/config.template.cjs)
and simply go through and migrate your missing options over to your current
`config.js`. Alternatively, you can add them yourself by referencing our
documentation.

- [`dataCategory -> linkCategory`](./basics/options.md#linkcategory)

- [`apiAuth -> apiKey`](./basics/options.md#apikey)

- [`flatLinking`](./basics/options.md#flatlinking)

- [`blockList`](./basics/options.md#blocklist)

- [`sonarr`](./basics/options.md#sonarr)

- [`radarr`](./basics/options.md#radarr)

- [`seasonFromEpisodes`](./basics/options.md#seasonfromepisodes)

- [`autoResumeMaxDownload`](./basics/options.md#autoresumemaxdownload)

- [`includeEpisodes`](#removed-includeepisodes) (_removed_)

:::

### Stricter `config.js` Validation

One of the biggest changes made in v6 is better config validation and error
messaging. Each option in the config file is validated for formatting and proper
syntax. If either is incorrect, a detailed error message will tell you where and
how to fix each option.

The new error messages will also provide links to specific documentation for the
option and point out bad paths or permission errors if you have any.

This is not going to automatically fix anything for you, but will give you a
better starting point to try and solve the issue yourself before requiring
outside assistance.

:::note

We have implemented specific "ratio-based" ranges for the
[excludeOlder](./basics/options.md#excludeolder) and
[excludeRecentSearch](./basics/options.md#excluderecentsearch) options. These
ratios are intended to prevent abuse, but we still want `cross-seed` to support
valid use cases. If you encounter problems with these restrictions which you
feel are invalid, please reach out to us on
[Discord](https://discord.gg/jpbUFzS5Wb).

:::

### API auth is required

`cross-seed` HTTP endpoints now _require_ API authentication, and we have
deleted the `apiAuth` boolean option that existed in version 5. Once you have
upgraded to v6, run the `cross-seed api-key` command to get your generated API
key, and supply it as an `apikey` query param or an `X-Api-Key` header on all
HTTP requests to `cross-seed`. We have added an `apiKey` option to override the
automatically generated API key, but this should only be used as an escape hatch
for advanced deployment setups.
[Read more about auth](./reference/api.md#authorization).

### New folder structure for links

Linked torrents are now organized into subdirectories for each tracker (for
example, `linkDir/Tracker1/Movie.2024.mkv`). This folder structure avoids
collisions and lets you seed the same torrent to two trackers with different NFO
files (or any other files).

Your `Tracker1` will be the name of the indexer in Prowlarr/Jackett or
[autobrr](#autobrr-update).

We made this change because it works better for a majority of users. However,
you may have a setup that relies on the previous linking behavior, especially if
you use [**qbit_manage**](https://github.com/StuffAnThings/qbit_manage) to
force-enable Auto Torrent Management in qBittorrent. If possible, we recommend
that you **leave Auto Torrent Management **off** for `cross-seed` links**, but
we have added an escape hatch option,
[`flatLinking`](./basics/options.md#flatlinking), which you can set to `true` to
preserve the v5 behavior with no tracker directories.

:::tip

[**qbit_manage**](https://github.com/StuffAnThings/qbit_manage) can be
configured to ignore modifying AutoTMM on torrents with the `cross-seed` tag, in
which case you can use the new folder structure with `flatLinking: false`.

:::

`cross-seed` will link and inject **new matches** with the new linking folder
structure, but it will not modify the folder structure for **previously injected
matches**. The old and new linking folder structures can coexist without any
issues, but if you would like to "clean things up" by migrating everything to
the new structure, see the
[flatLinking Migration section](#flatlinking-migration).

### autobrr Update

Due to the above updates, you might notice inconsistencies in the tracker
subdirectories created through `/api/announce` codepaths as compared to a
periodic search. These inconsistencies are only cosmetic and won't affect
functionality. Regardless, the autobrr team has updated
[autobrr's macros and documentation](https://autobrr.com/3rd-party-tools/cross-seed#cross-seed-filter).
There is now a new macro to accommodate the new linking structure. By updating
your data payload with the provided code, autobrr will now send the indexer's
name from `Settings -> Indexers` instead of the "indexer identifier".

```json
{
  "name": {{ toRawJson .TorrentName }},
  "guid": "{{ .TorrentUrl }}",
  "link": "{{ .TorrentUrl }}",
  "tracker": {{ toRawJson .IndexerName }}
}
```

Simply ensure that you've updated your data and the indexer's name in autobrr
matches the one in Prowlarr/Jackett, and everything will align correctly in your
[`linkDirs`](./basics/options.md#linkdirs).

### Removed `includeEpisodes`

In `cross-seed` version 5, `includeSingleEpisodes` was added as it allowed
searching for episodes while excluding ones from season packs. In v6,
`includeSingleEpisodes` will be the only option for searching episodes as
`includeEpisodes` is likely to produce many spammy searches for trumped/dead
episode torrents.

### Updated [`includeSingleEpisodes`](./basics/options.md#includesingleepisodes) Behavior

Previously in version 5, `includeSingleEpisodes: false` would ignore searching
episode torrents in addition to matching ones from rss and announce.
`includeSingleEpisodes` will now only affect rss and searching. Episodes from
announce will _ALWAYS_ be cross seeded, if possible, even if
`includeSingleEpisodes: false`.

:::tip

To prevent cross-seeding episodes from announce, configure your filters in
[autobrr](#autobrr-update).

:::

This serves the purpose of preventing searching for episodes that trackers will
usually have trumped in favor of season packs. If you're currently using
`includeSingleEpisodes: true`, please consider switching to `false` if it now
meets your needs as it will reduce unecessary load on trackers.

:::tip

You can override this option for webhook searches which gives the best of
both worlds.

[**Read more**](./tutorials/triggering-searches.md#setting-up-your-torrent-client)

:::

## New Features and Improvements

### Linking for torrent-based Matches

Previously in v5, there were many scenarios where using `dataDirs` would offer
benefits over `torrentDir`—namely, looser matching with the `flexible` match mode
required data-based matching. In version 6 we have added support for linking
torrent-based matches, so data-based matching is no longer necessary (read more
below).

#### Data-based Matching Use Cases

Due to the linking updates mentioned, we recommend using **ONLY**
`useClientTorrents` or `torrentDir` and leaving `dataDirs` empty, except in
[**these cases**](./tutorials/data-based-matching.md#general-usage-for-datadirs).

### Partial Matching

We've introduced a new mode for [`matchMode`](./basics/options#matchmode) named
`partial`. This mode is designed to identify cross-seeds missing small files
such as nfo, srt, or sample files.

For more information, see the
[**Partial Matching page**](./tutorials/partial-matching.md).

### Ensemble or "Torrent Aggregation"

`cross-seed` will additionally aggregate/join your already downloaded episodes
into season packs for matching to get you seeding data you already have faster.
This functionality is linked to the new option
[seasonFromEpisodes](./basics/options.md#seasonfromepisodes) - which is a ratio
of episodes you need to have for a match.

### Searching by Media IDs

`cross-seed` now has the ability to, when configured, query instances of
[Sonarr](./basics/options.md#sonarr) or [Radarr](./basics/options.md#radarr) for
TVDB, TMDB, IMDB, and TVMAZE IDs. These can be used on indexers that support
searching by IDs `cross-seed` will use IDs to search wherever it can, improving
search performance and match rates for poorly-named content.

For more information, see the
[**Searching by Media IDs page**](./tutorials/id-searching.md).

### New [`blockList`](./basics/options.md#blocklist) Option

Another new option added is called [`blockList`](./basics/options.md#blocklist).
This option takes an array of case-sensitive strings with a prefix of its block
type. Some fields even use regex (case-sensitive) for maximum flexibility. You
can find usage examples on the options page for
[`blockList`](./basics/options.md#blocklist).

### `torrentDir` can be set to null

Previously, our recommendation if you wanted to strictly search only
[`dataDirs`](./basics/options.md#datadirs) for matches was to point
[`torrentDir`](./basics/options.md#torrentdir) at an empty folder. This is no
longer necessary. You can now set [`torrentDir`](./basics/options.md#torrentdir)
to `null` to achieve a data-only search, with the caveat that data-only
configurations are likely [no longer necessary](#linking-for-torrent-based-matches).

### Anime Support

`cross-seed` now understands the most popular anime naming schemes. Please note
that this is our first attempt at accommodating this content, so your experience
may vary depending on your indexers and content.

We've aimed to cover the inconsistent and unconventional naming conventions that
prevail in anime content, but there may be certain naming styles, from specific
groups or indexers, that we haven't accounted for.

This change requires no action on your part.

:::tip

If you come across any anime naming schemes (**not _ONE_ "edge-case" release**)
that we've missed, please let us know
[**via Discord**](https://discord.gg/jpbUFzS5Wb).

:::

### Category-aware Searching

`cross-seed` will now query each indexer for the media
[Torznab categories](https://inhies.github.io/Newznab-API/categories/#predefined-categories)
it supports, and skip searching for any media type the indexer doesn't carry.
This heavily reduces "useless" searches and makes it more feasible to use
cross-seed with non-video trackers.

This requires no action to be taken on your part.

### Updated [`includeNonVideos`](./basics/options.md#includenonvideos) Behavior

Previously in version 5, `cross-seed` would exclude torrents or folders for
searching based on the presence of any non-video files regardless of their size
(think nfo or srt) when this was set to `false`. This behavior could result in
you using this option to exclude music, games, or apps but losing out on
searches of a movie due to a nfo, text, or srt file being included in the
torrent.

`includeNonVideos` will now, while set to `false`, exclude based on _HOW MUCH_
of the torrent or folder is comprised of video files. For instance, when set to
`false`, if you have a 100MB torrent and your
[`fuzzySizeThreshold`](./basics/options.md#fuzzysizethreshold) is set to `0.02`,
then you can have up to 2MB of non-video files before it is excluded from
searching.

:::tip

For some configurations, particularly when searching media libraries from Sonarr
or Radarr with subs or metadata/cover images in the media folders, it may be
necessary to enable [partial matching](#partial-matching) in order to take
advantage of these searches.

:::

### Expanded Caching System

`cross-seed` will now cache more aggressively and in more situations, not only
speeding up the process but reducing uncessary load on indexers. When searching,
torrents with identical search queries will be able to share search results to
prevent sending the same query twice. This most commonly applies to torrents of
the same media but from different release groups, resolution, source, formats,
etc. This will drastically reduce the number of unique queries that `cross-seed`
makes to indexers.

Torrent snatches are now also cached in more scenarios and are used more
aggresively during the decide stage. A torrent will only be snatched ONCE for
the lifetime of `cross-seed`. Finally, past decisions will be reassessed as
necessary, so any config changes or future improvements we make to `cross-seed`
will automatically retry previously rejected candidates.

This requires no action on your part.

### Failed injection (saved) retry

:::warning

`cross-seed` is the **only** program that understands how to properly link and
inject its [partial matches](./tutorials/partial-matching.md). Other programs,
like [**autotorrent**](https://github.com/JohnDoee/autotorrent), will not work.
You do not need to do anything with torrents saved to `outputDir`—`cross-seed`
will handle them unless the torrent is stalled.
[Read more about retrying injections](./tutorials/injection.md#manual-or-scheduled-injection).

:::

Previously whenever an injection attempt failed, your torrent would be saved and
require manual intervention (or a subsequent successful search and injection) to
complete the cross-seeding process. We've now added an hourly inject job to
`cross-seed daemon` which will retry failed injections saved to your
[`outputDir`](./basics/options.md#outputdir). Additionally, matches will now
save in more failure scenarios such as an incomplete source or instead of a
linking failure fallback.

This feature supports BYO `.torrent` files. For more information, see the
[Direct Injection page](./tutorials/injection.md#manual-or-scheduled-injection)
and our [`utils`](./reference/utils.md#cross-seed-inject) for detailed
information about behavior.

### RSS/Announce Improvements

We have improved the performance and accuracy of matching new candidates against
content you already have (now with [`dataDirs`](./basics/options.md#datadirs) support).
RSS scans now support pagination in case `cross-seed` experiences downtime.
The `/api/announce` endpoint has slightly modified its HTTP status codes to better
integrate with [**Autobrr**](https://github.com/autobrr/autobrr).

### Sonarr TV Library Searching

Previously, `cross-seed`'s data based matching support looked for folder
structures like this:

```
My Show S01/
    My Show S01E01
    My Show S01E02
My Show S02/
    My Show S02E01
    My Show S02E02
```

When presented with standard Sonarr library folder structure as seen below,
`cross-seed` would query indexers for `Season 1` and `Season 2` and get a bunch
of garbage results.

```
My Show/
    Season 1/
        My Show S01E01
        My Show S01E02
    Season 2/
        My Show S02E01
        My Show S02E02
```

`cross-seed` can now understand handle this folder structure with
`matchMode: "flexible"` or `"partial"`.

This also opens up the possibility of effectively cross-seeding season packs
downloaded from usenet post import/completion.
[Arr Import script](https://gist.github.com/zakkarry/ddc337a37b038cb84e6248fe8adebb46)
has now been updated to replicate the immediate "search, match, and cross-seed"
behavior you can achieve with torrent downloads.

:::note

Strictly in Sonarr, you will need to update your script and _CHANGE_ your event
types in your "Settings -> Connect -> Custom Script" to "On Import Complete."

**This only needs to be done in Sonarr, Radarr does not need to be changed.**

:::

### Other Miscellaneous Changes

Here is a short list of other changes made in v6. These are some of the
behind-the-scenes updates made to improve `cross-seed`.

- Updated to Node v20, ES2022, and TypeScript v5
- Any indexer failures not related to rate limiting (status code: `429`) will be
  cleared from the database when `cross-seed` is restarted.
- Regex improvements. Some trackers rename search results or have non-standard
  naming conventions. The updated regex takes more of those into account and
  should find more matches.
- Improved logging messages, specifically around matching decisions.
- There are now lists of files/folders integrated into `cross-seed` that are
  blocked during prefiltering at startup. These include folders present inside
  full-disc Bluray/DVD releases (BDMV/CERTIFICATE), individual music files, RAR
  archives, season (e.g. "Season 01") and main series/movie folders in Sonarr
  and Radarr libraries. Excluding these from the `cross-seed` index (for
  data-based searches) will result in fewer "bad" searches that would otherwise
  yield no viable results.
- New recommended defaults in
  [`config.template.js`](https://raw.githubusercontent.com/cross-seed/cross-seed/master/src/config.template.cjs).
  These settings are what we consider to be the best starting options when
  setting up `cross-seed`.

## [`flatLinking`](./basics/options.md#flatlinking) Migration

If you would like to switch to the new grouped-by-tracker linking structure in
`cross-seed` v6, you can now migrate previously injected torrents and folder
structures.

**This is completely optional**. These scripts are currently only written for
`qBittorrent` and `Deluge`.

If you are willing, you can follow these as guidelines to implement for other
clients and we'll add them here.

| Client       |                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------ |
| `qBittorent` | [Gist link to latest version](https://gist.github.com/ShanaryS/6fbc60327ad5f7043c81e5b1f33da404) |
| `Deluge`     | [Gist link to latest version](https://gist.github.com/zakkarry/3f690bcd56bbfa00c4d72c97d24f2620) |
