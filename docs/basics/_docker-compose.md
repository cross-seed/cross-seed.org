<!-- prettier-ignore -->
```yaml
version: "2.1"
services:
  cross-seed:
    image: ghcr.io/cross-seed/cross-seed:6
    container_name: cross-seed
    user: 1000:1000 # this must match your torrent client (cross-seed does not support using PGID and PUID)
    ports:
      - "2468:2468"
    volumes:
      - /path/to/config/folder:/config
      - # You will need at least one extra volume for your media drive if using https://www.cross-seed.org/docs/tutorials/linking
    command: daemon
    restart: unless-stopped
```
