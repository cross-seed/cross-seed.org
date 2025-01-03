---
id: announce
sidebar_position: 5
title: Announce Matching
---

`cross-seed` has the ability to match cross seeds from IRC announces. This allows you to start seeding as soon as a torrent is uploaded, even before the uploader has started seeding themselves. This method of cross seeding has the lowest impact on trackers due to the nature of IRC and the biggest benefit to you by seeding the intial torrent swarm.

If you don't set this up, `cross-seed` _will_ eventually match these releases with [`rssCadence`](../basics/options.md#rsscadence).

The most common way to connect to a trackers IRC announce channel is through [`autobrr`](https://autobrr.com/). [We recommend following their guide for sending IRC announces to `cross-seed`](https://autobrr.com/3rd-party-tools/cross-seed#cross-seed-filter).

While `cross-seed` is running in daemon mode, it will listen for any announces and attempt to find matches against the content you already have. You can monitor these requests and their decisions in the verbose logs.