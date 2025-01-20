<!-- prettier-ignore -->
```yaml
version: "2.1"
services:
  cross-seed:
    image: ghcr.io/cross-seed/cross-seed:6
    container_name: cross-seed
    user: 1000:1000 # optional but recommended
    ports:
      - "2468:2468"
    volumes:
      - /path/to/config/folder:/config
      - /path/to/torrent_dir:/torrents:ro # (unnecessary with useClientTorrents) your torrent clients .torrent cache, can and should be mounted read-only (e.g. qbit:`BT_Backup` | deluge: `state` | transmission: `transmission/torrents` | rtorrent: session dir from `.rtorrent.rc`)
      - /path/to/output/folder:/cross-seeds
    command: daemon
    restart: unless-stopped
```
