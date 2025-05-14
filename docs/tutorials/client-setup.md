---
id: client-setup
sidebar_position: 11
title: Torrent Client Setup Guide
---

## Comprehensive Torrent Client Setup

Setting up your torrent client correctly is critical for cross-seed to work
properly. This guide provides detailed instructions for each supported client,
with specific configurations to avoid common issues.

### General Client Requirements

Regardless of which client you choose, these requirements apply:

1. **API Access**: Your client must have its web API enabled and accessible
2. **Authentication**: Most clients require username/password credentials
3. **Access to Data**: The client must have access to your media files
4. **Compatible with Linking**: For best results, the client should support
   hardlinks/symlinks

### qBittorrent

qBittorrent is a popular choice that works well with cross-seed.

#### Basic Setup

1. **Enable Web UI**:

    - Go to Tools > Options > Web UI
    - Check "Web User Interface (Remote Control)"
    - Set a username and password
    - Note the port (default: 8080)

    ![qBittorrent Web UI Settings](https://i.imgur.com/example-image-placeholder.jpg)

2. **Configure for Linking**:

    - Go to Tools > Options > Downloads
    - For best results, set "Default Torrent Management Mode" to "Manual"
    - For best results, set "Content Layout" to "Original"

3. **Configure cross-seed**:
    ```js
    module.exports = {
    	torrentClients: ["qbittorrent:http://username:password@localhost:8080"],
    	useClientTorrents: true,
    };
    ```

#### Advanced Configuration

1. **Categories Setup**:

    - Create categories for your content types (movies, tv, etc.)
    - Consider creating a separate "cross-seed-link" category

2. **Tags for Management**:

    - Tags are useful for identifying cross-seeded torrents
    - Consider adding tags automatically via Category settings

3. **SQLite Mode Consideration**:
    - If using SQLite mode in qBittorrent 4.4+, you MUST use
      `useClientTorrents: true`

#### Troubleshooting qBittorrent

| Problem                                                      | Solution                                                    |
| ------------------------------------------------------------ | ----------------------------------------------------------- |
| "Login failed" error                                         | Double-check username/password in URL (must be URL encoded) |
| "Connection refused"                                         | Verify Web UI is enabled and port is correct                |
| Client shows but torrents don't appear                       | Verify BT_backup directory permissions                      |
| "Couldn't ensure all torrents from client are in torrentDir" | Use `useClientTorrents: true` instead                       |

### Deluge

Deluge works well with cross-seed but has some unique considerations.

#### Basic Setup

1. **Enable Web UI**:

    - Go to Preferences > Interface
    - Check "Classic Web UI"
    - Set a password (username field is ignored)
    - Note the port (default: 8112)

    ![Deluge Web UI Settings](https://i.imgur.com/example-image-placeholder.jpg)

2. **Configure for Linking**:

    - In Preferences > Downloads, set your download location

3. **Configure cross-seed**:
    ```js
    module.exports = {
    	torrentClients: ["deluge:http://:password@localhost:8112/json"],
    	torrentDir: "/home/user/.config/deluge/state",
    };
    ```

#### Advanced Configuration

1. **Labels Setup**:

    - Install the Labels plugin (if not already included)
    - Create labels for your content types

2. **Special URL Format**:
    - Deluge uses a special URL format with `:password@` (no username)
    - The URL must end with `/json`

#### Troubleshooting Deluge

| Problem                                   | Solution                          |
| ----------------------------------------- | --------------------------------- |
| "Invalid response" error                  | Verify URL ends with `/json`      |
| "Invalid credentials"                     | Check password and URL format     |
| "Could not connect"                       | Check if Deluge daemon is running |
| Special characters in password don't work | URL encode your password          |

### Transmission

Transmission is lightweight and works well with cross-seed.

#### Basic Setup

1. **Enable Remote Access**:

    - Go to Edit > Preferences > Remote
    - Check "Enable remote access"
    - Set a username and password
    - Note the port (default: 9091)

    ![Transmission Remote Access](https://i.imgur.com/example-image-placeholder.jpg)

2. **Configure cross-seed**:
    ```js
    module.exports = {
    	torrentClients: [
    		"transmission:http://username:password@localhost:9091/transmission/rpc",
    	],
    	useClientTorrents: true,
    };
    ```

#### Advanced Configuration

1. **Watch Directory Setup**:

    - Consider setting up a watch directory for new torrents
    - Add a separate watch directory for cross-seed output

2. **Tags/Labels**:
    - In newer versions of Transmission, you can use tags
    - Set up tags for identifying cross-seeded content

#### Troubleshooting Transmission

| Problem                             | Solution                                        |
| ----------------------------------- | ----------------------------------------------- |
| "401 Unauthorized" error            | Check authentication credentials                |
| "409 Conflict"                      | Transmission session ID issue; retry connection |
| Torrents don't appear in cross-seed | Check Transmission RPC path in URL              |
| Cross-seeds not added               | Verify the download directory permissions       |

### rTorrent / ruTorrent

rTorrent with ruTorrent is powerful but requires more configuration.

#### Basic Setup

1. **Enable XML-RPC**:

    - Edit your .rtorrent.rc file
    - Ensure the scgi_local or scgi_port setting is configured
    - Configure your web server (Apache/Nginx) to proxy XML-RPC requests

2. **Configure cross-seed**:

    ```js
    // For ruTorrent installations:
    module.exports = {
    	torrentClients: [
    		"rtorrent:http://username:password@localhost/rutorrent/plugins/httprpc/action.php",
    	],
    	torrentDir: "/path/to/rtorrent/session/directory",
    };

    // For direct rTorrent RPC:
    module.exports = {
    	torrentClients: ["rtorrent:http://username:password@localhost/RPC2"],
    	torrentDir: "/path/to/rtorrent/session/directory",
    };
    ```

#### Advanced Configuration

1. **Session Directory Setup**:

    - Make sure your session directory is set in .rtorrent.rc:

    ```
    session.path.set = /path/to/session/
    ```

2. **Watch Directory Configuration**:
    - Configure watch directories in .rtorrent.rc:
    ```
    schedule2 = watch_directory,5,5,"load.start=/path/to/watch/*.torrent"
    ```

#### Troubleshooting rTorrent

| Problem                                       | Solution                                   |
| --------------------------------------------- | ------------------------------------------ |
| "Could not connect to server"                 | Check XML-RPC URL and server configuration |
| "401 Unauthorized"                            | Verify authentication credentials          |
| "Cannot call method 'multicall' of undefined" | XML-RPC path is incorrect                  |
| Torrents don't start after injection          | Disable stop_untied= schedule              |

### Multiple Clients Configuration

You can configure cross-seed to work with multiple torrent clients
simultaneously.

#### Basic Multi-Client Setup

```js
module.exports = {
	torrentClients: [
		"qbittorrent:http://username:password@localhost:8080",
		"deluge:http://:password@localhost:8112/json",
		"transmission:readonly:http://username:password@localhost:9091/transmission/rpc",
	],
	useClientTorrents: true,
};
```

#### Using Read-Only Clients

Adding `readonly:` after the client type makes cross-seed use that client as a
source but never inject into it:

```js
"transmission:readonly:http://username:password@localhost:9091/transmission/rpc";
```

This is useful for:

- Cross-seeding from one client to another
- Using a client for searching but not for injecting
- Migrating between clients

#### Client Priority

Clients are prioritized in the order they're listed. For example:

```js
torrentClients: [
    // Primary client (highest priority)
    "qbittorrent:http://username:password@localhost:8080",
    // Secondary client
    "deluge:http://:password@localhost:8112/json",
],
```

When cross-seed finds a match, it will:

1. Check if the torrent exists in any client
2. If not, inject into the first non-readonly client in the list

### Client Webhook Setup

Setting up webhooks lets cross-seed know when torrents complete, triggering
immediate searches.

#### qBittorrent Webhook

1. Go to Tools > Options > Downloads
2. Enable "Run external program on torrent completion"
3. Enter this command:
    ```
    curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY -d "infoHash=%I" -d "includeSingleEpisodes=true"
    ```

#### Deluge Webhook

1. Create a file called `deluge-cross-seed.sh`:
    ```bash
    #!/bin/bash
    infoHash=$1
    curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY -d "infoHash=$infoHash" -d "includeSingleEpisodes=true"
    ```
2. Make it executable: `chmod +x deluge-cross-seed.sh`
3. Enable the Execute plugin
4. Add command for "Torrent Complete" event: `/path/to/deluge-cross-seed.sh`

#### Transmission Webhook

1. Create `transmission-cross-seed.sh`:
    ```bash
    #!/bin/sh
    curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY -d "infoHash=$TR_TORRENT_HASH" -d "includeSingleEpisodes=true"
    ```
2. Make it executable: `chmod +x transmission-cross-seed.sh`
3. Configure Transmission to run this script on completion

#### rTorrent Webhook

1. Create `rtorrent-cross-seed.sh`:
    ```bash
    #!/bin/sh
    curl -XPOST http://localhost:2468/api/webhook?apikey=YOUR_API_KEY -d "infoHash=$2" -d "includeSingleEpisodes=true"
    ```
2. Make it executable: `chmod +x rtorrent-cross-seed.sh`
3. Add to your .rtorrent.rc:
    ```
    method.set_key=event.download.finished,cross_seed,"execute=bash,/path/to/rtorrent-cross-seed.sh,$d.name=,$d.hash="
    ```

### Client Compatibility Matrix

| Feature           | qBittorrent        | Deluge | Transmission | rTorrent |
| ----------------- | ------------------ | ------ | ------------ | -------- |
| useClientTorrents | ✓                  | ✗      | ✓            | ✓        |
| Categories/Labels | ✓                  | ✓      | Partial      | ✓        |
| Content Layout    | Original/Subfolder | N/A    | N/A          | N/A      |
| Webhook Support   | ✓                  | ✓      | ✓            | ✓        |
| WebUI Requirement | ✓                  | ✓      | ✓            | ✓        |
| Special Paths     | BT_backup          | state  | torrents     | session  |

### Sonarr/Radarr Integration

When integrating with Sonarr/Radarr, these settings are recommended:

```js
module.exports = {
	// For native install with Sonarr/Radarr
	// Choose one:
	duplicateCategories: true, // Option 1: Use duplicate categories
	// OR
	linkDirs: ["/data/torrents/links"], // Option 2: Use linking (preferred)
};
```

This ensures cross-seed's torrents don't interfere with Sonarr/Radarr's import
process.

### Client Security Considerations

To securely set up your torrent client:

1. **Use Strong Passwords**:

    - Avoid default credentials
    - Use complex passwords with special characters

2. **IP Restrictions**:

    - Limit API access to local network or specific IPs
    - For qBittorrent: Settings > Web UI > IP address

3. **HTTPS (when possible)**:

    - Configure reverse proxy with SSL for web UI
    - Update cross-seed config to use https URLs

4. **Authentication Encoding**:
    - For special characters in passwords, use URL encoding
    - Example: ! becomes %21, # becomes %23

By following these detailed client setup instructions, you'll ensure that
cross-seed can seamlessly integrate with your torrent client and maximize your
cross-seeding potential.
