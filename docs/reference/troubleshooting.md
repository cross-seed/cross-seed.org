---
id: troubleshooting
title: Comprehensive Troubleshooting
sidebar_position: 5
---

# Comprehensive Troubleshooting Guide

This guide provides systematic approaches to diagnose and fix common issues with
cross-seed.

## Diagnostic Process

Before diving into specific issues, follow this general troubleshooting flow:

1. **Check the logs** at `<config dir>/logs/verbose.current.log`
2. **Verify configuration** using `cross-seed daemon` (shows validation errors)
3. **Test connectivity** to your clients and indexers
4. **Check permissions** on relevant directories
5. **Restart the daemon** after making changes

## Common Issues and Solutions

### Startup Issues

#### `SyntaxError: Unexpected identifier`

This error indicates a JavaScript syntax problem in your config.js file.

**Common causes:**

- Missing commas between options
- Extra commas after the last option
- Missing quotes around strings
- Unescaped special characters in strings

**Solutions:**

```js
// ✗ INCORRECT
module.exports = {
    delay: 30
    torznab: ["http://localhost:9696/1/api?apikey=yourkey"]
    linkDirs: ["/data/torrents/links"]
}

// ✓ CORRECT
module.exports = {
    delay: 30,
    torznab: ["http://localhost:9696/1/api?apikey=yourkey"],
    linkDirs: ["/data/torrents/links"]
};
```

#### `RangeError: WebAssembly.instantiate(): Out of memory`

This error occurs when there's not enough virtual memory for WebAssembly
compilation.

**Solutions:**

1. Upgrade to Node.js v20.15+
2. Set the NODE_OPTIONS environment variable:
    ```bash
    NODE_OPTIONS=--disable-wasm-trap-handler cross-seed daemon
    ```
3. For Docker, add this to your environment variables:
    ```yaml
    environment:
        - NODE_OPTIONS=--disable-wasm-trap-handler
    ```

#### `val is not a non-empty string`

This indicates a corrupted database.

**Solution:**

1. Stop cross-seed
2. Delete `config.db` from your config directory
3. If it's a new instance, also clear the `torrent_cache` directory
4. Restart cross-seed

#### `EADDRINUSE` Error

This occurs when another process is using the same port.

**Solutions:**

1. Find the process using the port:
    ```bash
    lsof -i :2468
    ```
2. Kill the process:
    ```bash
    kill <PID>
    ```
3. Or change the port in config.js:
    ```js
    port: 2469,
    ```

### Client Connection Issues

#### Cannot Connect to Torrent Client

**Common causes:**

- Incorrect URL or credentials
- Client web UI not enabled
- Network issues between cross-seed and client
- VPN blocking access

**Solutions:**

1. **Verify client settings:**

    ```bash
    # Test connection to qBittorrent
    curl -v http://username:password@localhost:8080/api/v2/app/version

    # Test connection to Deluge
    curl -v -X POST -H "Content-Type: application/json" --data '{"method":"auth.login","params":["password"],"id":1}' http://localhost:8112/json

    # Test connection to Transmission
    curl -v http://username:password@localhost:9091/transmission/rpc
    ```

2. **Docker network issues:**

    - Use container names instead of localhost
    - Ensure containers are on the same network
    - Check logs for network-related errors

3. **VPN interference:**
    - Configure split tunneling for local traffic
    - Use the VPN container's IP address instead of hostname
    - Check if your VPN allows LAN access

#### `Could not ensure all torrents from the torrent client are in torrentDir`

This happens when torrentDir doesn't match your client's actual torrent storage
location.

**Solutions:**

1. Switch to `useClientTorrents: true` (recommended)
2. Or set the correct path:
    - qBittorrent: `/path/to/qBittorrent/BT_backup`
    - Deluge: `/path/to/deluge/state`
    - Transmission: `/path/to/transmission/torrents`
    - rTorrent: Your session directory from `.rtorrent.rc`

#### Login Failed or Authentication Issues

**Common causes:**

- Incorrect username/password
- Special characters in password not URL-encoded

**Solutions:**

1. Double-check credentials
2. URL-encode special characters:
    ```js
    // If password is p@$$w0rd#!
    torrentClients: [
        "qbittorrent:http://username:p%40%24%24w0rd%23%21@localhost:8080"
    ],
    ```
3. For Deluge, remember the username is ignored; use `:password@`:
    ```js
    torrentClients: [
        "deluge:http://:password@localhost:8112/json"
    ],
    ```

### Linking Issues

#### "Error: EXDEV: cross-device link not permitted"

This happens when trying to create hardlinks across different filesystems.

**Solutions:**

1. Ensure source and destination are on the same filesystem
2. For Docker, ensure both paths are in the same volume:
    ```yaml
    volumes:
        - /data:/data # One volume for all data
    ```
3. Switch to symlinks if hardlinks aren't possible:
    ```js
    linkType: "symlink",
    ```

#### "Error: EACCES: permission denied"

This indicates a permissions problem.

**Solutions:**

1. Check ownership of relevant directories:
    ```bash
    ls -la /path/to/data
    ls -la /path/to/linkDirs
    ```
2. Ensure cross-seed runs as the same user as your torrent client
3. For Docker, set matching PUID/PGID:
    ```yaml
    environment:
        - PUID=1000
        - PGID=1000
    ```

#### Hardlinks Not Working in Docker

**Common causes:**

- Different volumes for source and destination
- Different paths between containers
- Using bind mounts with different paths

**Solutions:**

1. Use a single volume for all data:
    ```yaml
    volumes:
        - /data:/data # Mount the same volume to all containers
    ```
2. Ensure path consistency between containers:
    ```yaml
    # Both containers see the same path
    cross-seed:
        volumes:
            - /data:/data
    qbittorrent:
        volumes:
            - /data:/data
    ```

### Search and Matching Issues

#### No Matches Found

**Common causes:**

- matchMode too strict
- Insufficient indexers configured
- File naming differences

**Solutions:**

1. Try more flexible matching:
    ```js
    matchMode: "partial",
    ```
2. Add more torznab sources:
    ```js
    torznab: [
        "http://prowlarr:9696/1/api?apikey=key1",
        "http://prowlarr:9696/2/api?apikey=key2",
        // Add more indexers
    ],
    ```
3. Check for file tree differences:
    ```bash
    cross-seed diff /path/to/torrent1.torrent /path/to/torrent2.torrent
    ```

#### "it has a different file tree" in Logs

This indicates that file structures don't match between torrents.

**Solutions:**

1. Use partial matching:
    ```js
    matchMode: "partial",
    ```
2. Use the diff tool to see what's different:
    ```bash
    cross-seed diff /path/to/torrent1.torrent /path/to/torrent2.torrent
    ```

#### "Torrent is not suitable for searching"

This happens when torrents are filtered by your configuration.

**Common causes:**

- excludeOlder or excludeRecentSearch filtering
- blocklist matches
- Size/type filtering

**Solutions:**

1. Check the verbose logs for `[prefilter]` entries
2. To search everything, override time-based exclusions:
    ```bash
    curl -XPOST http://localhost:2468/api/job?apikey=YOUR_API_KEY \
      -d 'name=search' \
      -d 'ignoreExcludeRecentSearch=true' \
      -d 'ignoreExcludeOlder=true'
    ```

#### "error parsing torrent at http://…"

This means the indexer didn't return a valid torrent file.

**Solutions:**

1. Check if you're being rate-limited by the indexer
2. Increase the snatch timeout:
    ```js
    snatchTimeout: "60 seconds",
    ```
3. Verify the indexer is functioning correctly

### Injection Issues

#### "Failed to inject, saving instead"

This means injection to the client failed.

**Common causes:**

- Client connection issues
- Permission problems
- Path issues

**Solutions:**

1. Check verbose logs for the specific error
2. Verify client connectivity
3. Check linkDir permissions and availability
4. Ensure the save path is accessible to your client

#### Missing Files Error After Injection

**Common causes:**

- Incorrect paths between cross-seed and client
- Permission issues
- Failed linking

**Solutions:**

1. Ensure paths are identical between cross-seed and client
2. Check permissions of all relevant directories
3. For Docker, ensure volumes are mounted consistently

#### Torrents Showing as Incomplete After Injection

**Common causes:**

- Partial matches needing download
- Recheck not completed

**Solutions:**

1. Check the "Pieces" tab in your client to see what's missing
2. For partial matches, this is expected - missing files need to be downloaded
3. Configure auto-resume settings:
    ```js
    autoResumeMaxDownload: 104857600, // 100MB
    ignoreNonRelevantFilesToResume: true,
    ```

### Docker-Specific Issues

#### Cannot Access Services Between Containers

**Solutions:**

1. Create a Docker network and add all containers to it:

    ```yaml
    networks:
        torrenting:
            driver: bridge

    services:
        cross-seed:
            networks:
                - torrenting
        qbittorrent:
            networks:
                - torrenting
    ```

2. Use container names instead of localhost:
    ```js
    torznab: [
        "http://prowlarr:9696/1/api?apikey=yourkey",
    ],
    torrentClients: [
        "qbittorrent:http://username:password@qbittorrent:8080",
    ],
    ```

#### VPN Blocking Access

**Solutions:**

1. Use the VPN container's IP instead of hostname:
    ```js
    torrentClients: [
        "qbittorrent:http://username:password@172.17.0.3:8080",
    ],
    ```
2. Configure split tunneling in your VPN
3. Place cross-seed behind the same VPN:
    ```yaml
    services:
        vpn:
            # VPN container config

        qbittorrent:
            network_mode: "service:vpn"

        cross-seed:
            network_mode: "service:vpn"
    ```

### Config-Related Issues

#### Windows Path Issues

**Common causes:**

- Single backslashes causing escape character problems
- Path format inconsistencies

**Solutions:** Use double backslashes in all Windows paths:

```js
// ✗ INCORRECT
linkDirs: ["C:\Users\Name\Downloads\links"],

// ✓ CORRECT
linkDirs: ["C:\\Users\\Name\\Downloads\\links"],
```

#### Unraid Path Issues

**Common causes:**

- Using cache paths instead of user share paths
- Permission problems with user/group IDs

**Solutions:**

1. Use user share paths in your config:
    ```js
    linkDirs: ["/mnt/user/data/torrents/links"],
    ```
2. Set correct permissions in the container:
    ```yaml
    environment:
        - PUID=99 # Your Unraid user ID
        - PGID=100 # Your Unraid group ID
    ```

## Log Interpretation Guide

### Common Log Messages

#### "[prefilter] skipping searchee: ..."

This message explains why a torrent was excluded from searching.

- **excluded by size**: The torrent falls below minSize or above maxSize
- **excluded by content type**: Non-video content with includeNonVideos: false
- **excluded by age**: Matches excludeOlder setting
- **excluded by recent search**: Matches excludeRecentSearch setting
- **excluded by blocklist**: Matches an entry in your blocklist

#### "[match] rejected: ..."

This explains why a potential match was rejected.

- **it has a different file tree**: File structure doesn't match
- **it's too different in size**: Size difference exceeds fuzzySizeThreshold
- **it has the same infohash**: Already have this exact torrent
- **error accessing data**: Problems accessing the files

#### "[inject] failed: ..."

These messages indicate injection problems.

- **client error**: The torrent client returned an error
- **cannot find linkDir on same filesystem**: Hardlinking failed
- **torrent already exists in client**: Already added

## Troubleshooting Flowcharts

### Startup Issues Flowchart

```
Start
  │
  ├─ cross-seed starts without errors → Done
  │
  ├─ SyntaxError in config.js
  │   └─ Check for: missing commas, quotes, brackets
  │
  ├─ RangeError: WebAssembly.instantiate()
  │   └─ Set NODE_OPTIONS=--disable-wasm-trap-handler
  │
  ├─ val is not a non-empty string
  │   └─ Delete config.db
  │
  └─ EADDRINUSE
      └─ Change port or kill existing process
```

### Client Connection Flowchart

```
Start
  │
  ├─ Can connect to client? → Yes → Done
  │
  ├─ Login failed
  │   └─ Check credentials, URL-encode special chars
  │
  ├─ Connection refused/timeout
  │   └─ Check network connectivity, VPN settings
  │
  ├─ Docker networking issue
  │   └─ Use container names instead of localhost
  │
  └─ Client configuration issue
      └─ Enable WebUI, check port and settings
```

### Linking Flowchart

```
Start
  │
  ├─ Linking works? → Yes → Done
  │
  ├─ EXDEV: cross-device link
  │   └─ Ensure source/destination on same filesystem
  │
  ├─ EACCES: permission denied
  │   └─ Check directory permissions and ownership
  │
  ├─ Docker volume issues
  │   └─ Use consistent paths, single volume
  │
  └─ Filesystem doesn't support hardlinks
      └─ Switch to symlinks or reflinks
```

## Advanced Diagnostic Commands

### Testing Connectivity

```bash
# Test HTTP connectivity to torrent client
curl -v http://username:password@localhost:8080/api/v2/app/version

# Test if paths are accessible
ls -la /path/to/data
ls -la /path/to/linkDir

# Test hardlink capability
touch /path/to/source/testfile
ln /path/to/source/testfile /path/to/destination/testlink
```

### Checking Logs

```bash
# View latest verbose logs
cat ~/.cross-seed/logs/verbose.current.log | grep ERROR

# Filter logs by category
cat ~/.cross-seed/logs/verbose.current.log | grep "\[match\]"
cat ~/.cross-seed/logs/verbose.current.log | grep "\[inject\]"
```

### Database Management

```bash
# Clear client cache if you've changed clients
cross-seed clear-client-cache

# Clear indexer failures if you've fixed indexer issues
cross-seed clear-indexer-failures
```

### Debugging Docker Issues

```bash
# Check container network
docker network inspect bridge

# Get container IP addresses
docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -q)

# Test network between containers
docker exec -it cross-seed ping qbittorrent
```

## When to Get Help

If you've tried all the relevant troubleshooting steps and still have issues:

1. Gather this information:

    - Your config.js file (with passwords/API keys redacted)
    - The relevant portion of verbose.current.log
    - A description of your setup (OS, Docker/native, client)
    - Steps you've already tried

2. Connect to the cross-seed Discord for community support
