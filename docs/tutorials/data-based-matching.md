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
This can be used to:

-   recover torrent files from a data catalog after data loss
-   seed Usenet downloads or other content you have acquired elsewhere

## Setting up data-based matching

1.  Set up linking as described in the [linking tutorial](linking.md).

2.  Set [`dataDirs`](../basics/options.md#datadirs) to the directories
    containing the data you want to cross-seed.

3.  Set [`maxDataDepth`](../basics/options.md#maxdatadepth) to the maximum depth
    to traverse the file tree for generating searchees. If you specify a
    `dataDir` of `/data/torrents`, the depth is as follows. In this example, we
    would likely want to set `maxDataDepth` to 1.

    ```
    data/
    ├─ torrents/                  # 0
    │  ├─ torrent_name/           # 1
    │  |  ├─ torrent_file.mkv     # 2
    │  |  ├─ torrent_subfolder    # 2
    │  |  |  ├─ torrent_item.mkv  # 3
    ```

    In this example, with a `dataDir` of `/TV`, we would need to set
    `maxDataDepth` to 3 if using [`seasonFromEpisodes`](../basics/options.md#seasonfromepisodes)
    or [`includeSingleEpisodes`](../basics/options.md#includesingleepisodes).
    If you are using neither, then a value of 2 is more appropriate.

    ```
    TV/                     # 0
    ├─ Show/                # 1
    │  ├─ Season 1/         # 2
    │  |  ├─ Episode 1.mkv  # 3
    │  |  ├─ Episode 2.mkv  # 3
    ```

    Be careful setting this to a higher value than 2 (if the dataDir is your
    torrents folder), else it might generate a larger than intended number of
    searchees that will not realistically get many matches.

4.  If you are trying to cross-seed data that has been renamed or whose names
    don't match standard torrent release naming schemes, set your
    [`matchMode`](../basics/options.md#matchmode) to `risky`, or if you want
    even looser matching, consider setting up
    [partial matching](partial-matching.md).
