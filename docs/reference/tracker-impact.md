---
id: tracker-impact
title: Impact on Trackers
---

Automatic cross-seeding is a relatively new practice, and while it brings some
benefits for trackers, it also has some drawbacks. In this doc, we will outline
the benefits and drawbacks, then discuss strategies you can use to minimize
`cross-seed`'s footprint.

### Benefits

The benefits a tracker sees from automatic cross-seeding largely center around
retention. Having more seeders leads to healthier swarms, longer retention, and
fewer dead torrents.

It is particularly helpful for new trackers looking to build a catalog—often,
backfill uploads are not particularly well-seeded because the users have already
downloaded them from elsewhere. But any `cross-seed` users will automatically
pick up the new releases and reliably seed them, increasing redundancy.

### Drawbacks

Private BitTorrent trackers are small-budget hobby software projects that run on
donations and the good will of the sysop. They do not run on infrastructure like
Google's or Amazon's, and they cannot support infinite load.

Automatic cross-seeding causes **more load on trackers than any previous form of
automation** (e.g. Sonarr). We, and the tracker administrators we've spoken to,
believe the benefits outweigh the drawbacks. However, not all trackers hold the
same opinions, and we haven't spoken to all of them.

:::info What is "load"?

We can break **load** into 3 distinct actions that `cross-seed` (and all other
tracker automation) performs:

#### RSS requests

-   `cross-seed` initiates an RSS request by searching with an empty query.
    These are usually cached and updated regularly, so the tracker's server is
    sending you a precomputed file.
-   These are cheap in both compute and network I/O, so we generally don't worry
    about them.

#### Search requests

-   `cross-seed` searches for movie and TV show names individually.
-   The tracker's server has to scan through its catalog looking for releases
    with similar names.
-   These are expensive in compute, but cheap in network I/O.

#### Snatches

-   `cross-seed` will snatch any torrent that has the same release group,
    source, resolution, and rough size as your owned torrent.
-   The tracker's server has to add your passkey to its stored copy of the
    torrent file, then send it to you (and it's often quite big—a few
    megabytes).
-   These are expensive in network I/O (and maybe memory), but cheap in compute.
-   Some trackers count snatches for their user rank systems, and snatching many
    unnecessary torrents may be seen as abuse.

:::

## How `cross-seed`'s Default Settings Minimize Load on Trackers

As of version 6, `cross-seed`'s default configuration aims to minimize load by
being selective about which torrents it searches, and by working through its
backlog slowly.
[See the latest default config file.](https://github.com/cross-seed/cross-seed/blob/master/src/config.template.cjs)

### Skipping episodes

It's usually not worth it to bother cross-seeding episodes since they will be
deleted in the near future (when season packs come out). By default,
`cross-seed` skips episode torrents.

If you are racing or never download season packs, and would like to **turn on**
episode searches, **set
[`includeSingleEpisodes`](../basics/options.md#includesingleepisodes) to
`true`**.

:::caution

There are TV shows that are not combined into season packs, such as game shows,
talk shows, and similar. These shows are known as dailies and often have naming
which specifies dates, rather than SeasonEpisode (S02E03) style. Searching with
`includeSingleEpisodes` and using `risky` on these torrents, or files, can
result in _many torrent files being downloaded_ for comparisons for matching
only _one individual episode_.

Remember, this would occur on just one (torrent) search, within the entire (all
data) search.

:::

### Skipping torrents with unknown/extra files

Torrents that are "purely" video files are the most likely to find matches. By
default, `cross-seed` restricts searches to just these torrents.

This excludes anything that is not movie or TV content, but will also exclude
anything that contains `.nfo`, `.srt`, `.txt` or other non-video files, even if
the primary file is a video file. This is restrictive, but it works well with
[`matchMode: "safe"`](../basics/options.md#matchmode) because it only allows the
torrents most likely to find perfect matches.

If you enable [Partial Matching](../tutorials/partial-matching.md), you should
**set [`includeNonVideos`](../basics/options.md#includenonvideos) to `true`**
because the partial matching algorithm can handle the extra files.

### Backlog searching 100 items per day

By default, `cross-seed` only searches 100 items from your backlog per day. We
do this for a few reasons:

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

### Preventing Repetitive Searches

`cross-seed` caches the snatches it makes, but does not cache search results as
they can change over time.

For this reason, `cross-seed` enforces that you have configured the
`excludeRecentSearch` and `excludeOlder` options, and its defaults are set such
that `cross-seed` will search for things recently downloaded a few times, but
only search once for things downloaded far in the past. These settings will
build your backlog of cross-seeds, and sufficiently catch new releases trickling
to other trackers.

### Pausing between searches

As of version 6, `cross-seed` enforces a minimum 30 second pause between
individual searches during any bulk search. This only applies to bulk searches,
not [webhook-triggered searches](../tutorials/triggering-searches.md).
