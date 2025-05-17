---
id: partial-matching
sidebar_position: 3
title: Partial Matching
---

Partial matching is a new feature in cross-seed v6, designed to capture torrents
that are similar but may lack minor files, like `.nfo`, `.srt`, or `sample`
files. This method allows you to seed more torrents across multiple trackers
without needing to have all files.

The key technology that unlocks partial matching is
[**linking files**](linking.md), which lets you seed two torrents that share a
big file like an `mkv`, while also keeping their own separate copies of small
files that don't match each other.

So, what's the outcome?

- **More Matches**: Partial matching finds torrents even when small files are
  missing/mismatched often doubling the amount of cross seeds found. Using this
  mode will find all possible cross seeds from your data.
- **Fewer Wasted Snatches**: Many torrents that can't match under
  `matchMode: "strict"` (due to a "technicality") can and will match with
  partial matching, meaning the snatch doesn't go to waste.

:::tip

Combine partial matching with
[`seasonFromEpisodes`](../basics/options.md#seasonfromepisodes) to cross seed
season packs even if you're missing individual episodes!

:::

### How Partial Matching Works

Partial matching relies on a new [`matchMode`](../basics/options.md#matchmode)
setting called `partial`. This mode only requires some files to match instead of
all. `cross-seed` uses the
[`fuzzySizeThreshold`](../basics/options.md#fuzzysizethreshold) to set a minimum
size for partial matches (default 0.02, allowing up to 2% size variance).

If a partial match is found, cross-seed will:

1. Inject the torrent with the matched files.
2. Recheck the torrent for missing files.
3. Resume according to
   [`autoResumeMaxDownload`](../basics/options.md#autoresumemaxdownload) and
   [`ignoreNonRelevantFilesToResume`](../basics/options.md#ignorenonrelevantfilestoresume).

:::info Note

Nearly all partial matches will have the existing files at 99.9% instead of
100% after rechecking. This is expected and is due to how torrent piece hashing
works.

:::

### Configuration Steps for Partial Matching

:::tip

[**What should I do after updating my config?**](../basics/faq-troubleshooting.md#what-should-i-do-after-updating-my-config)

[**How to avoid downloading the same missing data on multiple trackers?**](../basics/faq-troubleshooting.md#my-partial-matches-from-related-searches-are-missing-the-same-data-how-can-i-only-download-it-once)

:::

To enable partial matching, follow these steps:

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

3. **Configure `partial` range and auto resume**

    You can adjust the
    [`fuzzySizeThreshold`](../basics/options.md#fuzzysizethreshold),
    [`autoResumeMaxDownload`](../basics/options.md#autoresumemaxdownload), and
    [`ignoreNonRelevantFilesToResume`](../basics/options.md#ignorenonrelevantfilestoresume)
    options depending on whether you are willing to incur more or less DL on
    partial matches.

    ```js
    module.exports = {
    	// ... other settings ...
    	fuzzySizeThreshold: 0.1,
    	autoResumeMaxDownload: 52428800,
    	ignoreNonRelevantFilesToResume: true,
    };
    ```

4. **Set `seasonFromEpisodes` below `1`** _(optional)_

    If you want to cross seed season packs even if you're missing individual
    episodes, set
    [`seasonFromEpisodes`](../basics/options.md#seasonfromepisodes) to a value
    below `1`. To avoid downloading the same missing episodes on multiple
    trackers, please read this
    [FAQ](../basics/faq-troubleshooting.md#my-partial-matches-from-related-searches-are-missing-the-same-data-how-can-i-only-download-it-once).

    ```js
    module.exports = {
    	// ... other settings ...
    	seasonFromEpisodes: 0.5,
    };
    ```
