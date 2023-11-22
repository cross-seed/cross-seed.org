# FAQ & Troubleshooting

### General Suggestions

- Adjust [`excludeRecentSearch` `excludeOlder` and `searchCadence`](./daemon.md#set-up-periodic-searches) to reduce searching indexers needlessly.
- If cross-seed runs continuously with an [`rssCadence`](./options.md#rsscadence), consider reducing the frequency of, or eliminating, searching via [`searchCadence`](./options.md#searchcadence). RSS is capable of catching all releases if ran 24/7.
- The log files in `/logs` - specifically `verbose.*.log` - are your friend. If you experience undesired results from `cross-seed`, look to these files first for indicators of why `cross-seed` performed the way it did.

### What can I do about `error parsing torrent at http://…`?

This means that the Prowlarr/Jackett download link didn't resolve to a torrent file. It's
possible you got rate-limited so you might want to try again later.
Otherwise, just ignore it. There's nothing cross-seed will be able to do to fix
it.

### Why do I get `Unsupported: magnet link detected at…`?

`cross-seed` does not support the usage of magnet links. If your indexer supports torrent files you will need to switch your settings.

### rtorrent injected torrents don't check (or start at all) until force rechecked

Remove any `stop_untied=` schedules from your .rtorrent.rc.

Commonly: `schedule2 = untied_directory, 5, 5, (cat,"stop_untied=",(cfg.watch),"*.torrent")`

### Failed to inject, saving instead.

Best way to start troubleshooting this is to check the `logs/verbose.*.log` and find this specific event.

You will be able to see the circumstances around the failure, and start investigating why this occurred.

### My data-based results are paused at 100% after injection

This is by design and due to the way data-based searches function. This is done to prevent automatically downloading
missing files or files that failed rechecking. Until there is a way to guarantee you won't end up downloading
extra (not cross-seeding) this is the best solution.

Alternatively, if you wish for torrents to not inject in a paused state, you can enable `skipRecheck` in the config
file, and this will instead Error on missing/incomplete files.

:::tip
Consider using `infoHash` if you are racing to prevent mismatches.
:::

### My data-based search is searching torrent files!

Torrent files in [`torrentDir`](./options.md#torrentdir) take precedence over data files with the same name and are de-duplicated. If you need to search
specifically the [`dataDirs`](./options.md#datadirs), use an empty directory for [`torrentDir`](./options.md#torrentdir) temporarily. This will strictly search the data.

### Error: ENOENT: no such file or directory

This is usually caused by broken symlinks in, or files being moved or deleted from, your [`dataDirs`](./options.md#datadirs) during a data-based search.
Check the `/logs/verbose.*.log` files for the file causing this.

:::tip
If you do not link files within your `dataDirs` or have them outside of the [`maxDataDepth`](../tutorials/data-based-matching.md#setup) visibility, this is preventable.

:::

### What [`linkType`](./options.md#linktype) should I use? (data-based searching)

Your options are `"hardlink"` or `"symlink"`. These operate in seperate ways, and depending on your workflow you should choose appropriately. This is a brief description, however
a more in depth guide is available at [Trash's Hardlinking Guide](https://trash-guides.info/Hardlinks/Hardlinks-and-Instant-Moves/).

- symlinks are a "shortcut" of sorts, pointing at the original file from a new location. This can be used across mounts (Docker) or partitions/drives, and does not cost you any extra space. The only possible issue is that if the original file is deleted (when you remove a torrent,) the torrents in your client using the `symlink` will "break" and you will receive errors. If this sounds like a hassle, consider reading further about hardlinks.

- hardlinks are a tricky thing for someone not familiar with the concept but are worth understanding. They are a "direct line" to the actual data on the disk and, as far as the file system is concerned, are indistinguishable from the original. Hardlinks do not require any additional space and the file will remain on the disk until all references to said file are deleted. These linktypes are only possible on the same partition/disk/mount, and you will need to have your [`linkDir`](./options.md#linkdir) set to the same mount (Docker) or partition as your [`dataDirs`](./options.md#datadirs). This is the best approach if you do not always keep the source torrent in your client (due to them being deleted from the tracker) - which would then break symlinks and cross-seeds. This is the approach commonly used in Arr's on import.

:::tip
If you are using qBittorrent, consider checking out [qbit_manage](https://github.com/StuffAnThings/qbit_manage) to manage your hardlinks eligible for deletion.

:::

### I can't reach my Prowlarr/Jackett/cross-seed/torrent client (Using Docker/VPN)

If you are using [Docker](./getting-started#with-docker), you cannot use `localhost` as an address to communicate across containers. Consider using your host's local IP address (usually a 192 or 10 address) or the container name (if using a "Custom Docker Network").

If your setup is running with a VPN, you will need to either

1. Set up split tunneling
2. Try to use the Docker network addresses as your instance hostnames
3. Address the routing of local/internal traffic in your VPN configuration

:::info
There is no need to put cross-seed behind a VPN, all of its requests are directly made to the torrent client or Jackett/Prowlarr.
:::

Generally, you won't be able to access local instances from services utilizing a VPN since localhost/LAN is not accessible from the VPN network by default.

:::danger
`cross-seed` does _not_ have API auth.
**Do not expose its port to untrusted networks (such as the Internet).**
:::
:::tip
If you are having issues, your best bet is to contact your VPN software/provider support, they are your best resource.
:::

### Searching media libraries vs. torrent data (data-based searching)

You can search both your media libraries (Arr/Plex) and actual torrent data (downloaded files). If you are using the media libraries with renamed files, you will need to use `matchMode: "risky"` in your configuration file to allow cross-seed some leeway in its matching process. `"risky"` [`matchMode`](./options.md#matchmode) is not recommended to be used without skipRecheck set to false, as it could result in more false positives than `"safe"`.

- Due to the way data-based searching works, risky matching only matches renamed files if they are a single-file torrent. As TV libraries often include renamed files, data-based matching will not be able to pick up matches on multi-file torrents (such as season packs).

### My season packs are cross-seeding individual episodes!

You can use [`includeSingleEpisodes`](./options.md#includesingleepisodes), which expands from [`includeEpisodes`](./options.md#includeepisodes). If you wish to search for season packs as a whole and individual episodes _not_ from a season pack, you will need to set [`includeEpisodes`](./options.md#includeepisodes) to false, and [`includeSingleEpisodes`](./options.md#includesingleepisodes) to true. Both options would be best utilized with [`includeNonVideos`](./options.md#includenonvideos) set to true.

:::tip
Specific configurations for episode and season inclusion can be found in the [config file](https://github.com/cross-seed/cross-seed/blob/master/src/config.template.cjs#L78-L98)
:::

### Why do I see `filetree is different` in my logs?

This is a result of the matching algorithm used by `cross-seed`, and is most commonly associated with a few scenarios. These include the presence of additional .nfo/.srt files in a torrent, differences in the organization of files (one torrent having a folder while the potential match does not, or vice versa), and discrepancies in the filenames within the torrent.

:::tip
You can utilize the [`cross-seed diff`](../reference/utils#cross-seed-diff) command to compare the torrents.
:::

### My tracker is mad at me for snatching 1000000 .torrent files!

`cross-seed` currently searches for potential matches and compares the contents and size of files within, it is possible you are running searches too often, are not keeping the torrent_cache folder, or are improperly utilizing [**autobrr**](https://autobrr.com/).

We try to reduce unnecessary snatches of .torrent files as much as possible, but because we need to compare files inside the torrent as well as their sizes, it is sometimes unavoidable.

### How can I use [**autobrr**](https://autobrr.com/) with cross-seed?

If you are using [**autobrr**](https://autobrr.com/) to cross-seed, you can use the [`/api/announce`](../reference/api#post-apiannounce) endpoint, rather than [`/api/webhook`](../reference/api#post-apiwebhook), to match against what cross-seed [already knows about your available media](../reference/architecture#prefiltering) (instead of searching your indexers every time).

:::tip
If you want to filter announces even further, consider setting up more specific filters or using [**omegabrr**](https://github.com/autobrr/omegabrr) (which filters based on monitored items in Arrs) to minimize calls to cross-seed.
:::

:::info
For more help setting this up, you can head over to the [autobrr documentation for 3rd-party-tools](https://autobrr.com/3rd-party-tools/#cross-seed-filter) and read more.
:::
