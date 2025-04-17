---
id: tracker-impact
title: Impact on Trackers
---

Automatic cross-seeding is a relatively new practice, and while it brings some
benefits for trackers, it also has some drawbacks. In this doc, we will outline
the benefits and drawbacks, then discuss strategies you can use to minimize
`cross-seed`'s footprint.

## Benefits

The benefits a tracker sees from automatic cross-seeding largely center around
retention. Having more seeders leads to healthier swarms, longer retention, and
fewer dead torrents.

It is particularly helpful for new trackers looking to build a catalog—often,
backfill uploads are not particularly well-seeded because the users have already
downloaded them from elsewhere. But any `cross-seed` users will automatically
pick up the new releases and reliably seed them, increasing redundancy.

## Drawbacks

Private BitTorrent trackers are small-budget hobby software projects that run on
donations and the good will of the sysop. They do not run on infrastructure like
Google's or Amazon's, and they cannot support infinite load.

Automatic cross-seeding causes **more load on trackers than any previous form of
automation** (e.g. Sonarr). We, and the tracker administrators we've spoken to,
believe the benefits outweigh the drawbacks. However, not all trackers hold the
same opinions, and we haven't spoken to all of them.

:::info What is "load"?

We can break **load** into 4 distinct actions that `cross-seed` (and all other
tracker automation) performs:

### RSS requests

-   These are performed by [`rssCadence`](../basics/options.md#rsscadence) and
    [`cross-seed rss`](./utils.md#cross-seed-rss).
-   `cross-seed` initiates an RSS request by searching with an empty query.
    These are usually cached and updated regularly, so the tracker's server is
    sending you a precomputed file.
-   These are cheap in both compute and network I/O.

### Search requests

-   These are performed by [`searchCadence`](../basics/options.md#searchcadence),
    [`cross-seed search`](./utils.md#cross-seed-search), and
    [`webhook searches`](../tutorials/triggering-searches.md).
-   `cross-seed` searches for movie and TV show names individually.
-   The tracker's server has to scan through its catalog looking for releases
    with similar names.
-   These are expensive in compute, but cheap in network I/O. Using
    [`id-searching`](../tutorials/id-searching.md) not only yields far better
    results but is also a lighter load on the tracker database.

### Announce requests

-   These are performed by [`Announce Matching`](../tutorials/announce.md).
-   A tool such as [`autobrr`](https://autobrr.com/) uses IRC to listen for
    announces from the tracker and then sends them to `cross-seed`.
-   This has zero load on the tracker since they create the announce once and
    publish it in the IRC channel for everyone to see, regardless of the number
    of users. Only the snatches from announce create load on the tracker, if it
    passes `cross-seed`'s pre-snatch checks.
-   These are completely free in network I/O and compute.

### Snatches

-   `cross-seed` will snatch any torrent that has the same release group,
    source, resolution, and rough size as your owned torrent.
-   The tracker's server has to add your passkey to its stored copy of the
    torrent file, then send it to you (and it's often quite big—a few
    megabytes).
-   These are expensive in network I/O (and maybe memory), but cheap in compute.
-   Some trackers count snatches for their user rank systems, and snatching many
    unnecessary torrents may be seen as abuse.

:::

## How `cross-seed` Minimizes Load on Trackers

`cross-seed` is designed with these drawbacks in mind. While it's a tool for
users, it should be as friendly as possible to trackers.

### Category-aware searching

`cross-seed` queries each indexer for the media
[Torznab categories](https://inhies.github.io/Newznab-API/categories/#predefined-categories)
it supports, and skip searching for any media type the indexer doesn't carry.
This heavily reduces "useless" searches and makes it more feasible to use
`cross-seed` with non-video trackers.

### Preventing repetition

Similar [search requests](#search-requests) are grouped together in a run and
share the results if applicable. This prevents duplicate queries for searchees
that differ only by release group, source, resolution, etc. These results are
not cached long term as they can change over time.

`cross-seed` also caches the [snatches](#snatches) it makes. This means on
subsequent searches, `cross-seed` will never snatch the same torrent twice—the
biggest load on a tracker.

### Parsing bad titles

`cross-seed` will parse bad titles to add aditional information to the search
query. For example, a torrent titled "Season 1" could be parsed to "Show S1" if
the information is available within its files. Similarly for
[`data-based searches`](../tutorials/data-based-matching.md), `cross-seed` can
parse the standard Sonarr and Radarr folder structures for more meaningful
searches. It will also outright reject searches that cannot be salvaged.

## How `cross-seed`'s Default Settings Minimize Load on Trackers

For applicable options, `cross-seed` limits the values to prevent badly
configured setups which harms both the user and the trackers. The default
configuration also aims to minimize load by being selective about which
torrents it searches, and by working through its backlog slowly.

### Delay between searches

As of version 6, `cross-seed` enforces a minimum 30 second
[`delay`](../basics/options.md#delay) between individual
[search requests](#search-requests) during any bulk search. This only applies
to bulk searches, not between each
[webhook-triggered search](../tutorials/triggering-searches.md).

### Preventing unnecessary searches

`cross-seed` enforces that you have configured the
[`excludeRecentSearch`](../basics/options.md#excluderecentsearch) and
[`excludeOlder`](../basics/options.md#excludeolder) options, and its defaults
are set such that `cross-seed` will search for things recently downloaded a few
times, but only search once for things downloaded far in the past. These
settings will build your backlog of cross-seeds, and sufficiently catch new
releases trickling to other trackers.

### Skipping episodes

It's usually not worth it to bother cross-seeding episodes since they will be
deleted in the near future (when season packs come out). By default,
`cross-seed` skips episode torrents for `search` and `rss` with
[`includeSingleEpisodes: false`](../basics/options.md#includesingleepisodes).
However for [`Webhook Triggered Searches`](../tutorials/triggering-searches.md)
and [`Announce Matching`](../tutorials/announce.md), `cross-seed` treats these
differently since these are triggered on a new download or upload, meaning a
season pack is unlikely to be available.

Similarly, `cross-seed` will not search individual episodes from a season pack
as these are likely [trumped/dead](../v6-migration.md#removed-includeepisodes).

If you are racing or never download season packs, and would like to **turn on**
episode searches, **set
[`includeSingleEpisodes: true`](../basics/options.md#includesingleepisodes)**.

:::caution

There are TV shows that are not combined into season packs, such as game shows,
talk shows, and similar. These shows are known as dailies and often have naming
which specifies dates, rather than SeasonEpisode (S02E03) style. Searching with
`includeSingleEpisodes` and using `flexible` or `parital` matchMode on these
torrents, or files, can result in _many torrent files being downloaded_ for
comparisons for matching only _one individual episode_.

Remember, this would occur on just one (torrent) search, within the entire (all
data) search.

:::

### Skipping torrents with significant unknown/extra files

This behavior is covered in detail
[`here`](../v6-migration.md#updated-includenonvideos-behavior).

### Limiting search volume

By default, `cross-seed` only make 400 [search requests](#search-requests) from
your backlog per day. This is measured by the number of unique search queries
that `cross-seed` makes per run. We do this for a few reasons:

-   It eases you into the process of cross seeding. This limit is only
    consequential when first starting out.
-   If you have a high `excludeRecentSearch` of one year for example, intending
    to do a rolling daily search of the torrents that were last searched a year
    ago, torrent searches will "bunch up" once a year (depending on when you
    first set up `cross-seed`) to be searched back to back, potentially causing
    rate limiting problems for your other automations due to the high search
    volume (Sonarr, Radarr, etc.).
-   Long-lived bulk search runs encounter **drift** - while they run, your other
    automations will be downloading new torrents, moving data files around, and
    deleting torrents and/or data files, and the snapshot `cross-seed` took of
    your torrents at the beginning of the search goes out of date. Keeping bulk
    search runs short helps a lot.

You may have an **instant gratification mindset**, and we get it! Seeing your
total number of cross-seeds and your final seed size on a tracker is exciting.
With that said, please try to balance that mindset with being friendly to your
trackers.

The important thing is that you seed for a long time - not that you start
seeding as early as possible.

This is configurable with [`searchLimit`](../basics/options.md#searchlimit).