---
id: daemon
sidebar_position: 1
title: Daemon Mode
---

Daemon Mode lets you harness the full power of `cross-seed` by continuously running
and enabling the following features:

-   instantly searching for cross-seeds for finished downloads
    -   using your torrent client using [`webhook`](../reference/api.md#post-apiwebhook) endpoint
    -   using a third-party script to trigger from an Arr's import/upgrade event
        -   [bakerboy448's Arr Import script](https://github.com/bakerboy448/StarrScripts#xseedsh)
-   watching for new releases:
    -   scanning RSS feeds periodically ([`rssCadence`](./options.md#rsscadence)) for matching content
    -   listening for new release announces and snatching them if you already
        have the data (e.g. [autobrr](https://autobrr.com/) -> [`announce`](../reference/api.md#post-apiannounce) API endpoint)
-   Running batch searches on your full collection of torrents periodically ([`searchCadence`](./options.md#searchcadence))

:::tip

In theory, after you run a full-collection search for the first time, the first two
features should be able to find all cross-seeds as soon as possible. However there
are applications for the third feature as well. If improvements in the matching
algorithm are made to `cross-seed`, or your daemon is down for an amount of time,
running searches very infrequently will find cross-seeds which fell through the
cracks.

:::

In this doc, we'll go through strategies to run the daemon continuously and
start automatically on reboot, ways to trigger searches for torrents that just
finished downloading, and ways to watch for new releases.

:::danger

`cross-seed` has an [`apiAuth` option](./options.md#apiauth) to require authorization on requests, but we still recommend
that you **do not expose its port to untrusted networks (such as the Internet).**

:::

## Running the daemon continuously

The easiest way to run the daemon is just to leave a terminal open after running
the following command:

```shell
cross-seed daemon
```

However, that's not very sustainable.

-   If you run `cross-seed` on a server that you use `ssh` to log into, then
    `cross-seed` will stop whenever your `ssh` session closes.
-   If the server restarts, then you'll have to start `cross-seed` manually.

Below are a few ways you can set up `cross-seed daemon` to run on its own:

-   [Docker](#docker)
-   [Unraid](#unraid)
-   [`systemd`](#systemd-linux)
-   [`screen`](#screen)

### Docker

You can use [**Docker Compose**](https://docs.docker.com/compose/install).
Create or open your existing `docker-compose.yml` file and add the `cross-seed`
service:

```yaml
version: "2.1"
services:
    cross-seed:
        image: ghcr.io/cross-seed/cross-seed
        container_name: cross-seed
        user: 1000:1000 # optional but recommended
        ports:
            - "2468:2468" # you'll need this if your torrent client runs outside of Docker
        volumes:
            - /path/to/config/folder:/config
            - /path/to/torrent_dir:/torrents:ro # your torrent clients .torrent cache, can and should be mounted read-only (e.g. qbit: `BT_Backup` | deluge: `state` | transmission: `transmission/torrents` | rtorrent: session dir from `.rtorrent.rc`)
            - /path/to/output/folder:/cross-seeds
            - /path/to/torrent/data:/data # OPTIONAL!!! this is location of your data (used for data-based searches or linking)
              # will need to mirror your torrent client's path (like Arr's do)
        command: daemon # this enables the daemon, change to search to specifically run a search ONLY
        restart: unless-stopped
```

After that, you can use the following commands to control it:

```shell
docker-compose pull # Update the container to the latest version of cross-seed
docker-compose up -d # Create/start the container
docker start cross-seed # Start the daemon
docker stop cross-seed # Stop the daemon
docker restart cross-seed # Restart the daemon
docker logs cross-seed # view the logs
```

### Unraid

If you are running `cross-seed` on Unraid you should have installed the "Community App" from ambipro's repository, this is our official container.

Be default, the [container runs in daemon mode](../tutorials/unraid.md#automationscheduling) and no changes are needed.

We recommend you head over to the [Unraid Tutorial](../tutorials/unraid.md) for specifics and documentation for the container.

### `systemd` (Linux)

If you want to use `systemd` to run `cross-seed daemon` continuously, you can
create a unit file in `/etc/systemd/system`.

```shell
touch /etc/systemd/system/cross-seed.service
```

Open the file in your favorite editor, and paste the following code in. You'll
want to customize the following variables and ensure proper permissions are set
to allow this user/group to read/write/execute appropriately:

-   `{user}`: your user, or another user if you want to create a separate user
    for `cross-seed`
-   `{group}`: your group, or another group if you want to create a separate
    group for `cross-seed`
-   `/path/to/node`: run the command `which node` in your terminal, then paste
    the output here.

```unit file (systemd)
[Unit]
Description=cross-seed daemon
[Service]
User={user}
Group={group}
Restart=always
Type=simple
ExecStart=cross-seed daemon
[Install]
WantedBy=multi-user.target
```

After installing the unit file, you can use these commands to control the
daemon:

```shell
sudo systemctl daemon-reload # tell systemd to reindex to discover the unit file you just created
sudo systemctl enable cross-seed # enable it to run on restart
sudo systemctl start cross-seed # start the service
sudo systemctl stop cross-seed # stop the service
sudo systemctl restart cross-seed # restart the service
sudo journalctl -u cross-seed # view the logs
```

### `screen`

`screen` is a **terminal multiplexer**.

> A Terminal multiplexer is a program that can be used to multiplex login
> sessions inside the Terminal. This allows users to have multiple sessions
> inside a single Terminal window. One of the important features of the Terminal
> multiplexer is that users can attach and detach these sessions.
>
> Source: https://linuxhint.com/tmux_vs_screen/

Running a long-lived `cross-seed daemon` process in `screen` is very easy.

```shell
screen -S cross-seed -d -m cross-seed daemon
```

The above command will start a `screen` instance named `cross-seed` in
`detached` mode, running the `cross-seed daemon` command at launch.

To attach to the `screen`, run the following command:

```shell
screen -r cross-seed
```

Once attached, you can detach with `ctrl-A, D`.

## Set up automatic searches for finished downloads

The most powerful feature of Daemon Mode is the ability to search for
cross-seeds as soon as a torrent finishes downloading. However, it requires some
manual setup.

:::info
If you plan on using the [`path`](../tutorials/data-based-matching.md) [`webhook`](../reference/api.md#post-apiwebhook)
API call, you will need to [**set up data-based matching**](../tutorials/data-based-matching.md#setup) in your config file.
:::

### Step 1: Find your API key

If you have not defined your `apiKey` explicitly, `cross-seed` will generate a key for you automatically.
You will need to supply an API key with your `curl` commands. API keys can be included with your requests in one of two ways:

-   an `X-Api-Key` HTTP header
-   an `apikey` query param

In this doc we will use the query param version.

:::tip Docker
Start by shelling into your container:

```shell
docker exec -it cross-seed sh
```

:::

You can find your API key with the following command:

```shell
cross-seed api-key
```

In the rest of this doc, we will refer to this as `YOUR_API_KEY`.

### rTorrent

For rTorrent, you'll have to edit your `.rtorrent.rc` file.

1.  `cd` to the directory where `.rtorrent.rc` lives.

2.  Create a file called `rtorrent-cross-seed.sh`. It should contain the
    following contents:

    ```shell
    #!/bin/sh
    # curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode "name=$1"
    curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode "infoHash=$2"
    # curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode "path=$3"
    ```

    :::tip Docker

    You can use `http://cross-seed:2468` instead of `http://localhost:2468` with
    Docker networks. `localhost` will not work for Docker. You will need to use your
    host's IP (e.g. 192.x or 10.x) if not using custom Docker networks.

    :::

    :::tip
    You will need to pick a method of search, **infoHash is recommended** - but requires your **session directory** from `.rtorrent.rc` to
    be mounted (Docker) and set to [`torrentDir`](./options.md#torrentdir) in the config.
    :::

3.  Uncomment/Comment the appropriate lines to decide how you wish to use search.

    -   The hashtag/pound-sign `#` is used to "comment" the line - commented lines
        will not be executed.

4.  Run the following command (this will give rTorrent permission to execute
    your script):

    ```shell
    chmod +x rtorrent-cross-seed.sh
    ```

5.  Run the following commands (this will add variables and tell rTorrent to execute your script):
    ```shell
    echo 'method.insert=d.data_path,simple,"if=(d.is_multi_file),(cat,(d.directory),/),(cat,(d.directory),/,(d.name))"' >> .rtorrent.rc
    echo 'method.set_key=event.download.finished,cross_seed,"execute={'`pwd`/rtorrent-cross-seed.sh',$d.name=,$d.hash=,$d.data_path=}"' >> .rtorrent.rc
    ```

### qBittorrent

1.  In the **qBittorrent** Web UI, navigate to Tools > Options > Downloads.
2.  Check the **Run external program on torrent completion** box and enter one of
    the following in the box:
    :::tip
    You will need to pick a method of search, **infoHash is recommended** - but requires the `BT_Backup`
    folder from qBittorrent to be mounted (Docker) and/or set to [`torrentDir`](./options.md#torrentdir) in the config or it will not
    function properly.
    :::

    | Search/Criteria | Command                                                                                            |
    | --------------- | -------------------------------------------------------------------------------------------------- |
    | **Name**        | `curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode "name=%N"`     |
    | **InfoHash**    | `curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode "infoHash=%I"` |
    | **Data (Path)** | `curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode "path=%F"`     |

:::info Docker
You can use `http://cross-seed:2468` instead of `http://localhost:2468` with
Docker networks. `localhost` will not work for Docker. You will need to use your
host's IP (e.g. 192.x or 10.x) if not using custom Docker networks.

:::

3. Click "Save".

:::tip

If you are already using the **Run external program on torrent completion** box,
you should create a shell script with your preferred commands and parameters.

:::

#### Multiple Commands

If you're already using the following in the **Run external program on torrent completion** box

```shell
<curl command> %N
```

You can add infoHash searching using the following script:

```shell
    #!/bin/bash
    oldcommand ${1}
    curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode "infoHash=${2}"
```

Then add this in qBittorrent's settings to execute the script:

```shell
/bin/bash ./qBittorrent/yourscriptname.sh "%N" "%I"
```

:::info
You may need to adjust the variables above that qBittorrent sends to the script.
:::

### Transmission

1.  `cd` to the directory where `settings.json` lives.
2.  Create a file called `transmission-cross-seed.sh`. It should contain the
    following contents:

    ```shell
    #!/bin/sh
    curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode "infoHash=$TR_TORRENT_HASH"
    ```

    :::info Docker

    You can use `http://cross-seed:2468` instead of `http://localhost:2468` with
    Docker networks. `localhost` will not work for Docker. You will need to use your
    host's IP (e.g. 192.x or 10.x) if not using custom Docker networks.

    :::
    :::tip
    `cross-seed` requires your `torrents` directory from `/.config/transmission` be mounted (Docker)
    and/or set to [`torrentDir`](./options.md#torrentdir) in the config or it will not function properly.
    :::

3.  Run the following command (this will give Transmission permission to execute
    your script):

    ```shell
    chmod +x transmission-cross-seed.sh
    ```

4.  In the settings of Transmission set it to call the script when download completes:

    ```shell
    sh ./transmission-cross-seed.sh
    ```

### Deluge

1.  Create a file called `deluge-cross-seed.sh`, it should contain the
    following:

    ```shell
    #!/bin/bash
    torrentid=$1
    torrentname=$2
    torrentpath=$3
    # curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode "name=$torrentname"
    curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode "infoHash=$torrentid"
    # curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode "path=$torrentpath/$torrentname"
    ```

    :::info Docker

    You can use `http://cross-seed:2468` instead of `http://localhost:2468` with Docker networks.
    `localhost` will not work for Docker. You will need to use your host's IP (e.g. 192.x or 10.x)
    if not using custom Docker networks.

    :::

    :::tip
    You will need to pick a method of search, **infoHash is recommended** - but requires the `state`
    folder from Deluge to be mounted (Docker) and/or set to [`torrentDir`](./options.md#torrentdir) in the config or it will not
    function properly.

    :::

2.  Uncomment/Comment the appropriate lines to decide how you wish to use search.

    -   The hastag/pound-sign `#` is used to "comment" the line - commented lines
        will not be executed.

3.  Run the following command (this will give Deluge permission to execute your
    script):

    ```shell
    chmod +x deluge-cross-seed.sh
    ```

4.  In the settings of **Deluge**:
    -   Enable the Execute plugin
    -   Under **Add Command** select event of **Torrent Complete** and input the Command: `/path/to/deluge-cross-seed.sh`
    -   Press **Add** and **Apply**
    -   Restart your Deluge client/daemon (this is required to hook torrent completion calls)

## Set up RSS

Setting up RSS is very easy. Just open your config file, and set the
[`rssCadence`](../basics/options#rsscadence) option. I recommend 10 minutes:

```js
rssCadence: "10 minutes",
```

## Set up periodic searches

Setting up periodic searches is very easy. Just open your config file, and set
the [`searchCadence`](../basics/options#searchcadence) option. I recommend at least 26
weeks (biannual) for _FULL_ searches, however, you can schedule smaller searches more often with
further configuration:

```js
searchCadence: "26 weeks",
```

You can combine [`searchCadence`](../basics/options#searchcadence) with [`excludeRecentSearch`](../basics/options.md#excluderecentsearch)
and [`excludeOlder`](../basics/options#excludeolder) - and even [`searchLimit`](../basics/options#searchlimit) for a more frequent and
smoother search load. This results in searching with the following criteria applied:

-   [`excludeRecentSearch`](./options.md#excluderecentsearch) will exclude any torrents searched for **from the current moment back the specified time**.

-   [`excludeOlder`](./options.md#excludeolder) will exclude any torrents that were first discovered for cross-seeding a **longer time ago than the specified time**.

```js
searchCadence: "1 week",
excludeRecentSearch: "1 year",
excludeOlder: "1 year",
```

This will search once a week for any torrents that `cross-seed` first searched less than a year ago, and that have not been searched in the last year.

:::tip
If your `cross-seed` runs continuously with an [`rssCadence`](./options.md#rsscadence), consider reducing the frequency of, or eliminating, searching via [`searchCadence`](./options.md#searchcadence). RSS is capable of catching all releases if ran 24/7.
:::
