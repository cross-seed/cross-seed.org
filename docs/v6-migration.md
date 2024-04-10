---
id: v6-migration
title: v6 Migration Guide
position: 0
---

## Overview

There have been some dramatic and breaking changes made in the bump to version 6.0.0 of `cross-seed`. These changes are mostly things you will not have to do anything to realize the benefits of, while others require addressing in both your configuration file (`config.js`) as well as possibly permissions or volume/mounting if you'd like to take advantage of them.

Here I will go over the changes made and any actions you may need to take to both get `cross-seed` running as well as take advantage of the new features and capabilities.

:::warning HEADS-UP!
If you are not using at least version 20 of Node, this is the first thing you will have to update to get cross-seed running. If you are using Docker you will not need to change anything regarding this, as we've already built this into the container for you.
:::

:::tip
The general recommendation is to grab the new `config.template.js` and simply go through and migrate your settings over. This will give you the latest descriptions/comments for your reference, as well as all of the updated options with our recommended defaults.
:::

### Zod (Config.js Validation)

The first and most dramatic change many of you will notice, potentially on the first launch after updating, is that you will now receive very detailed error messages when your config file, permissions, paths, and formatting/syntax are incorrect. This (Zod) is a feature we introduced with v6 to make sure you were given more detailed information about why your config file is wrong, without necessarily requiring additional/outside help.

The error messages will give you the general issue as well as link you to the documentation page for the setting that is set incorrectly, give you specific errors on bad paths or permissions, and if you've made a mistake with syntax somewhere - it will also tell you where to look.

This is not going to automatically fix anything for you, but will give you a better starting point to try and solve the issue yourself before requiring outside assistance.

### Linking

We have made drastic breaking changes to the way linking operates, both in its implementation and in expanding its capabilities. Not only is linking more versatile in what can be matched now (for instance, previously files inside a folder would not match to a single-file torrent - this has been fixed), but you can also take advantage of linking when searching .torrent files instead of solely applying to data-based matching.

To achieve torrent linking, you simply have to mount or give permission (if necessary) for `cross-seed` to read and write to the actual torrent data structure (downloaded files) your client uses. This will need to mirror (for docker) the mounts made in the client. Your client will also need to be able to read and write to the `linkDir` folder. You do not need to specify a `dataDirs` with this setup, but simply define a `linkDir`.

Another change that is made is with the linking folder structure found inside of the `linkDir`. By default, everything linked will be made inside of a folder with the name of the indexer it matched to inside of the `linkDir`. (Example: /linkdir/Indexer 1/Torrent.Name.mkv) This will not cause any issues for previously cross-seeded torrents in your client, and will not need changes made to the mounts or permissions you already have set.

There is, however, a new setting introduced into `config.js` named `legacyLinking`. This is an option introduced mainly to accommodate users of qBittorrent who want to utilize the Auto Torrent Management feature. This will link in the flat-folder style previously seen in v5. If you want the old (v5) style behavior of linking or use AutoTMM, then you will need to set this option to `true`.

### torrentDir

Previously, our recommendation if you wanted to strictly search only `dataDirs` for matches was to point `torrentDir` at a empty folder. This is no longer necessary. You can now set `torrentDir` to `null` to achieve a data-only search.

### blockList

We have added a new config option called `blockList`. This is an array (like `torznab` or `dataDirs`) and requires square brackets with each string wrapped with quotes and separated by commas (["example", "example2"]) - these strings can be either a whole torrent/file name, a bit of text contained in the name, or the entire infoHash from the torrent you want to block.

### apiAuth and apiKey

API Authentication for `cross-seed` API endpoints (announce and webhook) is now required, however, as a compromise to those who may be using automated deployment or do not have the desire for randomly generated keys we have an option in `config.js` for a predesignated API key. The previously used `apiAuth` has been deprecated/removed.

Leaving `apiKey` as `undefined` will continue to use a generated key which you can retrieve with `cross-seed api-key` - while providing a specific key will override that generated key.

:::warning
While we provide this option, we strongly urge you to use a generated key. If you are specifying a key, please make sure this is a secure and safe key. You are responsible for your security.
:::

### Support for .env file

In v6 we've introduced native support for reading `.env` files. You can use this file to protect your API keys and passwords. Usage of this feature is entirely optional but encouraged if you have the knowledge or experience with this type of configuration.

The `.env` file needs to be present in the **current working directory** when you run cross-seed. In the case of the docker, the `.env` file needs to be inside the `/config` folder for the container to load it for you. For a `systemd` daemon, you set the `WorkingDirectory`.

To access a value that is defined in the `.env` you use `process.env.VALUE`.

Example:

- `/config/.env`
  ```
  PROWLARR_API_KEY=abcd
  QBIT_URL="http://username:password@qbittorrent:8080"
  ```
- `/config/config.js`
  ```
  module.exports = {
    // ...
    torznab: [
      `http://prowlarr:9696/12/api?apikey=${process.env.PROWLARR_API_KEY}`
    ],
    // ...
    qbittorrentUrl: process.env.QBIT_URL
    // ...
  }
  ```

:::note
Any string with a variable inside of it should have the `process.env` reference wrapped with `${}` as well as enclosed in backticks (`) instead of quotes.
:::

### Other

This section is not relevant for the usage, but merely for those interested in the other improvements we made. If you don't have any interest in development or don't care what happens behind the scenes to improve `cross-seed`, this probably is where you can stop reading.

- We've updated to Node v20, ES2022, and TypeScript v5.

- Indexer failures that are non-429 (rate limited) are now cleared from the database upon restarting.

- We've fine-tuned the regexes we're using for matching pre-snatch. Specifically with the group matching. There were a few exceptions with trackers that have renamed their search results (releases) and non-standard naming for Arr libraries that we now attempt to account for.

- Logging is now more granular for matching (matching decisions) - previously "file-tree mismatch" was used pretty ambiguously. This is now addressed.

- There are now lists of files/folders integrated into `cross-seed` that are blocked during our prefiltering at startup. These include folders that exist in full-disc Bluray and DVD releases, as well as music files and rar archives, and season folders in Sonarr libraries, which were all previously searched individually. They will now be excluded from indexing your files (for data-based searching) and result in fewer "bad" searches that would otherwise yield no viable results.

- We now have recommended defaults in the configuration template, these options are general guides for you to consider when configuring `cross-seed`. We in no way guarantee any of these settings or their consequences/effectiveness if you misuse `cross-seed` or break tracker rules. You should always read your tracker's rules before using `cross-seed``.
