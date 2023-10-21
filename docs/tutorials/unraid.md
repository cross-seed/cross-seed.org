---
id: unraid
title: Unraid
---

## Installation

To install in Unraid, the easiest setup will be to use the
[Community Applications](https://forums.unraid.net/topic/38582-plug-in-community-applications/)
app. Once the app is installed, go to the **App** tab and search for
`cross-seed`. Click on the "Install" button. This will take you to the template configuration.

## Configuration

### Volume Mappings

Cross-seed **needs** to access 3 directories: an input directory with torrent files,
an output directory for cross-seed to save new torrent files (for `action: 'save',`), and a config
directory.

| Config Type     | Name   | Container Path                       | Host Path                           | Access Mode |
| --------------- | ------ | ------------------------------------ | ----------------------------------- | ----------- |
| Path            | Config | /config                              | /mnt/user/appdata/cross-seed        | Read/Write  |
| Path            | Input  | /torrents                            | /path/to/torrent/client/session/dir | Read Only   |
| Path            | Output | /output                              | /path/to/torrent/client/watch/dir   | Read/Write  |
| Path (Optional) | Data   | /torrent/client/path/to/torrent/data | /path/to/torrent/client/data        | Read/Write  |

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

Below is a screenshot of what your docker container configuration might look
like. Now, you can try starting the docker container and editing the resulting
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

From here, you can edit the configuration to your liking through either nano or whatever method you use to edit your files.

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
If you would like to automatically check for cross-seeds when a download finishes, learn how to [set up automatic searches for finished downloads](../basics/daemon#set-up-automatic-searches-for-finished-downloads).
