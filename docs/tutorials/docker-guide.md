---
id: docker-guide
sidebar_position: 9
title: Docker Configuration Guide
---

## Docker Setup for cross-seed

Setting up cross-seed with Docker requires careful attention to container paths,
networking, and permissions. This comprehensive guide will help you avoid common
pitfalls and create a robust configuration.

### Understanding Docker Concepts for cross-seed

Docker containers run in isolated environments, which means:

1. **Container Paths vs Host Paths**: Paths inside containers are different from
   host paths
2. **Container Networking**: Containers must explicitly connect to communicate
3. **Filesystem Access**: Containers only see mounted volumes
4. **Linux Environment**: All Docker containers run Linux, even on Windows/Mac

### Path Mapping Fundamentals

The most critical concept for cross-seed in Docker is **path consistency**. For
linking and torrent client integration to work properly:

- cross-seed must see the same paths as your torrent client
- For hardlinks/reflinks, paths must be on the same Docker volume

#### ✓ Correct Path Setup Example

```
HOST                           CONTAINER (cross-seed)    CONTAINER (qBittorrent)
/data/media/movies    ───→     /data/movies      ←───    /data/movies
/data/media/tv        ───→     /data/tv          ←───    /data/tv
/data/torrents        ───→     /data/torrents    ←───    /data/torrents
```

#### ✗ Incorrect Path Setup Example

```
HOST                           CONTAINER (cross-seed)    CONTAINER (qBittorrent)
/data/media/movies    ───→     /media/movies     ←───    /downloads/movies
/data/media/tv        ───→     /media/tv         ←───    /downloads/tv
/data/torrents        ───→     /data/torrents    ←───    /torrents
```

### Docker Compose Example

Here's a complete docker-compose example with proper path mapping:

```yaml
version: "3"
services:
    cross-seed:
        container_name: cross-seed
        image: ghcr.io/cross-seed/cross-seed:6
        restart: unless-stopped
        ports:
            - "2468:2468"
        environment:
            - PUID=1000
            - PGID=1000
            - TZ=America/New_York
            - CONFIG_DIR=/config
            - NODE_OPTIONS=--max-old-space-size=512
        volumes:
            - ./config:/config
            - /data:/data
        command: daemon
        networks:
            - torrenting

    qbittorrent:
        container_name: qbittorrent
        image: linuxserver/qbittorrent
        restart: unless-stopped
        ports:
            - "8080:8080"
            - "6881:6881"
            - "6881:6881/udp"
        environment:
            - PUID=1000
            - PGID=1000
            - TZ=America/New_York
            - WEBUI_PORT=8080
        volumes:
            - ./qbittorrent:/config
            - /data:/data
        networks:
            - torrenting

    prowlarr:
        container_name: prowlarr
        image: linuxserver/prowlarr
        restart: unless-stopped
        ports:
            - "9696:9696"
        environment:
            - PUID=1000
            - PGID=1000
            - TZ=America/New_York
        volumes:
            - ./prowlarr:/config
        networks:
            - torrenting

networks:
    torrenting:
        driver: bridge
```

### Configuration for Docker

When configuring cross-seed in Docker, use container paths in your config.js:

```js
module.exports = {
	// Use container paths, not host paths
	linkDirs: ["/data/torrents/cross-seed-links"],
	dataDirs: ["/data/media/movies", "/data/media/tv"],

	// Use container hostnames
	torznab: ["http://prowlarr:9696/1/api?apikey=yourapikey"],

	// Use container hostnames
	torrentClients: ["qbittorrent:http://admin:adminadmin@qbittorrent:8080"],
};
```

### Docker Permissions

Ensure that all containers use the same user ID (PUID) and group ID (PGID) to
avoid permission issues:

```yaml
environment:
    - PUID=1000 # Must match across containers
    - PGID=1000 # Must match across containers
```

To find your user's ID and group ID, run:

```bash
id $(whoami)
```

### Hardlinks and Docker

For hardlinks to work in Docker:

1. Mount the **same** volume to both containers
2. Use the **same** path structure in both containers
3. Ensure same PUID/PGID across containers

#### Hardlink-Compatible Example

```yaml
# cross-seed container
volumes:
  - /data:/data

# qbittorrent container
volumes:
  - /data:/data
```

### Docker Networking

Use Docker's networking to allow containers to communicate by hostname:

```yaml
networks:
    torrenting:
        driver: bridge
```

Then add each container to this network:

```yaml
services:
    cross-seed:
        # ...other settings...
        networks:
            - torrenting

    qbittorrent:
        # ...other settings...
        networks:
            - torrenting
```

With this setup, containers can refer to each other by name (e.g.,
`http://qbittorrent:8080`).

### VPN Considerations

If running your torrent client behind a VPN container:

1. Either put cross-seed behind the same VPN
2. Or configure split tunneling in your VPN for local access

Example of a cross-seed configuration with VPN networking:

```yaml
services:
    vpn:
        container_name: vpn
        # ...VPN container configuration...
        networks:
            - torrenting

    qbittorrent:
        network_mode: "service:vpn"

    cross-seed:
        # ...other settings...
        networks:
            - torrenting
```

In this setup, you would access qBittorrent through the VPN container's IP.

### Common Docker Issues

#### Cannot Connect to Torrent Client

Check these common problems:

1. Using `localhost` instead of container name in URLs
2. Incorrect port mapping
3. VPN blocking internal access
4. Firewall rules

#### Linking Not Working

Verify these settings:

1. Same volume mounted to both containers
2. Same path structure in both containers
3. Matching PUID/PGID
4. Filesystem supports hardlinks/symlinks

#### "EADDRINUSE" Error

This happens when:

1. Another service is using port 2468
2. Previous cross-seed instance didn't shut down properly

Solution:

```bash
# Find the process using port 2468
lsof -i :2468
# Kill the process
kill <PID>
```

### Docker Volume Management

Use named volumes for persistent data:

```yaml
volumes:
    cross_seed_config:
        driver: local

services:
    cross-seed:
        volumes:
            - cross_seed_config:/config
            - /data:/data
```

### Docker Maintenance

To update cross-seed in Docker:

```bash
docker-compose pull cross-seed
docker-compose up -d cross-seed
```

To view logs:

```bash
docker logs -f cross-seed
```

### Platform-Specific Notes

#### Windows + Docker Desktop

- Use forward slashes in paths
- Docker Desktop runs in a VM, so paths start at the VM root
- WSL2 integration improves filesystem performance

#### Unraid

- Use user shares for consistent paths
- Set container paths to match user share paths

#### Synology

- Use shared folders for volume mounts
- Ensure permissions are set correctly on shared folders

### Troubleshooting Flowchart

Here's a step-by-step approach to diagnose Docker issues:

1. **Can cross-seed start properly?**

    - If no → Check config.js syntax and container logs
    - If yes → Continue

2. **Can cross-seed connect to Prowlarr/Jackett?**

    - If no → Check network settings and Torznab URLs
    - If yes → Continue

3. **Can cross-seed connect to torrent client?**

    - If no → Check client API settings and URL
    - If yes → Continue

4. **Are torrent injections working?**

    - If no → Check permissions and paths
    - If yes → Continue

5. **Is linking working correctly?**
    - If no → Check volume mounts and filesystem support
    - If yes → Your setup is working!

### Testing Your Docker Setup

Run these commands to verify your Docker configuration:

1. Check cross-seed is running:

    ```bash
    docker ps | grep cross-seed
    ```

2. Check cross-seed can access your volumes:

    ```bash
    docker exec -it cross-seed ls -la /data
    ```

3. Test network connectivity:

    ```bash
    docker exec -it cross-seed curl -v qbittorrent:8080
    ```

4. Verify file permission compatibility:
    ```bash
    docker exec -it cross-seed id
    docker exec -it qbittorrent id
    ```

This comprehensive guide should help you set up a robust cross-seed Docker
environment and avoid common pitfalls.
