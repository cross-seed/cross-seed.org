---
id: v6-migration
title: v6 Migration Guide
position: 0
---

## Overview

There are several breaking changes in cross-seed version 6.0.0. Most of them do not require any action on your part, but some need to be addressed in both the configuration file (`config.js`) and potentially permissions or volumes/mounts

This document outlines the changes made and actions required to take advantage of all the new features and capabilities.

:::warning HEADS-UP!
`cross-seed` v6 requires Node 20 or greater. Check your Node version with node --version and update if needed.

Docker users can skip this step.
:::

:::tip
The general recommendation is to grab the new `config.template.js` and simply go through and migrate your settings over. This will give you the latest descriptions/comments for your reference, as well as all of the updated options with our recommended defaults.
:::

### Stricter `config.js` Validation

One of the biggest changes made in v6 is better config validation and error messaging. Each setting in the config file is validated for formatting and proper syntax. If either is incorrect, a detailed error message will tell you where and how to fix each setting.

The new error messages will also provide links to specific documentation for the setting and point out bad paths or permission errors if you have any.

This is not going to automatically fix anything for you but will give you a better starting point to try and solve the issue yourself before requiring outside assistance.

### Linking Updates

We have made drastic breaking changes to the way linking operates, both in its implementation and in expanding its capabilities. Not only is linking more versatile in what can be matched now (for instance, previously files inside a folder would not match to a single-file torrent - this has been fixed), but you can also take advantage of linking when searching .torrent files instead of solely applying to data-based matching.

To achieve torrent linking, you simply have to mount or give permission (if necessary) for `cross-seed` to read and write to the actual torrent data structure (downloaded files) your client uses. This will need to mirror (for docker) the mounts made in the client. Your client will also need to be able to read and write to the `linkDir` folder. You do not need to specify a `dataDirs` with this setup, but simply define a `linkDir`.

The new folder structure in v6 for the `linkDir` creates sub-folders for each indexer (for example, `/link_dir/Indexer 1/Name.of.Torrent.File.mkv`). This doesn't change previously matched torrents, but new matches will follow this new structure.

There is, however, a new setting introduced into `config.js` named `legacyLinking` mainly to accommodate users of qBittorrent who want to utilize the Auto Torrent Management (ATMM) feature. Setting `legacyLinking` to `true` will tell cross-seed to use the same style of linking as v5; one folder with all the linked torrents.

### Updated `torrentDir` Setting

Previously, our recommendation if you wanted to strictly search only `dataDirs` for matches was to point `torrentDir` at a empty folder. This is no longer necessary. You can now set `torrentDir` to `null` to achieve a data-only search.

### New `blockList` Setting

Another new setting added is called `blockList`. This setting takes an array of strings (`["example", "example2"]`) and will block anything matching what is inside that array. The strings can be as strict or loose as you want.

You can include strings for the full, exact name of a torrent or file (e.g., `"The.Best.Movie.Ever.2024.DV.HDR.Atmos.mkv"`), partial name/keywords (e.g., `best.movie.ever`), or the infoHash from a torrent you wish to block.

### `apiAuth` (removed) and `apiKey` (added) Settings

`cross-seed` endpoints (announce and webhook) now _require_ API authentication. There are two ways to set up API authentication in v6:

1. Generated Key: By setting `apiKey: undefined`, `cross-seed` will continue to use a generated key. You can find this key by running `cross-seed api-key`.
2. Designated Key: You can now set a designated API key for `cross-seed`. This is the recommended method for people using automated deployment. Setting `apiKey: YOURkeyHereMak3It@good1` in the config file will tell `cross-seed` to always use that key.

The `apiAuth` setting in previous versions of `cross-seed` has been removed.

:::warning
While we provide this option, we strongly urge you to use a generated key. If you are specifying a key, please make sure this is a secure and safe key. You are responsible for your security.
:::

### Support for .env file

`cross-seed` v6 introduces native support for `.env` files. A `.env` file is a way to store and protect passwords and other sensitive information you don't want to add directly to your `config.js` file.

The `.env` file must be in the **current working directory** when you run `cross-seed`. For Docker users, the `.env` file should be in the `/config` folder in order for the container to load it. For a `systemd` daemon, you set the `WorkingDirectory` and the `.env` file should be in that directory.

To access a value defined in the `.env` file, use `process.env.VALUE`.

Example:

- `/config/.env`
  ```js
  PROWLARR_API_KEY = abcd;
  QBIT_URL = "http://username:password@qbittorrent:8080";
  ```
- `/config/config.js`
  ```js
  module.exports = {
    // ...
    torznab: [
      `http://prowlarr:9696/12/api?apikey=${process.env.PROWLARR_API_KEY}`,
    ],
    // ...
    qbittorrentUrl: process.env.QBIT_URL,
    // ...
  };
  ```

:::note
Any string with a variable inside of it should have the `process.env` reference wrapped with `${}` as well as enclosed in backticks (`) instead of quotes.
:::

### Other Miscellaneous Changes

Here is a short list of other changes made in v6. These are all behind-the-scenes updates made to improve `cross-seed`.

- Updated to Node v20, ES2022, and TypeScript v5
- Non-rate limited failures (status code `429`) will be cleared from the database when `cross-seed` is restarted
- Regex improvements. Some trackers rename search results or have non-standard naming conventions. The updated regex takes more of those into account and should find more matches.
- Improved logging messages, specifically around matching decisions.
- There are now lists of files/foldere=s integrated into `cross-seed` that are blocked during prefiltering at startup. These include folders present in full-disc Bluray/DVD releases, music files, rar archives, and season folders in Sonarr libraries. Excluding these from the `cross-seed` index (for data-based searches) will result in fewer "bad" searches that would otherwise yield no viable results.
- New recommended defaults in `config.template.js`. These settings are what we consider to be the best starting options when setting up `cross-seed`.
