---
id: partial-matching
sidebar_position: 3
title: Partial Matching
---

Partial matching is a new feature in cross-seed v6, designed to capture torrents
that are similar but may lack minor files, like `.nfo`, `.srt`, or `sample`
files. This method allows you to seed more torrents across multiple trackers
without needing a full 1:1 match for each file.

The key technology that unlocks partial matching is
[**linking files**](linking.md), which lets you seed two torrents that share a
big file like an `mkv`, while also keeping their own separate copies of small
files that don't match each other.

So, what's the outcome?

-   **More Matches**: Partial matching finds torrents even when small files are
    missing/mismatched.
-   **Fewer Wasted Snatches**: Many torrents that can't match under
    `matchMode: "safe"` (due to a "technicality") can and will match with
    partial matching, meaning the snatch doesn't go to waste.

### How Partial Matching Works

Partial matching relies on a new [`matchMode`](../basics/options.md#matchmode)
setting called `partial`. This mode matches torrents with a size close to (but
not exactly) your existing files. `cross-seed` uses the
[`fuzzySizeThreshold`](../basics/options.md#fuzzysizethreshold) to set a minimum
size for partial matches (default 0.05, allowing up to 5% size variance).

If a partial match is found, cross-seed will:

1. Inject the torrent with the matched files.
2. Recheck the torrent for missing files.
3. Leave the torrent paused. (Resuming partial injections is under development)

### Configuration Steps for Partial Matching

To enable partial matching, follow these three simple steps:

1. **Enable linking**

    Follow the instructions in the [linking](linking.md) guide to set up
    linking.

2. **Set `matchMode` to `partial`**

    Enable partial matching by setting the
    [`matchMode`](../basics/options.md#matchmode) option to `partial`.

    ```js
    module.exports = {
    	// ... other settings ...
    	matchMode: "partial",
    };
    ```

That's it! If you want to further customize partial matching, you can adjust the
[`fuzzySizeThreshold`](../basics/options.md#fuzzysizethreshold) option depending
on whether you are willing to incur more or less DL on partial matches.
