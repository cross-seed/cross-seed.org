---
id: data-based-matching
sidebar_position: 2
title: Data Based Matching
---

## Why?

Before data based matching, cross-seed relied on having torrent files to be able to search for cross seeds. In this method, it analyzes the list of files stored in the `.torrent` file and searches your trackers for similar files. If the files found from the remote torrent (candidate) match the local torrent (searchee), this is a compatible cross-seed. To determine if the files match, the files in the candidate must be a subset of the searchee, and contain the exact same name and size as those in the searchee.

Data based matching allows cross seed to not require the `.torrent` file, and instead to look at actual files to search for matches. This is great if you have the actual files to cross-seed, but not the `.torrent` files (think usenet). It still generates a searchee, but the method by which it generates is different. For one, `.torrent` based searchees are limited to the top level directory if a torrent file contains a folder. Data based searching can create this same searchee, but can also traverse into the folder to generate a searchee from an individual file within the folder. This allows cross-seed to take a searchee with a single nested file:
```
torrent_name/
├─ torrent_file.mkv
```
and separately match a single file torrent for `torrent_file.mkv`

Due to using file system links, data based matching also opens the door for "risky" matching where the name of the searchee can be ignored and only file size is used, with a couple of caveats: 1) false positives are possible with this method, so it is recommended that you have cross-seed recheck torrents added during risky matching, and 2) risky matching only finds extra results for single-file searchees.

## Setup

Data based matching adds a few parameters:

`dataDirs`: This specifies what directories cross-seed should generate searchees from. They are specified as an array, for example `["/data/torrents/", "/data/media/"]` similar to the existing `torznab` parameter.

`linkDir`: This specifies where you want your links cross-seed generates to be placed. While technically possible to specify the same directory as your dataDirs, this is not recommended and could result in bad interactions between existing and new files. Instead it should be a separate directory visible to both your torrent client and cross-seed.

`linkType`: Either `hardlink` or `symlink`. We recommend symlinks, as if a source is removed for a hardlink, the new link still takes up space which is probably not desireable. If a symlink's source is removed, it's merely a broken symlink taking up basically no space on your file system. However, hardlinks are more flexible if you have a solution to this. For hardlinks, only the linkDir will need to be visible (with a matching path mapping) to your torrent client, whereas for symlinks both the linkDir and all specified dataDirs need to be visible with matching path mappings to your torrent client.

`matchMode`: Either `safe` or `risky` for the time being. As explained above, `risky` matches only using file sizes. `safe` uses the existing method of name + file sizes.

`skipRecheck`: Currently only works in qBittorrent. If set to false, cross-seed will inject the torrent as paused and tell qBitorrent to recheck the torrent contents. This is recommended with `matchMode: "risky"` due to potential false positives. As of 5.0.2 this applies to all torrents added, not just those found by data based matching. This will change in a later revision.

`maxDataDepth`: Determines how deep to traverse the file tree for generating searches. If you specify a dataDir of `/data/torrents`, the depth is as follows:

```
data/
├─ torrents/                 # 0
│  ├─ torrent_name/          # 1
│  |  ├─ torrent_file.mkv    # 2
│  |  ├─ torrent_subfolder   # 2
│  |  |  ├─ torrent_item.mkv # 3
```
Be careful setting this to a higher value than 2 (if the dataDir is your torrents folder), else it might generate a larger than intended number of searchees that will not realistically get many matches.

## Why linking?

Linking (and thus the linkDir) allows cross-seed to add torrents which do not have the same name or structure as the original torrent. While qBittorrent supports renaming of files within the torrent, this is not supported on all clients so linking is generally a more robust solution.

*All* matches found will be linked into the linkDir, even perfect matches. If a file already exists in the linkDir with the same name, cross-seed will not overwrite the file. This means that using the same linkDir as dataDir *should* be possible but is not something we encourage.

Eventually this can be taken further than it is now. Cross-seed could eventually make per-match directories, allowing for partial matches of torrents without the risk colliding files (no need to worry about differing nfos between two torrents).

Links also allow us to "normalize" the depth of matches. If a match is found at dataDepth 2, it can be linked up to be at depth 1 in the link dir, so that all your files found with data based matching have the same save path, matching the linkDir. This will let it play nicer with autoTMM if your setup heavily involves that.

## Daemon mode

Data based matching does not support RSS but does allow you to hit the cross-seed endpoint with a path to use for data based searching the same way you use the existing `name` parameter (but `path` instead), for example from a *arr post import script.
