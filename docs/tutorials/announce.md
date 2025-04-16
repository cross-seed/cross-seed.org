---
id: announce
sidebar_position: 5
title: Announce Matching
---

`cross-seed` has the ability to match cross seeds from IRC announces. This allows you to start seeding as soon as a torrent is uploaded, even before the uploader has started seeding themselves. This method of cross seeding has the lowest impact on trackers due to the nature of IRC and the biggest benefit to you by seeding the intial torrent swarm.

If you don't set this up, `cross-seed` _will_ eventually match these releases with [`rssCadence`](../basics/options.md#rsscadence).

## Setting Up Announce Matching

:::warning

Snatches from announce will happen directly with the tracker, it will not be proxied through `Prowlarr/Jackett` unlike all other requests `cross-seed` makes. For most users this is not a problem, but if you are using a proxy or VPN on `Prowlarr/Jackett`, you will need to ensure that your proxy or VPN is also set up for `cross-seed` to avoid any issues.

:::

The most common way to connect to a trackers IRC announce channel is through [`autobrr`](https://autobrr.com/), for which we recommend their [**guide for `cross-seed`**](https://autobrr.com/3rd-party-tools/cross-seed#cross-seed-filter).

While `cross-seed` is running in daemon mode, it will listen for any announces and attempt to find matches against the content you already have. You can monitor these requests and their decisions in the verbose logs.

These matches are exempt from [`includeSingleEpisodes`](../basics/options.md#includesingleepisodes) and will always be matched. This is because the announce is triggered by a new upload, so it is unlikely that a season pack is available. If you want to prevent episode matching, you can block episodes in your `autobrr` filter.

:::tip

If you want to filter announces even further, consider setting up more specific
filters or using [**Lists**](https://autobrr.com/filters/lists) (which
filters based on monitored items in Arrs) to minimize needless calls to
cross-seed.

:::

### Announce Retries

`cross-seed` will return a status code of [`202`](../reference/api.md#post-apiannounce) if the source torrent is still downloading. While these torrents are saved by `cross-seed` for [later retrying](../v6-migration.md#failed-injection-saved-retry), you can also set up `autobrr` to retry these torrents as well. This has a few benefits:

- The retries will happen at an interval that you set, rather than waiting exclusively on `cross-seed` to retry. This means you can potentially start seeding faster with a shorter retry interval.
- Once the source torrent is finally completed, the next retry that `autobrr` sends will return with a `200` status code. This means that `autobrr` will now mark this announce as successful and then run your configured actions.

#### Configuring Retries

:::caution

You can adjust the retry delay and attempts to your liking, however `autobrr` will also retry if requests fail. This means that if `cross-seed` was down for an extended period, `autobrr` could overwhelm `cross-seed` with retry requests as soon as it comes back online. You would need to restart both `autobrr` and `cross-seed` to escape this situation.

:::

1. In `autobrr`, go to `Filters > YOUR_CROSS_SEED_FILTER > External > Retry`
2. Set `RETRY HTTP STATUS CODE(S)` to `202`
3. Set `MAXIMUM RETRY ATTEMPTS` to `100`
4. Set `RETRY DELAY IN SECONDS` to `900` (15 minutes)
5. Click `Save` and repeat for any other filters you have set up for `cross-seed`.

This will retry any announces where the source torrent is still downloading every 15 minutes for a day. If the torrent finishes downloading after this window, `cross-seed` will still inject the torrent with its internal retry system but `autobrr` will not have considered it a success.