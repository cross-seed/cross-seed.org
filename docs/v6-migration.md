---
id: v6-migration
title: v6 Migration Guide
position: 0
---

:::danger Please Note
With all these changes and improvements in v6, it might be tempting to delete your database and perform a "fresh search". **THIS IS UNCESSARY** and only serves to create more load for indexers. With v6 and onwards, performing a "fresh search" is **_NEVER_** needed or required to take advantage of your config changes or features we add. Please be kind to your indexers.

[**Read More**](#expanded-caching-system)
:::

### Updates Since Initial Pre-Release

Since the initial pre-release (`6.0.0-0`) we've worked with our users and friends to iron out implementations in the most reasonable and usable way possible. As we proceed through the pre-release/testing phase for v6, further changes may be made. They will all be documented here prior to releases.

The majority of the trade-offs we've had to make have been for enhancements and meaningful features. While this update will require some users to rethink, or reconfigure, certain aspects of their setup or workflow to accommodate this; these changes were, unfortunately, unavoidable.

The enhancements we've added and changes we've made are outlined in this migration guide.

:::caution Be advised
**Please read this guide thoroughly and keep in mind that it will be updated throughout the pre-release process, and after, as we fine-tune the details for clarity.**

The latest pre-release versions can be installed by using the Docker tag `:master` or NPM tag of `@next` after `cross-seed`.
:::

:::danger DANGER
It may be tempting as we go through pre-release and release 6.0.0 stable to take advantage of these searching improvements with "full" searches. While this idea is understandable, we must caution you to not disrespect your indexers by slamming them with API queries.

We recommend if you are going to conduct searches to find what you've "missed" previously, set a higher than normal [`delay`](./basics/options.md#delay) and a [`searchLimit`](./basics/options.md#searchlimit) to smooth out the load on indexers.
:::

:::tip QBittorrent
While we previously advised qBittorrent users to hold off on the initial pre-release (`6.0.0-0`), we feel we now have `cross-seed` in a usable state for those users. There are [some changes](#qbittorrent) that should be noted before updating to help test. We recommend backing up your configuration directory before testing any pre-release versions.
:::

## Overview

There are several changes in `cross-seed` version 6.x. Most of them do not require any action on your part while some need to be addressed in both the configuration file ([`config.js`](https://raw.githubusercontent.com/cross-seed/cross-seed/master/src/config.template.cjs)) and potentially permissions or volumes/mounts.

This document outlines the changes made and the actions required to take advantage of all the new features and capabilities.

:::danger Please Note
**This is currently a pre-release of v6.** Your mileage _may vary_ on behavior and performance. We **always** recommend that before updating you make a backup of your **entire** configuration directory.

Please let us know if you run into any issues [**via Discord**](https://discord.gg/jpbUFzS5Wb)
:::

### Breaking Changes (TLDR)

| Scope or Area          | Description                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **qBittorrent**        | Changes were necessary for linking enhancements made and compatibility with AutoTMM and qBittorrent. <br/><br/>`duplicateCategories` previous behavior has migrated to `.cross-seed` appended category being tagged on the cross-seeded torrent. All cross-seeds will go to linkCategory when linked and injected.<br/><br/>([**Read More**](#qbittorrent)) |
| **API authentication** | [`apiAuth`](./basics/options.md#apiauth) option was removed and the optional [`apiKey`](./basics/options.md#apikey) option was added.<br/><br/> If unspecified, cross-seed will use an autogenerated API key. [Use the API key](./reference/api#authorization) when you make calls to the `/api/webhook` endpoint and the `/api/announce` endpoint.         |
| **Node**               | Minimum required version: [v20](https://nodejs.org/en/download)                                                                                                                                                                                                                                                                                             |
| **`webhook` API**      | `name` has been removed and [should be replaced with `infoHash`](./reference/api.md#post-apiwebhook).<br/><br/>Valid parameter are now **_ONLY_** `infoHash` and `path`.<br/><br/>(**Examples can be found [here.](./basics/daemon#set-up-automatic-searches-for-finished-downloads)**)                                                                     |

:::caution HEADS-UP!
`cross-seed` v6 requires Node 20 or greater. Check your Node version with `node --version` and update if needed.

**Docker users can skip this step.**
:::

:::tip
You can grab the new [`config.template.js`](https://raw.githubusercontent.com/cross-seed/cross-seed/master/src/config.template.cjs) and simply go through and migrate your missing options over to your current `config.js`. Alternatively, you can add them yourself by referencing our documentation.

-   [`dataCategory -> linkCategory`](./basics/options.md#linkcategory)

-   [`apiAuth -> apiKey`](./basics/options.md#apikey)

-   [`flatLinking`](./basics/options.md#flatlinking)

-   [`blockList`](./basics/options.md#blocklist)

-   [`sonarr`](./basics/options.md#sonarr)

-   [`radarr`](./basics/options.md#radarr)

-   [`seasonFromEpisodes`](./basics/options.md#seasonfromepisodes)

-   [`maxRemainingForResume`](./basics/options.md#maxremainingforresume)

-   [`includeEpisodes`](#removed-includeepisodes) (_removed_)

:::

### Stricter `config.js` Validation

One of the biggest changes made in v6 is better config validation and error messaging. Each option in the config file is validated for formatting and proper syntax. If either is incorrect, a detailed error message will tell you where and how to fix each option.

The new error messages will also provide links to specific documentation for the option and point out bad paths or permission errors if you have any.

This is not going to automatically fix anything for you, but will give you a better starting point to try and solve the issue yourself before requiring outside assistance.

:::note
We have implemented specific "ratio-based" ranges for the [excludeOlder](./basics/options.md#excludeolder), [excludeRecentSearch](./basics/options.md#excluderecentsearch), and [searchCadence](./basics/options.md#searchcadence) options. These ratios are meant to ensure that you appropriately utilize the intended functionality of these options.

Examples of implementations can be seen [in the daemon section of the documentation](./basics/daemon.md#set-up-periodic-searches).

If you need to do a full search, running a `cross-seed search` rather than daemon mode will be exempt from these restrictions.

If you encounter problems with these restrictions which you feel are invalid, please reach out to us on [Discord](https://discord.gg/jpbUFzS5Wb) to discuss this further.
:::

:::tip
It is now also possible to use `--no-exclude-recent-search` and `--no-exclude-older` as arguments in your CLI command if you wish to override them without changing your config file.

```shell
cross-seed search --no-exclude-older
```

:::

### Linking Updates

We have made drastic changes to the way linking operates, both in its implementation and in expanding its capabilities. Not only is linking more versatile in what can be matched now (for instance, previously, files inside/outside a folder would not match to a torrent in the opposite folder structure - this has been fixed), but you can also take advantage of linking when searching .torrent files instead of solely applying to data-based matching.

To achieve torrent linking, you simply have to mount or give permission (if necessary) for `cross-seed` to read and write to the actual torrent data structure (downloaded files) your client uses. This will need to mirror (for docker) the mounts made in the client. Your client will also need to be able to read and write to the [`linkDir`](./basics/options.md#linkdir) folder. You do not need to specify a [`dataDirs`](./basics/options.md#datadirs) in your conig for this setup, but simply define a [`linkDir`](./basics/options.md#linkdir).

:::tip
You can still include a [`dataDirs`](./basics/options.md#datadirs) if you wish to also index and search your data, but [`dataDirs`](./basics/options.md#datadirs) isnt necessary to utilize linking behavior now.
:::

The new default linking structure in v6 in your [`linkDir`](./basics/options.md#linkdir) creates sub-folders for each indexer (for example, `/link_dir/Indexer 1/Name.of.Torrent.File.mkv`). This doesn't change or affect previously matched torrents, but if enabled will follow this new structure moving forward. Your `Indexer 1` will be the name of the indexer in Prowlarr/Jackett or [autobrr](#autobrr-update).

:::warning BE ADVISED
Auto Torrent Management in qBittorrent has presented some hurdles with implementing the new linking enhancements with qBittorrent.

**Please read the next part of this section carefully to determine what settings you will require to achieve the best results.**

During this transitional process, you can get support [**via Discord**](https://discord.gg/jpbUFzS5Wb) if you require assistance with any of the configurations.
:::

#### qBittorrent

Due to the limitations in place with qBittorrent and Auto Torrent Management's behavior, we've introduced a new option in support of the feature-sets and changes we have added.

If you are using an external program or script, such as qbit_manage, to force Auto Torrent Management (AutoTMM) on your existing torrents, **you must** enable [`flatLinking`](./basics/options.md#flatlinking) for `cross-seed` linking to work. If the program/script can ignore modifying AutoTMM on torrents with the `cross-seed` tag, then you **should** enable that feature and set `flatLinking: false`.

If you are not using an external tool to modify AutoTMM on your torrents, then you should use `flatLinking: false`. The AutoTMM settings in qBittorrent are all safe to use as they don't modify existing torrents. They only apply as a default for newly added torrents (which `cross-seed` ignores).

Even with `flatLinking: true`, you can still take advantage of the [matching enhancements](#partial-matching) in v6 with your searches. However **we strongly recommend** that you consider your AutoTMM usage and make changes in your config and workflow to support `flatLinking: false` to prevent cross-seeds from conflicting.

`cross-seed` will inject all linked torrents directly to the [`linkCategory`](./basics/options.md#linkcategory) if linking is possible, otherwise direct torrent matches will behave the same as they did in v5.

### autobrr Update

If you're using [`flatLinking: false`](./basics/options.md#flatlinking), when receiving announces with the old data payload in your cross-seed autobrr filter, you might notice inconsistencies in the folders created from ones created with a search.

To address this, [autobrr's macros and documentation have been updated](https://autobrr.com/3rd-party-tools/cross-seed#cross-seed-filter). There is now a new macro to accommodate the new linking structure. By updating your data payload with the provided code, autobrr will now send "Name" from `Settings -> Indexers` instead.

```json
{
    "name": "{{ .TorrentName }}",
    "guid": "{{ .TorrentUrl }}",
    "link": "{{ .TorrentUrl }}",
    "tracker": "{{ .IndexerName | js}}"
}
```

Simply ensure that you've updated your data and the indexer's name in autobrr matches the one in Prowlarr/Jackett, and everything will align correctly in your [`linkDir`](./basics/options.md#linkdir).

### Updated [`torrentDir`](./basics/options.md#torrentdir) Option

Previously, our recommendation if you wanted to strictly search only [`dataDirs`](./basics/options.md#datadirs) for matches was to point [`torrentDir`](./basics/options.md#torrentdir) at an empty folder. This is no longer necessary. You can now set [`torrentDir`](./basics/options.md#torrentdir) to `null` to achieve a data-only search.

### Updated [`skipRecheck`](./basics/options.md#skiprecheck) Option

:::danger
This is an upcoming feature for v6.
:::

`skipRecheck` will no longer have an affect resuming torrents on injection. `skipRecheck: true` behaves as before, injecting resumed at 100% for complete matches. Now, `skipRecheck: false` will simply start a recheck then resume once completed. This allows `cross-seed` to detect the rare case of corrupted torrents for cross seeding purposes. Paused torrents within your [`maxRemainingForResume`](./basics/options.md#maxremainingforresume) limit are likely corrupted and should be removed (possibly [`blocklisted`](#new-blocklist-option)).

### `include` Option Changes

#### Removed [`includeEpisodes`](./basics/options.md#includeepisodes)

In `cross-seed` version 5, `includeSingleEpisodes` was added as it allowed searching for episodes while excluding ones from season packs. In v6, `includeSingleEpisodes` will be the only option for searching episodes as `includeEpisodes` is likely to produce searches for trumped/dead episode torrents.

#### Updated [`includeSingleEpisodes`](./basics/options.md#includesingleepisodes) Behavior

Previously in version 5, `includeSingleEpisodes: false` would ignore searching episode torrents in addition to matching ones from rss and announce. `includeSingleEpisodes` will now only affect rss and searching. Episodes from announce will _ALWAYS_ be cross seeded, if possible, even if `includeSingleEpisodes: false`.

:::tip
To prevent cross-seeding episodes from announce, configure your filters in [autobrr](#autobrr-update).
:::

This serves the purpose of preventing searching for episodes that trackers will usually have trumped in favor of season packs. If you're currently using `includeSingleEpisodes: true`, please consider switching to `false` if it now meets your needs as it will reduce unecessary load on trackers.

#### Updated [`includeNonVideos`](./basics/options.md#includenonvideos) Behavior

Previously in version 5, `cross-seed` would exclude torrents or folders for searching based on the presence of any non-video files regardless of their size (think nfo or srt) when this was set to `false`. This behavior could result in you using this option to exclude music, games, or apps but losing out on searches of a movie due to a nfo, text, or srt file being included in the torrent.

`includeNonVideos` will now, while set to `false`, exclude based on _HOW MUCH_ of the torrent or folder is comprised of video files. For instance, when set to `false`, if you have a 100MB torrent and your [`fuzzySizeThreshold`](./basics/options.md#fuzzysizethreshold) is set to `0.02`, then you can have up to 2MB of non-video files before it is excluded from searching.

:::tip
For some configurations, particularly when searching media libraries from Sonarr or Radarr with subs or metadata/cover images in the media folders, it may be necessary to enable [partial matching](#partial-matching) in order to take advantage of these searches at all.
:::

This option will now be able to effectively exclude the actual non-video **BASED** searches, rather than merely a "yes" or "no" for a search containing a non-video file.

### New [`blockList`](./basics/options.md#blocklist) Option

Another new option added is called [`blockList`](./basics/options.md#blocklist). This option takes an array of case-sensitive strings with a prefix of its block type. Some fileds even use regex (case-sensitive) for maximum flexibility. You can find usage examples on the options page for [`blockList`](./basics/options.md#blocklist).

### [`apiAuth`](./basics/options.md#apiauth) (removed) and [`apiKey`](./basics/options.md#apikey) (added) Options

`cross-seed` endpoints (announce and webhook) now _require_ API authentication. There are two ways to set up API authentication in v6:

1. Generated Key: By setting [`apiKey`](./basics/options.md#apikey) to `undefined`, `cross-seed` will continue to use a generated key. You can find this key by running `cross-seed api-key`.

    **This is recommended for most users.**

2. Designated Key: You can now set a designated API key for `cross-seed`. Setting [`apiKey: "YOURkeyHereMak3It@good1",`](./basics/options.md#apikey) in the config file will tell `cross-seed` to always use that key.

The `apiAuth` option in previous versions of `cross-seed` has been removed.

:::warning
While we provide this option, we strongly urge you to use a generated key. If you are specifying a key, please make sure this is a secure and safe key. You are responsible for your security.
:::

### Searching Improvements

:::danger DANGER
It may be tempting as we go through pre-release and release 6.0.0 stable to take advantage of these searching improvements with "full" searches. While this idea is understandable, we must caution you to not disrespect your indexers by slamming them with API queries.

We recommend if you are going to conduct searches to find what you've "missed" previously, set a higher than normal [`delay`](./basics/options.md#delay) and a [`searchLimit`](./basics/options.md#searchlimit) to smooth out the load on indexers.
:::

:::caution
Currently, only Movies, Episodes, Seasons, and Anime are officially supported. If [`includeNonVideos`](./basics/options.md#includenonvideos) is enabled, `cross-seed` can and will find matches for **_ANY_** torrent, not just the ones explicitly supported. However these will likely need to be a perfect `MATCH` as it does not optimize for these.
:::

#### Usage of [`torrentDir`](./basics/options.md#torrentdir) and [`dataDirs`](./basics/options.md#datadirs)

Previously in v5, there were many scenarios where using `dataDirs` would offer benefits over `torrentDir`. As such, it would be typical to have both enabled to get all possible matches. This is still allowed but no longer necessary. Aside from two execptions, we recommend all users of v6 to **exclusively** use `torrentDir`. These contain far more information to aide `cross-seed` in better and safer matching.

The first scenario where you should also use `dataDirs` is if you are downloading through usenet. This will always necessary if you want `cross-seed` to match against this content.

The second scenario is if you have content in your media directories not inside your torrent client. Here you only need to perform a search with `dataDirs` **ONCE**. You should never keep `dataDirs` enabled if the first scenario doesn't apply to you. At the most, you can add your media `dataDirs` and perform a search every few months but this is unlikely to yield any results and only puts undue stress on indexers.

#### Anime Support

Anime is now supported in a **_somewhat limited_** capacity. Please note that this is our first attempt at accommodating this content, so your experience may vary depending on your indexers and content.

We've aimed to cover the inconsistent and unconventional naming conventions that prevail in anime content, but there may be certain naming styles, from specific groups or indexers, that we haven't accounted for.

:::tip HELP
If you come across any anime naming schemes (**not _ONE_ "edge-case" release**) that we've missed, please let us know [**via Discord**](https://discord.gg/jpbUFzS5Wb).
:::

#### Partial Matching

We've introduced a new mode for [`matchMode`](./basics/options#matchmode) named `partial`.

This mode is similar to `risky` but doesn't necessitate all files to be present. The minimum required "match size" is determined by `1 - fuzzySizeThreshold`. For instance, with a `fuzzySizeThreshold` of `0.05`, potential cross-seeds containing only 95% of the original size will match. This mode is designed to identify cross-seeds missing small files such as nfo, srt, or sample files.

`cross-seed` will monitor injections for partial matches for up to an hour and then check with the [inject job](#failed-injection-saved-retry). If it has finished rechecking, `cross-seed` will automatically resume the torrent if the remaining download is less than [`maxRemainingForResume`](./basics/options.md#maxremainingforresume). For torrents with a larger amount remaining, you will need to manually resume as you can avoid downloading the same missing data on multiple trackers by following [these steps](./basics/faq-troubleshooting.md#my-partial-matches-from-related-searches-are-missing-the-same-data-how-can-i-only-download-it-once).

:::info Note
Torrents matched and added via a `partial` match will always be rechecked. Nearly all partial matches will have the existing files at 99.9% instead of 100%. This is expected and is due to how torrent piece hashing works.
:::

:::warning BE ADVISED
It's advised not to set [`fuzzySizeThreshold`](./basics/options#fuzzysizethreshold) above `0.1` to avoid [triggering excessive snatches](./basics/faq-troubleshooting.md#my-tracker-is-mad-at-me-for-snatching-too-many-torrent-files).

**Failing to consider your settings and their impact could lead to the banning or disabling of your account on trackers.**

[Also, please read the update FAQ entry on linking.](./basics/faq-troubleshooting.md#what-linktype-should-i-use)
:::

#### Torznab Categories

`cross-seed` will now check with Prowlarr or Jackett for the categories that that indexer supports. As a result, we no longer send searches for content that is not listed by Prowlarr/Jackett as available on the indexer.

This should reduce the number of searches made for content that does not have a chance of existing on the indexer.

:::info Note
This requires no additional action to be taken on your part.
:::

#### [`Sonarr`](./basics/options.md#sonarr) and [`Radarr`](./basics/options.md#radarr) ID Lookup (searching)

:::danger DANGER
It may be tempting as we go through pre-release and release 6.0.0 stable to take advantage of these searching improvements with "full" searches. While this idea is understandable, we must caution you to not disrespect your indexers by slamming them with API queries.

We recommend if you are going to conduct searches to find what you've "missed" previously, set a higher than normal [`delay`](./basics/options.md#delay) and a [`searchLimit`](./basics/options.md#searchlimit) to smooth out the load on indexers.
:::

`cross-seed` now has the ability to, when configured, query instances of [Sonarr](./basics/options.md#sonarr) or [Radarr](./basics/options.md#radarr) for the metadata - specifically the TVDB, TMDB, IMDB, and TVMAZE IDs. These can be used on supporting indexers to search more accurately and completely.

You do not have to do anything besides add your Sonarr and Radarr instances, with apikey (similar to the [`torznab`](./basics/options.md#torznab) URL from [Prowlarr](https://prowlarr.com/) or [Jackett](https://github.com/Jackett/Jackett)), to the configuration options in `config.js`.

-   [**Sonarr Option**](./basics/options.md#sonarr)
-   [**Radarr Option**](./basics/options.md#radarr)

`cross-seed` will use IDs to search wherever it can.

:::tip INFO
The series or movie _must be added in your instance of Sonarr or Radarr._ You **DO NOT** need to have actual media _imported_, but **the entry must exist**

_"Missing"_ status is valid.

**We do not query any external metadata servers.**
:::

#### Expanded Caching System

`cross-seed` will now cache more aggressively and in more situations, not only speeding up the process but reducing uncessary load on indexers. When searching, torrents with identical torznab queries will have their results cached and shared. This most commonly applies to torrents of the same media but from different release groups, resolution, source, formats, etc. This will drastically reduce the number of unique queries that `cross-seed` makes to indexers.

Torrent snatches are now also cached in more scenarios and are used more aggresively during the decide stage. A torrent will only be snatched ONCE for the lifetime of `cross-seed`. Finally, past decisions will be reassessed as necessary, so any changes made to your config or future improvements we make to `cross-seed` will be applied to previously rejected cross seeds.

:::danger Please Note
`cross-seed` tries to use its cache as much as possible to reduce the burden it places on indexers. With all of the changes in v6, it will **NEVER** be necessary to delete your database or `torrent_cache` folder to perform a "fresh search". Doing so offers no benefits, is slower, and only puts undue stress on indexers. If you make changes to your config, [please follow the steps listed here to take advantage](./basics/faq-troubleshooting.md#what-should-i-do-after-updating-my-config-file).
:::

#### Failed injection (saved) retry

:::warning
With all the improvements in v6, some `cross-seed` matches can be highly sophisticated. As such, you should **NEVER** use any external programs or scripts to inject torrents from [`outputDir`](./basics/options.md#outputdir). This is likely to cause errors or bad injections into your client. `cross-seed` will handle all failed injections automatically with _ZERO_ manual input. There is never a need to interact with `outputDir` unless you are removing a stalled injection from your client and want to prevent further re-injections. [Read More...](./tutorials/injection.md#manual-or-scheduled-injection)
:::

Previously whenever an injection attempt failed to complete, your torrent would be saved and require manual intervention (or a subsequent successful search and injection) to complete the cross-seeding process. We've now added a inject "job" which will run on an hourly cadence that will retry .torrent files which have been saved to your [`outputDir`](./basics/options.md#outputdir). Additionally, matches will now save in more failure scenarios such as an incomplete source or instead of a linking failure fallback.

When the inject job is ran, `cross-seed` will use the .torrent files in your outputDir to resume any previously injected torrent. This allows partial matches to automatically be resumed even if the [initial timeout](#partial-matching) elapses.

:::tip
This inject feature uniquely has the ability to source files from all matches, not just the best. In addition, all partial matches will also have their .torrent file saved, even on successful injection. This is to better assist you for [optimizing your partial downloads](./basics/faq-troubleshooting.md#my-partial-matches-from-related-searches-are-missing-the-same-data-how-can-i-only-download-it-once). You can also potentially revive dead torrents with this feature [in certain scenarios](./basics/faq-troubleshooting.md#how-can-i-force-inject-a-cross-seed-if-its-source-is-incomplete).
:::

This feature is also available for use on .torrent files never seen by `cross-seed`. Please see the following entry in [Direct Injection Page](./tutorials/injection.md#manual-or-scheduled-injection) and our [`utils`](./reference/utils.md#cross-seed-inject) for detailed information about behavior.

:::caution
It is important to note that this function performs minimal filtering on injection attempts, and could result in slightly increased chance of false-positives for **torrent files YOU add for injection**.
:::

#### [`RSS`](./basics/options.md#rsscadence) and [`Announce`](./reference/api.md#post-apiannounce) Improvements

The algorithms used for reverse lookup to match with your existing content has been significantly improved. It now parses titles more accurately and completely regardless of naming formats. Additionally, candidates are compared against all matches with your existing content instead of the best for a more comprehensive lookup. If you notice any inaccuracies, please let use know [**via Discord**](https://discord.gg/jpbUFzS5Wb).

`cross-seed` now supports pagination for rss feeds. If the last rss search time is more than your [rssCadence](./basics/options.md#rsscadence), `cross-seed` will page back on trackers that support it. This should cover a few hours to a few days of `cross-seed` downtime depending on the tracker's api limits and upload frequency.

With the new retrying capabilities in v6, the scenarios for a succesful [`announce`](./reference/api.md#post-apiannounce) response have expanded. A status code of `200` will now be returned even on injection failure since it will be later retried. `200` will also be returned if the torrent has already been injected, likely between [`autobrr`](./basics/faq-troubleshooting.md#how-can-i-use-autobrr-with-cross-seed) retries. A code of `200` should now be interpreted that a complete match was found, instead of a succesful injection. A code of `202` is still reported for incomplete torrents which allows for quicker retires over the [`inject job`](#failed-injection-saved-retry) cadence.

#### Ensemble or "Torrent Aggregation"

:::danger
This is an upcoming feature for v6.
:::

Many of you may be familiar with things like [seasonpackarr](https://github.com/nuxencs/seasonpackarr) which will aggregate/join your already downloaded episodes into season packs when they are combined and uploaded on your trackers, and inject them. `cross-seed` can now do the same, linking and then creating a "combined" set of matching torrents or data to get you seeding data you already have faster. Currently, only season packs from individual episodes is supported but we may support additional aggregation in the future.

This functionality for season packs is linked to the new option [seasonFromEpisodes](./basics/options.md#seasonfromepisodes) - which is a ratio of episodes you need to have for a match.

:::tip
This feature works best with [partial matching](#partial-matching) and [Sonarr](./basics/options.md#sonarr). You can avoid downloading the same missing episodes on multiple trackers by following [these steps](./basics/faq-troubleshooting.md#my-partial-matches-from-related-searches-are-missing-the-same-data-how-can-i-only-download-it-once).
:::

#### Sonarr TV Library Searching

We always recommend, whenever possible, to feed original un-renamed data files or (preferably) .torrent files (using `torrentDir`) into cross-seed for searching. However, certain cases, primarily Usenet season pack downloads, could be searched using [data-matching](./tutorials/data-based-matching.md) from a Sonarr TV Library but would not always perform searches "properly" due to the nested folder structures and lack of risky matching supporting multi-file searches.

```
My Show/
    Season 1/
        My Show.S01E01
        My Show.S01E02
```

We have enhanced the search capabilities to correctly identify series and individual seasons, where possible, in Sonarr's organized libraries - and with `matchMode: "risky"` or `"partial"` - can match season packs previously downloaded and imported from your Sonarr Library.

:::tip
It is recommended that you use the TRaSH naming scheme to perserve as much irrecoverable metadata as possible. You can find this relevant naming schemes [here for Sonarr](https://trash-guides.info/Sonarr/Sonarr-recommended-naming-scheme/) and [here for Radarr](https://trash-guides.info/Radarr/Radarr-recommended-naming-scheme/) if you are not already using it.

It is also **_REQUIRED_** that you use ["Season Folders"](https://wiki.servarr.com/en/sonarr/library) with your Sonarr Library.
:::

This also opens up the possibility of effectively cross-seeding season packs downloaded from usenet post import/completion. [bakerboy448 Arr Import script](https://github.com/bakerboy448/StarrScripts?tab=readme-ov-file#cross-seed-trigger-for-starr-apps) has now been updated to replicate the immediate "search, match, and cross-seed" behavior you can achieve with torrent downloads.

:::note
Strictly in Sonarr, you will need to update your script and _CHANGE_ your event types in your "Settings -> Connect -> Custom Script" to "On Import Complete."

**This only needs to be done in Sonarr, Radarr does not need to be changed.**
:::

### Other Miscellaneous Changes

Here is a short list of other changes made in v6. These are some of the behind-the-scenes updates made to improve `cross-seed`.

-   Updated to Node v20, ES2022, and TypeScript v5
-   Any indexer failures not related to rate limiting (status code: `429`) will be cleared from the database when `cross-seed` is restarted.
-   Regex improvements. Some trackers rename search results or have non-standard naming conventions. The updated regex takes more of those into account and should find more matches.
-   Improved logging messages, specifically around matching decisions.
-   There are now lists of files/folders integrated into `cross-seed` that are blocked during prefiltering at startup. These include folders present inside full-disc Bluray/DVD releases (BDMV/CERTIFICATE), individual music files, RAR archives, season (e.g. "Season 01") and main series/movie folders in Sonarr and Radarr libraries. Excluding these from the `cross-seed` index (for data-based searches) will result in fewer "bad" searches that would otherwise yield no viable results.
-   New recommended defaults in [`config.template.js`](https://raw.githubusercontent.com/cross-seed/cross-seed/master/src/config.template.cjs). These settings are what we consider to be the best starting options when setting up `cross-seed`.

## Extra

### Step-by-Step Guide

:::danger
Do **_NOT_** skip straight to this section. All the information covered on this page is important and can potentially cause disastrous consequences if ignored.
:::

-   Update your config to modify, add, and remove the options covered in the [breaking changes section](#breaking-changes-tldr).
-   Ensure you've read through this page and have updated your options to take advantage of the new capabilities and modified behavior.
-   Set [rssCadence](./basics/options.md#rsscadence) and [searchCadence](./basics/options.md#searchcadence) to `null`. Start `cross-seed` and correct any configuration errors that `cross-seed` displays.
-   Once `cross-seed` is running, check the verbose logs to ensure autobrr announces are not failing.
-   Finally, set your desired `rssCadence` and `searchCadence` and restart `cross-seed`.

### [`flatLinking`](./basics/options.md#flatlinking) Migration

:::caution
If for any reason you are hesitant or confused, please seek support via Discord or GitHub.
:::

If you've been using `flatLinking: true`, or are a legacy user upgrading, and would like to switch to the new linking structure in `cross-seed` v6, you can now migrate previously injected torrents and folder structures.

:::warning
ALWAYS MAKE YOUR OWN BACKUPS PRIOR TO RUNNING ANY SCRIPTS THAT MODIFY YOUR SETUP OR CONFIGURATION FILES.
:::

This is completely optional and an advanced procedure, do not attempt this if you're unfamiliar with terminal/ssh. These scripts are currently only written for `qBittorrent` and `Deluge`.

If you are willing, you can follow these as guidelines to implement for other clients and we'll add them here.

| Client       |
| ------------ | ------------------------------------------------------------------------------------------------ |
| `qBittorent` | [Gist link to latest version](https://gist.github.com/ShanaryS/6fbc60327ad5f7043c81e5b1f33da404) |
| `Deluge`     | [Gist link to latest version](https://gist.github.com/zakkarry/3f690bcd56bbfa00c4d72c97d24f2620) |
