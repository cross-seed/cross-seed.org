---
id: announce
sidebar_position: 5
title: Announce Matching
---

`cross-seed` has the ability to match cross seeds from IRC announces. This allows you to start seeding as soon as a torrent is uploaded, even before the uploader has started seeding themselves. This method of cross seeding has the lowest impact on trackers due to the nature of IRC and the biggest benefit to you by seeding the intial torrent swarm.

If you don't set this up, `cross-seed` _will_ eventually match these releases with [`rssCadence`](../basics/options.md#rsscadence).

### Setting Up Announce Matching

The most common way to connect to a trackers IRC announce channel is through [`autobrr`](https://autobrr.com/). [We recommend following their guide for sending IRC announces to `cross-seed`](https://autobrr.com/3rd-party-tools/cross-seed#cross-seed-filter).

:::warning

Snatches from announce will happen directly with the tracker, it will not be proxied through `Prowlarr/Jackett` unlike all other requests `cross-seed` makes. For most users, this is not a problem, but if you are using a proxy or VPN on `Prowlarr/Jackett`, you will need to ensure that your proxy or VPN is also set up for `cross-seed` to avoid any issues.

:::

While `cross-seed` is running in daemon mode, it will listen for any announces and attempt to find matches against the content you already have. You can monitor these requests and their decisions in the verbose logs.

These matches are exempt from [`includeSingleEpisodes`](../basics/options.md#includesingleepisodes) and will always be matched. This is because the announce is triggered by a new upload, so it is unlikely that a season pack is available. If you want to prevent episode matching, you can block episodes in your `autobrr` filter.