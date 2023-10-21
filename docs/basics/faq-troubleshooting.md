# FAQ & Troubleshooting

### What can I do about `error parsing torrent at http://…`?

This means that the Prowlarr/Jackett download link didn't resolve to a torrent file. It's
possible you got rate-limited so you might want to try again in a day or more.
Otherwise, just ignore it. There's nothing cross-seed will be able to do to fix
it.

### rtorrent injected torrents don't check (or start at all) until force rechecked

Remove any `stop_untied=` schedules from your .rtorrent.rc.

Commonly: `schedule2 = untied_directory, 5, 5, (cat,"stop_untied=",(cfg.watch),"*.torrent")`

### Failed to inject, saving instead.

Best way to start troubleshooting this is to check the `verbose.\*.log` and find this specific event.

You will be able to see the circumstances around the failure, and start investigating why this occurred.

### My data-based results are paused at 100% after injection

This is by design and due to the way data-based searches function. This is done to prevent automatically downloading
missing files or files that failed rechecking. Until there is a way to guarentee you won't end up downloading
extra (not cross-seeding) this is the best solution.

:::tip
Consider using `infoHash` if you are racing to prevent mismatches.
:::

### My data-based search is searching torrent files!

Torrent files in `torrentDir` take precedence over data files with the same name and are de-duplicated. If you need to search
specifically the `dataDirs`, use an empty directory for `torrentDir` temporarily. This will strictly search the data.

### `Error: ENOENT: no such file or directory`

This is usually caused by broken symlinks in, or files being moved or deleted from, your `dataDirs` during a data-based search.
Check the `/logs/verbose.\*.log` files for the file causing this.

:::tip
If you do not link files within your `dataDirs` or have them outside of the `maxDataDepth` visibility, this is preventable.

:::

### What `linkType` should I use? (data-based searching)

Your options are `"hardlink"` or `"symlink"`. These operate in seperate ways, and depending on your workflow you should choose appropriately. This is a brief description, however
a more in depth guide is available at [Trash's Hardlinking Guide](https://trash-guides.info/Hardlinks/Hardlinks-and-Instant-Moves/).

- symlinks are a "shortcut" of sorts, pointing at the original file from a new location. This can be used across mounts (docker) or partitions/drives, and does not cost you any extra space. The only possible issue is that if the original file is deleted (when you remove a torrent,) the torrents in your client using the `symlink` will "break" and you will receive errors. If this sounds like a hassle, consider reading further about hardlinks.

- hardlinks are a tricky thing for someone not familiar, but are worth understanding. They are a "direct line" to the actual data on the disk and are indistinguishable from the original to the file system. They do not require any space, but until all references are deleted, the file will exist on the disk. These linktypes are only possible on the same partition/disk/mount, and you will need to have your linkDir set to the same mount (docker) or partition. This is the best approach if you do not always keep the source torrent in your client (due to them being deleted from the tracker) - which would then break symlinks and cross-seeds. This is the approach commonly used in Arr's on import.

:::tip
If you are using qBittorrent, consider checking out [qbit_manage](https://github.com/StuffAnThings/qbit_manage) to manage your hardlinks eligible for deletion.

:::

### Searches aren't working from VPN'd torrent client

If you are running your searches on completion from a VPN'd torrent client, it is likely you will need to set up split tunneling. You will not be able to access your local instance (which should not be publicly exposed) from the VPN due to localhost/NAT not being accessible from the VPN. If you are running a VPN'd torrent client in docker, you can use your cross-seed's container IP or name (if using custom docker networks).

### Searching media libraries vs. torrent data (data-based searching)

You can search both your media libraries (Arr/Plex) and actual torrent data (downloaded files). If you are using the media libraries with renamed files, you will need to use `matchMode: "risky"` in your configuration file to allow cross-seed some leeway in its matching process. `"risky"` `matchMode` is not recommended to be used without skipRecheck set to false, as it could result in more false positives than `"safe"`.

- Due to the way data-based searching works, risky matching only matches renamed files if they are a single-file torrent. As TV libraries often include renamed files, data-based matching will not be able to pick up matches on multi-file torrents (such as season packs).

### My season packs are cross-seeding individual episodes!

You can use `includeSingleEpisodes`, which expands from `includeEpisodes`. If you wish to search for season packs as a whole and individual episodes _not_ from a season pack, you will need to set `includeEpisodes` to false, and `includeSingleEpisodes` to true. Both options would be best utilized with `includeNonVideos` set to true.

### Why do I see `filetree is different` in my logs?

This is a result of the matching algorithm used by `cross-seed`, and is most commonly associated with a few scenarios. These include the presence of additional .nfo/.srt files in a torrent, differences in the organization of files (one torrent having a folder while the potential match does not, or vice versa), and discrepancies in the filenames within the torrent.

:::tip
You can utilize the [`cross-seed diff`](../reference/utils#cross-seed-diff) command to compare the torrents.
:::

### My tracker is mad at me for snatching 1000000 .torrent files!

`cross-seed` currently searches for potential matches and compares the contents and size of files within, it is possible you are running searches too often, are not keeping the torrent_cache folder, or are improperly utilizing [**autobrr**](https://autobrr.com/).

We try to reduce unnecessary snatches of .torrent files as much as possible, but because we need to compare files inside the torrent as well as their sizes, it is sometimes unavoidable.

### Recommended Overall Improvements

- You can use the `announce` endpoint instead of `webhook` to match what cross-seed already knows about your available media.
- If using [**autobrr**](https://autobrr.com/), consider setting up filters with [**omegabrr**](https://github.com/autobrr/omegabrr) to minimize calls to cross-seed
- Adjust `excludeRecentSearch` `excludeOlder` and `searchCadence` to reduce searching
- If your cross-seed runs 24/7, consider reducing or eliminating searching. RSS is capable of catching all releases if 24/7.
