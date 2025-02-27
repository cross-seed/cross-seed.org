---
id: data-based-matching
sidebar_position: 7
title: Data-Based Matching
---

## Why?

**Torrent-based matching** relies on `.torrent` files to be able to search for
cross-seeds. In this method, it analyzes the list of files stored in the
`.torrent` file and searches your trackers for similar files. If the files found
from the remote torrent (candidate) match the local torrent (searchee), this is
a match.

**Data-based matching** allows cross seed to not require the `.torrent` file,
and instead to look at actual data files on disk to search for matches. This is
great if you have the actual files to cross-seed, but not the `.torrent` files.

Torrent-based matching will take priority over data-based when they are equivalent.
Torrent-based is more robust, and prevents some performance issues with `dataDirs`
wherein `cross-seed` has to frequently scan your `dataDirs` and watch all of their
children for changes.

## General Usage for [`dataDirs`](../basics/options.md#datadirs)

Most users will not need to use `dataDirs`. You should only use `dataDirs` if:

1. You are downloading through Usenet or other non-torrent methods in order to
   match new content not present in your torrent client.

2. You have content in your media or data directories that is not already
   present in your torrent client. In this scenario, you only need to perform a
   search with `dataDirs` **once**. After the initial search, you should remove
   the directories from `dataDirs` entirely.

3. You want to cross seed from `TorrentClientA` to `TorrentClientB`. In this case,
   you can set `dataDirs` to the path of the downloaded data (e.g `/data/torrents/tv`)
   in `TorrentClientA`, and configure `cross-seed` with `TorrentClientB` only.
   This will likely create duplicate torrents seeding in both clients, ensure you will
   be following your tracker's rules.

## Setting up data-based matching

:::info WINDOWS USERS

[**It is necessary to insert double-slashes for your paths, back-slashes are "escape characters" and "\\\\" equates to "\\".**](../basics/faq-troubleshooting.md#windows-paths)

:::

:::tip

[**What should I do after updating my config?**](../basics/faq-troubleshooting.md#what-should-i-do-after-updating-my-config)

:::

1.  Set up linking as described in the [linking tutorial](linking.md).

2.  If you are trying to cross-seed data that has been renamed or whose names
    don't match standard torrent release naming schemes, set your
    [`matchMode`](../basics/options.md#matchmode) to `flexible`, or if you want
    all matches, consider setting up [partial matching](partial-matching.md).

3.  Set [`dataDirs`](../basics/options.md#datadirs) and [`maxDataDepth`](../basics/options.md#maxdatadepth)
    to inform `cross-seed` on where to generate searchees. Here are some examples of common structures
    and their optimal configuration. If multiple apply, set `maxDataDepth` to the highest value.

```
data/
├─ usenet/
│  ├─ movies/       # 0
│  |  ├─ Movie.mkv  # 1

dataDirs: ["/data/usenet/movies", ...],
maxDataDepth: 1,
```
```
data/
├─ torrents/
│  ├─ tv/                        # 0
│  |  ├─ Show S01/               # 1
│  |  |  ├─ Episode 1.mkv        # 2
│  |  |  ├─ Subtitles            # 2
│  |  |  |  ├─ Episode 1.srt     # 3

dataDirs: ["/data/torrents/tv", ...],
maxDataDepth: 1, # cross-seed will ignore season pack episodes even if set to 2 or more
```
```
data/
├─ radarr/          # 0
│  ├─ Movie/        # 1
│  |  ├─ Movie.mkv  # 2

dataDirs: ["/data/radarr", ...],
maxDataDepth: 2, # cross-seed will not search 'Movie/' itself, using a value of 1 will do nothing
```
```
data/
├─ sonarr/                 # 0
│  ├─ Show/                # 1
│  |  ├─ Season 1/         # 2
│  |  |  ├─ Episode 1.mkv  # 3

dataDirs: ["/data/sonarr", ...],
maxDataDepth: 2, # use 3 if using seasonFromEpisodes or includeSingleEpisodes (note: cross-seed will not search 'Show/' itself)
```
