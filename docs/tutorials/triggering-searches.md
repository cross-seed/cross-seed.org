---
id: triggering-searches
sidebar_position: 6
title: Triggering Searches
---

`cross-seed` gives you the ability to search for cross-seeds as soon as a torrent
finishes downloading, by adding an on-completion script to your torrent client
(or [bakerboy448](https://github.com/bakerboy448)'s Sonarr/Radarr
[import script](https://github.com/bakerboy448/StarrScripts/blob/main/xseed.sh))
that calls `cross-seed`'s HTTP API.

If you don't set this up, `cross-seed` _will_ eventually search everything
during its daily backlog scan.

All the techniques mentioned below boil down to using the `curl` command to send
an HTTP POST request to the `cross-seed` daemon, which will look like this.

```shell
curl -XPOST <BASE_URL>/api/webhook?apikey=<API_KEY>&infoHash=<infoHash>
```

### Step 1: Find Your API Key

:::info Docker

Start by shelling into your docker container:

```shell
docker exec -it cross-seed bash
```

:::

Use the command:

```shell
cross-seed api-key
```

We will refer to this key as `<API_KEY>` in the examples below.

### Step 2: Find your Base URL

#### Non-Docker Users

Your `cross-seed` daemon will be available at:

```shell
http://localhost:2468
```

#### Docker Users

Use:

```shell
http://cross-seed:2468
```

We will refer to this as `<BASE_URL>` below.

### Setting Up Your Torrent Client

<details>
<summary><strong>rTorrent</strong></summary>

1. Create a script named `rtorrent-cross-seed.sh`, replacing `<BASE_URL>` and
   `<API_KEY>` with the correct values from above:
    ```shell
    #!/bin/sh
    curl -XPOST <BASE_URL>/api/webhook?apikey=<API_KEY> --data-urlencode "infoHash=$2"
    ```
2. Make it executable:
    ```shell
    chmod +x rtorrent-cross-seed.sh
    ```
3. Add to `.rtorrent.rc`:
    ```shell
    echo 'method.insert=d.data_path,simple,"if=(d.is_multi_file),(cat,(d.directory),/),(cat,(d.directory),/,(d.name))"' >> .rtorrent.rc
    echo 'method.set_key=event.download.finished,cross_seed,"execute={'`pwd`/rtorrent-cross-seed.sh',$d.name=,$d.hash=,$d.data_path=}"' >> .rtorrent.rc
    ```
4. Restart rTorrent.

</details>

<details>
<summary><strong>qBittorrent</strong></summary>

1. Go to Tools > Options > Downloads.
2. Enable **Run external program on torrent completion**, replacing `<BASE_URL>`
   and `<API_KEY>` with the correct values from above:
    ```shell
    curl -XPOST <BASE_URL>/api/webhook?apikey=<API_KEY> --data-urlencode "infoHash=%I"
    ```

</details>

<details>
<summary><strong>Transmission</strong></summary>

1. Create `transmission-cross-seed.sh`, replacing `<BASE_URL>` and `<API_KEY>`
   with the correct values from above:
    ```shell
    #!/bin/sh
    curl -XPOST <BASE_URL>/api/webhook?apikey=<API_KEY> --data-urlencode "infoHash=$TR_TORRENT_HASH"
    ```
2. Make it executable:
    ```shell
    chmod +x transmission-cross-seed.sh
    ```
3. In **Settings** > **Transfers** > **Management**, select the script in the
   "Call script when download completes" menu item.

</details>

<details>
<summary><strong>Deluge</strong></summary>

1. Create a file called `deluge-cross-seed.sh`, replacing `<BASE_URL>` and
   `<API_KEY>` with the correct values from above:

    ```shell
    #!/bin/bash
    infoHash=$1
    name=$2
    path=$3
    curl -XPOST <BASE_URL>/api/webhook?apikey=<API_KEY> --data-urlencode "infoHash=$infoHash"
    ```

2. Make the script executable:

    ```shell
    chmod +x deluge-cross-seed.sh
    ```

3. In Deluge:
    - Enable the Execute plugin
    - Under **Add Command**, select the event **Torrent Complete** and input:
      `/path/to/deluge-cross-seed.sh` - Press **Add** and **Apply**
    - Restart your Deluge client/daemon

</details>
