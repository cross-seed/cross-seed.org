---
id: unraid
sidebar_position: 8
title: Unraid
---

## Installation

To install in Unraid, the easiest setup will be to use the
[Community Applications](https://forums.unraid.net/topic/38582-plug-in-community-applications/)
app (Apps section in the Unraid WebUI). Go to the **Apps** tab and search for
`cross-seed`. We have an **OFFICIAL** Community App container now, which is
under "ambipro's Repository". Click on the "Install" button. This will take you
to the template configuration.

## Configuration

### Volume Mappings

`cross-seed` only **needs** access to your config directory. It will also need
access to your data directories if you wish to use [`linking`](./linking.md).

| Config Type        | Name       | Container                            | Host                         | Access Mode |
| ------------------ | ---------- | ------------------------------------ | ---------------------------- | ----------- |
| Path               | configPath | /config                              | /mnt/user/appdata/cross-seed | Read/Write  |
| Path (Recommended) | data       | /torrent/client/path/to/torrent/data | /path/to/torrent/client/data | Read/Write  |

::::tip

The `data` path is required for [**`linking`**](./linking.md) and
[**`data-based matching`**](./data-based-matching.md).

You may need additional paths if you are using multiple drives without pooling.

:::caution

The following two mappings are optional and you are unlikely to need them. They
are found under the `Show more settings` dropdown at the bottom of the template.

| Config Type     | Name       | Container    | Host                                | Access Mode |
| --------------- | ---------- | ------------ | ----------------------------------- | ----------- |
| Path (Optional) | torrentDir | /torrents    | /path/to/torrent/client/session/dir | Read Only   |
| Path (Optional) | outputDir  | /cross-seeds | /path/to/output/dir                 | Read/Write  |

:::

::::

### Port Mappings

`cross-seed` can listen for an HTTP request from when a torrent finishes
downloading or you receive an `announce`.

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

In the top right if you enable "Advanced View" it will reveal the
`Post Argument` field, this can be changed from `daemon` to `search` (for
example) to run the search command.

:::

You can start the container to create the config file path.

### Auto-Restart

`cross-seed`, by default, will stop the container if a configuration option is
suspected to be bad or transient network failures occur during startup
validation (such as failing to connect to the torrent client or Torznab
endpoints).

Once you have verified your settings and `config.js` are correct (after your
initial configuration) and are only encountering errors intermittently, you can
utilize the `Extra Parameters` section of the `Advanced Settings` in the
container template to automatically restart the container. Add
`--restart unless-stopped` to `Extra Parameters`, as seen in the screenshot.

![screenshot-cross-seed-extra-param-config](https://github.com/cross-seed/cross-seed.org/assets/9668239/7e365d63-1f0d-467c-b6df-e3a53183abac)

## Final Steps

`cross-seed` runs in daemon mode by default on Unraid and will automatically
generate the config file upon startup. To configure and finish setting up,
continue from step 3 in the
[Getting Started](../basics/getting-started.mdx#3-edit-the-config-file) guide.

:::tip

If for whatever reason your config file is not generated, it may be due to
permissions. Double-check that your appdata/config folder has the proper
permissions for user:group `99:100`

:::
