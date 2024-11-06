# Partial Matching

Partial matching is a new feature in cross-seed v6, designed to capture torrents
that are similar but may lack minor files, like `.nfo`, `.srt`, or `sample`
files. This method allows you to seed more torrents across multiple trackers
without needing a full 1:1 match for each file.

The key technology that unlocks partial matching is **linking files**, which
lets you seed two torrents that share a big file like an `mkv`, while also
keeping their own separate copies of small files that don't match each other.

So, what's the outcome?

-   **More Matches**: Partial matching finds torrents even when small files are
    missing/mismatched.
-   **Fewer Wasted Snatches**: Many torrents that can't match under
    `matchMode: "safe"` (due to a "technicality") can and will match with
    partial matching, meaning the snatch doesn't go to waste.

### How Partial Matching Works

Partial matching relies on a new [`matchMode`](../basics/options.md#matchmode)
setting called `partial`. This mode matches torrents with a size close to (but
not exactly) your existing files. cross-seed uses the
[`fuzzySizeThreshold`](../basics/options.md#fuzzysizethreshold) to set a minimum
size for partial matches (default 0.05, allowing up to 5% size variance).

If a partial match is found, cross-seed will:

1. Inject the torrent with the matched files.
2. Recheck the torrent for missing files.
3. Leave the torrent paused. (Resuming partial injections is under development)

### Configuration Steps for Partial Matching

To enable partial matching, follow these three simple steps:

1.  **Set `linkDir`**

    Define a directory where `cross-seed` will create links to your existing
    files. This directory should be accessible to your torrent
    client—`cross-seed` will use the `linkDir` as the save path for the partial
    torrents it injects.

    ```js
    module.exports = {
    	// ... other settings ...
    	linkDir: "/path/to/linkDir",
    };
    ```

2.  **Set `matchMode` to `partial`**

    Enable partial matching by setting the `matchMode` option to `partial`.

    ```js
    module.exports = {
    	// ... other settings ...
    	matchMode: "partial",
    };
    ```

3.  **For Docker Users**: there are a few more specific requirements for linking
    to work properly.

    -   Your torrent client will need access to the `linkDir` you've set, seeing
        the same path `cross-seed` sees.
    -   `cross-seed`'s container needs to be able to see the **original data
        files**, again at the same path that your torrent client sees.
    -   If you are using **hardlinks**, these paths all need to be _within the
        same docker volume_.

    In practice, this means that you should mount a **common ancestor path** of
    the original data files _and_ your `linkDir`.

That's it! For further customization, such as adjusting the size threshold for
partial matches, check the following options:

-   [`fuzzySizeThreshold`](../basics/options.md#fuzzysizethreshold) if you want
    looser/tighter partial matching
-   [`linkType`](../basics/options.md#linktype) (choose between `hardlink` and
    `symlink`)
-   [`flatLinking`](../basics/options.md#flatlinking) if needed (not recommended
    for new users)
-   [**What linkType should I use?**](../basics/faq-troubleshooting.md#what-linktype-should-i-use)
    for more information about hardlinks and symlinks
