---
id: managing-the-daemon
sidebar_position: 1
title: Managing the Daemon
---

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
            - "2468:2468" # if you are using the HTTP API
        volumes:
            - /path/to/config/folder:/config
            - /path/to/torrent_dir:/path/to/torrent_dir:ro # your torrent clients .torrent cache, can and should be mounted read-only (e.g. qbit: `BT_Backup` | deluge: `state` | transmission: `transmission/torrents` | rtorrent: session dir from `.rtorrent.rc`)
            - /path/to/output/folder:/cross-seeds
        command: daemon
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

If you are running `cross-seed` on Unraid you should have installed the
"Community App" from ambipro's repository, this is our official container.

Be default, the
[container runs in daemon mode](../tutorials/unraid.md#automationscheduling) and
no changes are needed.

We recommend you head over to the [Unraid Tutorial](../tutorials/unraid.md) for
specifics and documentation for the container.

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

:::info 

Depending on how you installed cross-seed, you may need to specify
absolute paths to `node` and/or `cross-seed`.

:::

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

### Windows

If you have a working setup for Windows using NSSM or something, we'd love to
hear from you! Click on the "Edit this page" button below to help us out.
