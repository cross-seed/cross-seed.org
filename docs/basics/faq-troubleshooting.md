# FAQ & Troubleshooting

## Updating to cross-seed v6

If you are updating from version 5.x to version 6.x, you can visit the [v6 migration guide](../v6-migration) for the changes and updates.

:::tip IMPORTANT
We recommend reading [**this page**](../v6-migration) before seeking any support, as it should cover most of the immediate questions you may encounter as well as [**current changes to the state of v6 while it is in pre-release**](../v6-migration.md#updates-since-initial-release).
:::

### General Suggestions

-   Adjust [`excludeRecentSearch` `excludeOlder` and `searchCadence`](./daemon.md#set-up-periodic-searches) to reduce searching indexers needlessly.
-   If `cross-seed` runs continuously with an [`rssCadence`](./options.md#rsscadence), consider reducing the frequency of, or eliminating, searching via [`searchCadence`](./options.md#searchcadence). RSS is capable of catching all releases if ran 24/7.
-   The log files in `/logs` - specifically `verbose.*.log` - are your friend. If you experience undesired results from `cross-seed`, look to these files first for indicators of why `cross-seed` performed the way it did.

### Does cross-seed support music torrents?

While `cross-seed` may incidentally find _some_ music matches, it is not optimized for music _at all_. You will find better results with tools designed around music cross-seeding, examples of this are [crops](https://github.com/soranosita/crops) or Pollenizer.

:::tip
These appropriate tools for the job will usually be discussed and made available on the tracker's forums.
:::

### What can I do about `error parsing torrent at http://…`?

This means that the Prowlarr/Jackett download link didn't resolve to a torrent file.
You may have been rate-limited, so you might want to try again later.
Otherwise, just ignore it. There's nothing `cross-seed` will be able to do to fix
it.

### Does cross-seed work on public trackers?

While it is possible, in some cases, for you to `cross-seed` on public trackers; the majority of public trackers are serving the same torrent file (identical infohash) with different announce URLs. This results in `cross-seed` seeing what you would assume are matches on different trackers as being torrents you already have in your client. These "matches" will therefore be excluded in `cross-seed`'s decisions. Private torrent sites also set the ['Private Flag'](https://wiki.theory.org/BitTorrentSpecification#Metainfo_File_Structure), meaning that torrent clients cannot add multiple trackers to the same torrent (identical infohash) with a private flag set. So even if we somehow were able to support matching identical infohashes, it would only work with public trackers.

Another problem is the naming schemes (or lack of one) that the majority of public trackers use. Due to the nature of "anyone can upload", you will get individuals or bots tagging releases with their names, or just otherwise butchering the naming conventions we depend on for properly parsing and matching torrents.

Finally, given that there is no direct, lasting, benefit to you for cross-seeding on public trackers, as there is no account, ratio, reputation, or upload directly associated with you, the benefit YOU will receive if any matches are found is almost non-existent.

:::caution TL;DR
All of these factors combine to yield extremely limited results, if any, and the inability for us to provide support beyond initial configurations and set up for use on public trackers.
:::

### What's the best way to add new trackers?

In v6, if you are attempting to add a tracker, and perform a initial search on that tracker, it is as simple as adding the [`torznab` url](./options.md#torznab) to your config. You do not need to change any other options.

:::info v5 note
If you are still on v5 and attempting to add a new tracker to an existing setup to perform a search for the first time on that tracker, it is as simple as adding the [`torznab` url](./options.md#torznab) to your config, setting [`excludeOlder`](./options.md#excludeolder) to `null` to include all torrents regardless of their "age" in respect to cross-seed. You will need to return this setting to its previous value after your search.

[`excludeRecentSearch`](./options.md#excluderecentsearch) works on a per-tracker basis, and because you have unset [`excludeOlder`](./options.md#excludeolder), it will perform a full search on the new tracker, after which it will resume any other search results that qualify on _ALL_ trackers you have in your config.
:::

### What should I do after updating my config file?

Most settings will not require you to perform a search if changed and requires `cross-seed` to be restarted. For the ones that do, you many need to set [`excludeOlder`](./options.md#excludeolder) and [`excludeRecentSearch`](./options.md#excluderecentsearch) to `null` temporarily. This will search all torrents every time a `search` is performed by `cross-seed` while still taking advantage of your already existing cache.

:::danger
It will **NEVER** be necessary to delete your database or `torrent_cache` folder to perform a "fresh search". Doing so offers no benefits, is slower, and only puts undue stress on indexers.
:::

### Can I use special characters in my URLs?

To use special characters (`!@#$%^&*`) in your URLs for user/passwords, you will have to use URL encoding for ONLY the portion of the URL containing the special characters.

For instance, if your user or password contains a special character `#`, you will need to go to [URLEncoder.org](https://www.urlencoder.org/) and encode **THIS PORTION OF YOUR URL ONLY** - and then place this in the appropriate place in the URL in your config file.

### My data-based results are paused at 100% after injection

This is by design and due to the way data-based searches function. This is done to prevent automatically downloading
missing files or files that failed to recheck. Until there is a way to guarantee you won't end up downloading
extra (not cross-seeding) this is the best solution.

Alternatively, if you wish for torrents to not inject in a paused state, you can enable `skipRecheck` in the config
file, and this will instead Error on missing/incomplete files.

:::tip
Consider using `infoHash` if you are racing to prevent mismatches.
:::

### Why do I get `Unsupported: magnet link detected at…`?

`cross-seed` does not support the usage of magnet links. If your indexer supports torrent files you will need to switch your settings.

### rtorrent injected torrents don't check (or start at all) until force rechecked

Remove any `stop_untied=` schedules from your .rtorrent.rc.

Commonly: `schedule2 = untied_directory, 5, 5, (cat,"stop_untied=",(cfg.watch),"*.torrent")`

### `SyntaxError: Unexpected identifier` when I try and start cross-seed

`cross-seed` configuration files are formatted with commas at the end of each identifier (option), if you are seeing this error it is most likely that you are missing a comma at the end of the setting BEFORE the identifier specified in the error.

Alternatively, you could also be missing quotes around the value you provided. Check the syntax before and around the config setting given in the error.

### `RangeError: WebAssembly.instantiate(): Out of memory` error when starting

If you receive this error when trying to start `cross-seed`, usually presenting on v6 or in shared seedbox environments, it is likely caused by a limitation in the VMEM able to be allocated to your instance of `cross-seed`.

To fix this error, it is necessary to [use at least Node v20.15 and set the `NODE_OPTIONS` to include the flag `--disable-wasm-trap-handler`.](https://nodejs.org/en/blog/release/v20.15.0#cli-allow-running-wasm-in-limited-vmem-with---disable-wasm-trap-handler)

To ensure a successful startup of cross-seed, you can simply execute cross-seed with the following command.

```shell
NODE_OPTIONS=--disable-wasm-trap-handler cross-seed daemon
```

Adjust the command accordingly if you intend to perform another action such as a search with cross-seed.

### Failed to inject, saving instead.

The best way to start troubleshooting this is to check the `logs/verbose.*.log` and find this specific event.

You will be able to see the circumstances around the failure and start investigating why this occurred.

### My data-based search is searching torrent files!

Torrent files in [`torrentDir`](./options.md#torrentdir) take precedence over data files with the same name and are de-duplicated.

#### v5

If you need to search specifically the [`dataDirs`](./options.md#datadirs) (to acheive linking, for example), use an empty directory
for [`torrentDir`](./options.md#torrentdir) temporarily. This will strictly search the data.

#### v6

If possible, `cross-seed` will always attempt to create links for data and torrents being injected into a client, unlike in v5 where torrent matches were directly linked to the data.

:::tip
If you wish to search only data, please read the relevant version's instructions.

-   [v5](#v5)
-   [v6](../v6-migration.md#updated-torrentdir-option)

:::

### Error: ENOENT: no such file or directory

This is usually caused by broken symlinks in, or files being moved or deleted from, your [`dataDirs`](./options.md#datadirs) during a data-based search.
Check the `/logs/verbose.*.log` files for the file causing this.

:::caution
If you do not link files within your `dataDirs` or have them outside of the [`maxDataDepth`](../tutorials/data-based-matching.md#setup) visibility, this is preventable.
:::

### My torrents are injected (qBittorrent) but show `missing files` error!

If you see injected torrents show up with a `missing files` error, it is likely because you do not have a save path set for the original torrent's category that `cross-seed` was cross-seeding from. You should also see a warning in the logs when the torrents are injected telling you there is no save path set.

:::tip
Set a save path for the files in that category to fix this.
:::

### I am getting `0 torrents found` with qBittorrent and I set my `torrentDir`

If you are using qBittorrent 4.6.x or later and have the option to use `SQLite database` in the Advanced menu in preferences, you will not be able to do torrent based searches. To be compatible with `cross-seed` you will need to switch this to `fastresume` mode and restart qBittorrent. This will store actual torrent files in your BT_Backup folder. `cross-seed` depends on, and indexes, the torrent files for searching.

:::danger TL;DR
We have no current ETA on integration with qBittorrent's SQLite database.
:::

### What [`linkType`](./options.md#linktype) should I use?

Your options are `"hardlink"` or `"symlink"`. These operate in seperate ways, and depending on your workflow you should choose appropriately. This is a brief description, however
a more in depth guide is available at [Trash's Hardlinking Guide](https://trash-guides.info/Hardlinks/Hardlinks-and-Instant-Moves/).

-   symlinks are a "shortcut" of sorts, pointing at the original file from a new location. This can be used across mounts (Docker) or partitions/drives, and does not cost you any extra space. The only possible issue is that if the original file is deleted (when you remove a torrent,) the torrents in your client using the `symlink` will "break" and you will receive errors. If this sounds like a hassle, consider reading further about hardlinks.

-   hardlinks are a tricky thing for someone not familiar with the concept but are worth understanding. They are a "direct line" to the actual data on the disk and, as far as the file system is concerned, are indistinguishable from the original. Hardlinks do not require any additional space and the file will remain on the disk until all references to said file are deleted. These linktypes are only possible on the same partition/disk/mount, and you will need to have your [`linkDir`](./options.md#linkdir) set to the same mount (Docker) or partition as your [`dataDirs`](./options.md#datadirs). This is the best approach if you do not always keep the source torrent in your client (due to them being deleted from the tracker) - which would then break symlinks and cross-seeds. This is the approach commonly used in Arr's on import.

:::warning BE ADVISED
If your client is using a folder for incomplete download, using matchMode [`partial`](./options.md#matchmode) could break `cross-seed` linking. **If the incomplete download folder is on a different drive from the completed path**, you will need to use the linkType [`symlink`](./options.md#linktype) when using `partial` matchMode. If using linkType `hardlink`, your download client will break the hardlink and copy between drives causing the files to be duplicated.

For qBittorrent users, `cross-seed` sets the download path in addtion to save path which prevents this issue from happening. For other clients, you must ensure your paths follow standard hardlinking requirements.
:::

:::tip
If you are using qBittorrent, consider checking out [qbit_manage](https://github.com/StuffAnThings/qbit_manage) to manage your hardlinks eligible for deletion.

:::

### I'm getting errors in cross-seed on hostingby.design seedbox

1. Get your shared instance IP address (`cat .install/subnet.lock)
2. Torznab URLs should be: `http://ip:port/prowlarr/[id]/api?apikey=[apikey]`
3. Your torrent client should be on the same subnet (if installed after dec. 2023). If not, update the “bind ip” address in web ui settings to your ip from step 1 and restart the torrent client
4. The torrent client address URL in `cross-seed` config should be http://user:pass@ip:port (note: no `/qbittorrent` or `/deluge` etc at the end)

:::caution
The subnet/shared instances are reverse proxies so no https
:::

:::tip
Although we are providing the information given from hostingby.design, we are not able to support this directly. This is just what was passed to us. Contact them for details and further instructions if you have any issues
:::

### I can't reach my Prowlarr/Jackett/cross-seed/torrent client (Using Docker/VPN)

If you are using [Docker](./getting-started#with-docker), you cannot use `localhost` as an address to communicate across containers. Consider using your host's local IP address (usually a 192 or 10 address) or the container name (if using a "Custom Docker Network").

If your setup is running with a VPN, you will need to either

1. Set up split tunneling
2. Try to use the Docker network addresses as your instance hostnames
3. Address the routing of local/internal traffic in your VPN configuration

Generally, you won't be able to access local instances from services utilizing a VPN since localhost/LAN is not accessible from the VPN network by default.

:::info
There is no need to put `cross-seed` behind a VPN. All of its requests are made to your torrent client or Jackett/Prowlarr. The only exception is when announcements are made via the `/announce` API endpoint and are snatched during matching or for injection.
:::

:::danger
Even with API authentication, we still recommend that you **do not expose its port to untrusted networks (such as the Internet).**
:::

### Searching media libraries vs. torrent data (data-based searching)

You can search both your media libraries (Arr/Plex) and actual torrent data (downloaded files). If you are using the media libraries with renamed files, you will need to use [`matchMode: "risky"`](../basics/options.md#matchmode) in your configuration file to allow `cross-seed` some leeway in its matching process. [`"risky" matchMode`](./options.md#matchmode) is not recommended to be used without [`skipRecheck`](./options.md#skiprecheck) being set to false, as it could result in more false positives than `"safe"`.

:::caution
Due to the way data-based searching works, risky matching only matches renamed files if they are a single-file searches. As TV libraries usually include renamed files, data-based matching will not be able to pick up matches on multi-file torrents (such as full-season packs matched to your season folders).
:::

### My season packs are cross-seeding individual episodes!

:::caution
The include options detailed below have changed for v6. You can reference the [migration guide](https://www.cross-seed.org/docs/v6-migration#include-option-changes) for the updated behavior. The explanation below applies to v5 only.
:::

You can use [`includeSingleEpisodes`](./options.md#includesingleepisodes), which expands from [`includeEpisodes`](./options.md#includeepisodes). If you wish to search for season packs as a whole and individual episodes _not_ from a season pack, you will need to set [`includeEpisodes`](./options.md#includeepisodes) to `false`, and [`includeSingleEpisodes`](./options.md#includesingleepisodes) to `true`. Both options would be best utilized with [`includeNonVideos`](./options.md#includenonvideos) set to `true`.

:::tip
Specific configurations for episode and season inclusion can be found in the [config file's option descriptions.](https://github.com/cross-seed/cross-seed/blob/master/src/config.template.cjs#L240-L276)
:::

### Why do I see `filetree is different` in my logs?

This is a result of the matching algorithm used by `cross-seed`, and is most commonly associated with only a few scenarios. These include the presence of additional .nfo/.srt files in a torrent, differences in the organization of files (one torrent having a folder while the potential match does not, or vice versa), and discrepancies in the filenames within the torrent. Switching to matchMode [`partial`](./options.md#matchmode) will eliminate nearly all mismatches due to filetree.

:::tip
You can utilize the [`cross-seed diff`](../reference/utils#cross-seed-diff) command to compare the torrents.
:::

### How can I use [**autobrr**](https://autobrr.com/) with cross-seed?

If you are using [**autobrr**](https://autobrr.com/) to cross-seed, you can use the [`/api/announce`](../reference/api#post-apiannounce) endpoint, rather than [`/api/webhook`](../reference/api#post-apiwebhook), to match against what `cross-seed` [already knows about your available media](../reference/architecture#prefiltering) (instead of searching your indexers every time).

:::tip
If you want to filter announces even further, consider setting up more specific filters or using [**omegabrr**](https://github.com/autobrr/omegabrr) (which filters based on monitored items in Arrs) to minimize needless calls to cross-seed.
:::

:::info
For more help setting this up, you can head over to the [autobrr documentation for 3rd-party-tools](https://autobrr.com/3rd-party-tools/cross-seed#cross-seed-filter).
:::

### My tracker is mad at me for snatching too many .torrent files!

`cross-seed` searches for and compares potential match's contents and the size(s) of file(s) within those torrents. It is possible you are running searches too often, have configured `cross-seed` in a less-than-desirable way, are not keeping the torrent_cache folder, or are improperly utilizing [**autobrr**](https://autobrr.com/).

:::caution
It is important to note that your tracker may have opinions on the snatching of .torrent files that `cross-seed` can potentially do, and it is important to respect these or risk your account being disabled.
:::

We try to reduce unnecessary snatches of .torrent files as much as possible, but because we need to compare the files inside the torrent as well as their sizes, it is sometimes unavoidable.

:::warning
`cross-seed` is incredibly configurable and needs a good amount of thought and testing in your configuration before leaving it to do its thing.

**We highly recommend you read your tracker's rules, investigate the number of potential searches you will be performing, and thoroughly read the documentation on the options in the config template as well as on this site.**
:::

### My partial matches from related searches are missing the same data, how can I only download it once?

`cross-seed` is not aware of what matches will happen ahead of time, each is performed with zero knowledge of the previous or the following. As such it possible to have situations where a partial match when complete would become a perfect match for another otherwise partial match. This is usually neglibile since the missing data is small, but in cases where it is significant such as with [seasonFromEpisodes](./options.md#seasonfromepisodes), you can use the [inject](../reference/utils.md#cross-seed-inject) feature.

If you have not recently deleted files in your [outputDir](./options.md#outputDir), then these torrents will still have their .torrent file present. If so, simply pick one torrent to complete the download on and that's it! `cross-seed` uses all possibles matches to source files with the inject job or when using `cross-seed inject`. It will automatically detect the newly downloaded files, link them to the other torrents, and trigger a recheck for those torrents.

For the rare case that the .torrent files are not present in `outputDir`. First, choose which tracker you'd like to complete the download on and start the torrent. Then copy (or export) the .torrent files from the other related partial matches to a safe place and remove them from the client (do **NOT** delete the torrent data files). Once the download is complete, follow the steps [here](../tutorials/injection.md#manual-or-scheduled-injection) to re-inject the copied and renamed .torrent files. `cross-seed` will automatically use the newly completed torrent over the previous (or ensemble) that caused the partial match.

:::danger WARNING
Manual injections such as what is performed here requires the renaming of .torrent files for proper linking. [**Read More**](../tutorials/injection.md#manual-or-scheduled-injection)
:::

### How can I force inject a cross seed if its source is incomplete?

`cross-seed` will not inject matches if the source is incomplete in most scenarios. The only time `cross-seed` will, is from the `cross-seed inject` command or from the inject job. If the age of the saved .torrent file (determined my last modified time) is older than a day, `cross-seed` will inject and link files even from an incomplete source if [`linkDir`](./options.md#linkdir) and [`partial`](./options.md#matchmode) is enabled. These injections will always be treated as `partial` matches which are paused and rechecked.

Once the torrent has finished rechecking, it's progress could be anywhere from 0% to 100%. You will then have to choose between resuming the torrent or removing it from client with the corresponding .torrent file in [`outputDir`](./options.md#outputdir). Of course this is no longer "cross seeding", but it does allows the possibility of reviving the stalled torrent used as the source. In order to do this, you may need to follow the manual steps outlined in the [faq entry](#my-partial-matches-from-related-searches-are-missing-the-same-data-how-can-i-only-download-it-once) above on the stalled torrent.

:::caution
This is not really "cross seeding" anymore and likely will incur significant download for the matched torrent. This should be rarely needed as `cross-seed` can match from multiple sources. `cross-seed` is simply offering you the ability to revive the stalled torrents inside your client.
:::

#### Settings to consider when looking to minimize snatches

---

```js
includeEpisodes: false,
includeSingleEpisodes: true,
```

This will exclude season packs' individual episodes (for data-based searching) while still searching for episodes outside of season packs. Many times individual episodes have been replaced on trackers for the season packs. This is beneficial for initial searches especially.

:::warning
If you do not download or upgrade to season packs, this could still result in excessive searching.
:::

---

```js
includeNonVideos: false,
```

This option will exclude any torrents or folders that contain non-video files. This is useful for excluding things that are not movies or TV content, but will also exclude anything that contains `.nfo`, `.srt`, `.txt` or other non-video files from being searched.

---

```js
matchMode: "safe",
```

:::info
Using [`risky`](./options.md#matchmode) matching will match torrents for snatching based on the size of the torrents and whether the release groups match (if both are present) and compare them regardless of file structures. This will always result in more .torrent files being snatched from the tracker.

Using [`safe`](./options.md#matchmode) matching will match torrents for snatching based on the size and require that the release groups match and compare them, requiring file structure to match.

Using [`partial`](./options.md#matchmode) matching works the same as `risky` but it will ignore missing files up to your [`fuzzySizeThreshold`](./options.md#fuzzysizethreshold).
:::

:::danger WARNING
There are TV shows that are not combined into season packs, such as Jeopardy, Talk Shows, and similar. These shows are known as dailies and often have naming which specifies dates, rather than SeasonEpisode (S02E03) style. Searching with `includeSingleEpisodes` and using `risky` on these torrents, or files, can result in _many torrent files being downloaded_ for comparisons for matching only _one individual episode_.

Remember, this would occur on just one (torrent) search, within the entire (all data) search.
:::

---

##### Final Notes

:::tip Be ADVISED
**There is no one-size-fits-all setting for this**. You can run `cross-seed` with your config to see how many torrents it will search (noted as "suitable" before conducting the actual search) and adjust accordingly.
:::

-   It is highly recommended to use [`excludeOlder` and `excludeRecentSearch`](./daemon.md#set-up-periodic-searches). Both of these are covered [here](./daemon.md#set-up-periodic-searches) as well as on the [options page](./options.md#excludeolder).

    -   Setting something reasonable for both of these based on the amount of content you download is crucial. While we cache your .torrents, it is not beneficial, for example, to repeatedly search the same torrents that are 6 months old every few days.

-   A final set of options to consider are [`searchLimit`](./options.md#searchlimit) and [`searchCadence`](./options.md#searchcadence). These two options combined will limit the number of searches performed on your schedule ([`searchCadence`](./options.md#searchcadence)) and can ease the search queries you are making to your tracker.

---

#### BTN

After discussions with the staff of the site, we have agreed on a recommended set of configuration options that should help to minimize excessive snatching of the .torrent files for comparison. These settings are merely recommendations. You and you alone are responsible for your account and the actions of the software you use with your account.

```js
delay: 30,
excludeRecentSearch: undefined,
excludeOlder: "2w",
searchCadence: "3d",
includeEpisodes: false,
includeSingleEpisodes: false,
includeNonVideos: false,
```

:::tip
Descriptions for the settings listed above can be found [here](./options.md).
:::
