---
id: data-based-matching
sidebar_position: 4
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

1.  Set up linking as described in the [linking tutorial](../basics/linking.md).

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

    In this example, with a `dataDir` of `/TV`, we would likely want to set
    `maxDataDepth` to 2.

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
    [partial matching](../tutorials/partial-matching.md).

## Daemon mode

Data-based matching does not support RSS but does allow you to
[hit the cross-seed webhook endpoint with a path](../reference/api.md#post-apiwebhook)
to use for data-based searching the same way you use the existing `infoHash`
parameter (but with `path`).
