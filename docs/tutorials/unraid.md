---
id: unraid
title: Unraid
---

## Installation

To install in Unraid, the easiest setup will be to use the
[Community Applications](https://forums.unraid.net/topic/38582-plug-in-community-applications/)
app (Apps section in the Unraid WebUI). Go to the **Apps** tab and search for `cross-seed`.
We have an **OFFICIAL** Community App container now, which is under "ambipro's Repository". Click on the "Install"
button. This will take you to the template configuration.

## Configuration

### Volume Mappings

Cross-seed **needs** to access 3 directories: an input directory with torrent files,
an output directory for `cross-seed` to save new torrent files (when using [`action: 'save',`](../basics/options.md#action)), and a config
directory.

| Config Type     | Name       | Container                            | Host                                | Access Mode |
| --------------- | ---------- | ------------------------------------ | ----------------------------------- | ----------- |
| Path            | configPath | /config                              | /mnt/user/appdata/cross-seed        | Read/Write  |
| Path            | torrentDir | /torrents                            | /path/to/torrent/client/session/dir | Read Only   |
| Path            | outputDir  | /output                              | /path/to/torrent/client/watch/dir   | Read/Write  |
| Path (Optional) | dataDir    | /torrent/client/path/to/torrent/data | /path/to/torrent/client/data        | Read/Write  |

:::tip
The "dataDir" path is used only for [**data-based searching**](./data-based-matching.md). If you wish to add this, you will need to edit the path for `dataDir`.

The container path for `cross-seed` will need to be the same as how your torrent client's container path is configured.
:::

### Port Mappings

`cross-seed` can listen for an HTTP request from when a torrent finishes downloading
or you receive an `announce`.

:::info
If you don't need to use these features **from outside of Docker**, then you can
skip this step.
:::

| Config Type | Name | Container Port | Host Port | Connection Type |
| ----------- | ---- | -------------- | --------- | --------------- |
| Port        | Port | 2468           | 2468      | TCP             |

#### Screenshot

Below is a screenshot of what your Docker container configuration might look
like. Now, you can try starting the Docker container and editing the resulting
configuration file in the next step.

![screenshot-cross-seed](https://github.com/cross-seed/cross-seed/assets/123845855/93a4749e-1506-40de-91f5-ac7d8ec93334)

:::tip
In the top right if you enable "Advanced View" it will reveal the `Post Argument` field, this can be changed from `daemon` to `search` (for example) to run the search command.
:::

You can start the container to create the config file path.

### Configuration File

After the container has been created, we need to generate and set up your configuration file. 

This file will be automatically generated when the container is ran for the first time.

:::tip
If for whatever reason this file is not generated, it may be due to permissions. Double-check that your appdata/config folder has the proper permissions for user:group `99:100`
:::

From here, you can [edit the configuration options](../basics/options.md#options-used-in-cross-seed-daemon) to your liking through your preferred text editor (`nano`, `vim`, etc).

Start your container and check the logs. You should see something along the lines of:

```
Configuration file already exists.
info: Validating your configuration...
info: Your configuration is valid!
info: [server] Server is running on port 2468, ^C to stop.
```

### Auto-Restart

`cross-seed`, by default, will stop the container if a configuration option is suspected to be bad or transient network failures occur during startup validation
(such as failing to connect to the torrent client or Torznab endpoints).

If you have verified your settings after your initial setup and are only encountering errors intermittently,
you can utilize the `Extra Parameters` section of the `Advanced Settings` in the container template to automatically restart the container.
Add `--restart unless stopped` to `Extra Parameters`, as seen in the screenshot.

![screenshot-cross-seed-extra-param-config](https://github.com/cross-seed/cross-seed.org/assets/9668239/7e365d63-1f0d-467c-b6df-e3a53183abac)

## Automation/Scheduling

`cross-seed` runs in [Daemon mode](../basics/daemon.md) by default on Unraid.

If you would like to schedule a periodic scan of your library, use the [`searchCadence`](../basics/options.md#searchcadence) option.

If you would like to set up RSS scans, use the [`rssCadence`](../basics/options.md#rsscadence) option.

If you would like to automatically check for cross-seeds when a download finishes, learn how to [set up with automatic searches](../basics/daemon#set-up-automatic-searches-for-finished-downloads).
