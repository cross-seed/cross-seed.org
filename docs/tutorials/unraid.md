---
id: unraid
title: Unraid
---

## Installation

To install in unRAID, the easiest setup will be to use the
[Community Applications](https://forums.unraid.net/topic/38582-plug-in-community-applications/)
app (Apps section in the unRAID WebUI). Go to the **Apps** tab and search for `cross-seed`.
We have an official container now, which is under "ambipro's Repository". Click on the "Install"
button. This will take you to the template configuration.

## Configuration

### Volume Mappings

Cross-seed **needs** to access 3 directories: an input directory with torrent files,
an output directory for cross-seed to save new torrent files (when using [`action: 'save',`](../basics/options.md#action)), and a config
directory.

| Config Type     | Name       | Container                            | Host                                | Access Mode |
| --------------- | ---------- | ------------------------------------ | ----------------------------------- | ----------- |
| Path            | configPath | /config                              | /mnt/user/appdata/cross-seed        | Read/Write  |
| Path            | torrentDir | /torrents                            | /path/to/torrent/client/session/dir | Read Only   |
| Path            | outputDir  | /output                              | /path/to/torrent/client/watch/dir   | Read/Write  |
| Path (Optional) | dataDir    | /torrent/client/path/to/torrent/data | /path/to/torrent/client/data        | Read/Write  |

:::tip
The "dataDir" path is used only for **[data-based searching](./data-based-matching.md)**. If you wish to add this, you will need to edit the path for `dataDir`.

The container path for `cross-seed` will need to be the same as how your torrent client's container path is configured.
:::

### Port Mappings

`cross-seed` can listen for an HTTP request from when a torrent finishes downloading
or you receive an `announce`.

:::tip

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

![screenshot-cross-seed](https://user-images.githubusercontent.com/2813049/147599328-6032688e-45e4-43cf-87f6-a070829e1a1b.png)

You can start the container to create the config file path.

### Configuration File

After the container has been created, we need to add a configuration file. Open a terminal in Unraid and issue the following commands:

```
cd /mnt/user/appdata/cross-seed
curl https://raw.githubusercontent.com/cross-seed/cross-seed/master/src/config.template.docker.cjs -o config.template.docker.js
cp config.template.docker.js config.js
```

From here, you can [edit the configuration options](../basics/options.md#options-used-in-cross-seed-daemon) to your liking through your preferred text editor (`nano`, `vim`, etc).

Start your container and check the logs. You should see something along the lines of:

```
Configuration file already exists.
info: Validating your configuration...
info: Your configuration is valid!
info: [server] Server is running on port 2468, ^C to stop.
```

## Automation/Scheduling

`cross-seed` runs in [Daemon mode](../basics/daemon.md) by default on Unraid.

If you would like to schedule a periodic scan of your library, set the [`searchCadence option`](../basics/options.md#searchcadence).

If you would like to set up RSS scans, set the [`rssCadence option`](../basics/options.md#rsscadence).

If you would like to automatically check for cross-seeds when a download finishes, learn how to [set up with automatic searches](../basics/daemon#set-up-automatic-searches-for-finished-downloads).
