---
id: path-mapping
sidebar_position: 4
title: Path Mapping Guide
---

## Understanding Path Mapping in cross-seed

Path mapping is one of the most critical concepts to understand for successful
cross-seeding. This guide will help you understand how paths work in different
environments and how to properly configure them.

### Why Path Mapping Matters

For cross-seed to work properly, these conditions must be met:

1. **Path Consistency**: cross-seed must see the same file paths as your torrent
   client
2. **Path Accessibility**: cross-seed must have permission to access all
   relevant paths
3. **Path Compatibility**: For hardlinks/reflinks, paths must be on the same
   filesystem

Incorrect path mapping is the #1 cause of issues with cross-seed.

### Path Structure Fundamentals

Let's start with a basic example of a typical media storage structure:

```
/data/
├── torrents/
│   ├── movies/
│   │   └── Movie.2023.1080p.BluRay.x264/
│   │       └── movie.mkv
│   └── tv/
│       └── Show.S01.1080p.WEB-DL/
│           └── show.s01e01.mkv
├── media/
│   ├── movies/
│   │   └── Movie (2023)/
│   │       └── Movie.mkv
│   └── tv/
│       └── Show/
│           └── Season 01/
│               └── Show - S01E01.mkv
└── cross-seed-links/
    ├── TrackerA/
    │   └── Movie.2023.1080p.BluRay.x264/
    │       └── movie.mkv (hardlink)
    └── TrackerB/
        └── Show.S01.1080p.WEB-DL/
            └── show.s01e01.mkv (hardlink)
```

### Path Mapping in Different Environments

#### Native Installation (Linux/macOS/Windows)

In a native installation, paths are straightforward - you use the actual
filesystem paths.

**Linux/macOS Configuration Example:**

```js
module.exports = {
	linkDirs: ["/data/cross-seed-links"],
	dataDirs: ["/data/media/movies", "/data/media/tv"],
	torrentDir: "/home/user/.config/qBittorrent/BT_backup",
};
```

**Windows Configuration Example:**

```js
module.exports = {
	linkDirs: ["D:\\data\\cross-seed-links"],
	dataDirs: ["D:\\data\\media\\movies", "D:\\data\\media\\tv"],
	torrentDir: "C:\\Users\\Username\\AppData\\Local\\qBittorrent\\BT_backup",
};
```

:::caution Windows Paths

Windows paths must use double backslashes (`\\`)
because the backslash is an escape character in JavaScript. A single backslash
would cause syntax errors.

:::

#### Docker Environment

Docker adds complexity because containers have their own filesystem view. The
key is to mount volumes consistently across containers.

**Host vs Container Paths:**

| Host Path                | cross-seed Container     | qBittorrent Container    |
| ------------------------ | ------------------------ | ------------------------ |
| `/data/torrents`         | `/data/torrents`         | `/data/torrents`         |
| `/data/media`            | `/data/media`            | `/data/media`            |
| `/data/cross-seed-links` | `/data/cross-seed-links` | `/data/cross-seed-links` |

**Docker Configuration Example:**

```js
module.exports = {
	linkDirs: ["/data/cross-seed-links"],
	dataDirs: ["/data/media/movies", "/data/media/tv"],
	torrentClients: ["qbittorrent:http://admin:adminadmin@qbittorrent:8080"],
};
```

:::tip 

Docker Paths always use the paths as they appear **inside** the
container, not the host paths.

:::

### Path Mapping Visualization

#### Correct Path Mapping:

```mermaid
flowchart TD
    subgraph HostSystem["Host System"]
        HostTorrents["/data/torrents"]
        HostLinks["/data/cross-seed-links"]
    end

    subgraph CrossSeed["cross-seed container"]
        CSTorrents["/data/torrents"]
        CSLinks["/data/cross-seed-links"]
    end

    subgraph QBit["qBittorrent container"]
        QBTorrents["/data/torrents"]
        QBLinks["/data/cross-seed-links"]
    end

    HostTorrents --- CSTorrents
    HostTorrents --- QBTorrents
    HostLinks --- CSLinks
    HostLinks --- QBLinks

    CSTorrents <--> QBTorrents
    CSLinks <--> QBLinks

    classDef container fill:#f9f9f9,stroke:#333,stroke-width:2px
    classDef host fill:#e0f0ff,stroke:#0066cc,stroke-width:2px

    class CrossSeed,QBit container
    class HostSystem host
```

#### Incorrect Path Mapping:

```mermaid
flowchart TD
    subgraph HostSystem["Host System"]
        HostTorrents["/data/torrents"]
        HostLinks["/data/cross-seed-links"]
    end

    subgraph CrossSeed["cross-seed container"]
        CSTorrents["/torrents"]
        CSLinks["/cross-seed-links"]
    end

    subgraph QBit["qBittorrent container"]
        QBTorrents["/downloads"]
        QBLinks["/links"]
    end

    HostTorrents --- CSTorrents
    HostTorrents --- QBTorrents
    HostLinks --- CSLinks
    HostLinks --- QBLinks

    CSTorrents <-->|❌ Different paths!| QBTorrents
    CSLinks <-->|❌ Different paths!| QBLinks

    classDef container fill:#f9f9f9,stroke:#333,stroke-width:2px
    classDef host fill:#e0f0ff,stroke:#0066cc,stroke-width:2px
    classDef error fill:#fff0f0,stroke:#cc0000,stroke-width:2px

    class CrossSeed,QBit container
    class HostSystem host
    class QBTorrents,QBLinks error
```

### Path Mapping for Different Setups

#### Standalone Media Server

For a standalone server with all services running locally:

```js
module.exports = {
	linkDirs: ["/data/cross-seed-links"],
	dataDirs: ["/data/media"],
	useClientTorrents: true,
	torrentClients: ["qbittorrent:http://admin:adminadmin@localhost:8080"],
};
```

#### Seedbox with Docker

For a typical seedbox setup using Docker:

```js
module.exports = {
	linkDirs: ["/data/cross-seed-links"],
	dataDirs: ["/data/media"],
	useClientTorrents: true,
	torrentClients: ["qbittorrent:http://admin:adminadmin@qbittorrent:8080"],
};
```

#### Multiple Drives Setup

For a system with multiple drives:

```js
module.exports = {
	// Multiple linkDirs for different drives
	linkDirs: ["/mnt/disk1/cross-seed-links", "/mnt/disk2/cross-seed-links"],
	dataDirs: ["/mnt/disk1/media", "/mnt/disk2/media"],
	useClientTorrents: true,
	torrentClients: ["qbittorrent:http://admin:adminadmin@localhost:8080"],
};
```

### Special Filesystem Considerations

#### Drive Pooling (mergerfs, DrivePool, etc.)

If you're using drive pooling:

```js
module.exports = {
	// With drive pooling, you typically need only one linkDir
	linkDirs: ["/mnt/pool/cross-seed-links"],
	dataDirs: ["/mnt/pool/media"],
	useClientTorrents: true,
	torrentClients: ["qbittorrent:http://admin:adminadmin@localhost:8080"],
};
```

#### NAS-Specific Paths

For Synology NAS:

```js
module.exports = {
	linkDirs: ["/volume1/data/cross-seed-links"],
	dataDirs: ["/volume1/data/media"],
	useClientTorrents: true,
	torrentClients: ["qbittorrent:http://admin:adminadmin@localhost:8080"],
};
```

For QNAP NAS:

```js
module.exports = {
	linkDirs: ["/share/CACHEDEV1_DATA/cross-seed-links"],
	dataDirs: ["/share/CACHEDEV1_DATA/media"],
	useClientTorrents: true,
	torrentClients: ["qbittorrent:http://admin:adminadmin@localhost:8080"],
};
```

### Path Validation and Troubleshooting

#### How to Validate Your Paths

1. **Check if cross-seed can see your paths:**

```bash
# For native installation
ls -la /your/path/here

# For Docker
docker exec -it cross-seed ls -la /your/container/path
```

2. **Verify cross-seed can access your torrent client paths:**

```bash
# For native installation
ls -la /path/to/torrent/data

# For Docker
docker exec -it cross-seed ls -la /path/in/container
```

3. **Verify hardlink compatibility:**

```bash
# Create a test hardlink
ln /path/to/source/file /path/to/link/destination/file

# Check if it worked (both should have the same inode number)
ls -i /path/to/source/file
ls -i /path/to/link/destination/file
```

#### Common Path Problems and Solutions

| Problem                  | Symptom                                         | Solution                                                    |
| ------------------------ | ----------------------------------------------- | ----------------------------------------------------------- |
| Incorrect path in config | "Error: ENOENT: no such file or directory"      | Double-check paths and correct them in config.js            |
| Docker path mismatch     | Injection works but linking fails               | Ensure consistent volume mounts and paths across containers |
| Windows path format      | "SyntaxError: Unexpected token"                 | Use double backslashes (`\\`) in Windows paths              |
| Permission issues        | "Error: EACCES: permission denied"              | Check ownership and permissions of the directories          |
| Cross-filesystem linking | "Error: EXDEV: cross-device link not permitted" | Ensure source and destination are on same filesystem        |

### Platform-Specific Path Examples

#### Linux

```js
module.exports = {
	linkDirs: ["/home/user/torrents/links"],
	dataDirs: ["/home/user/media"],
	torrentDir: "/home/user/.config/qBittorrent/BT_backup",
};
```

#### macOS

```js
module.exports = {
	linkDirs: ["/Users/username/torrents/links"],
	dataDirs: ["/Users/username/media"],
	torrentDir:
		"/Users/username/Library/Application Support/qBittorrent/BT_backup",
};
```

#### Windows

```js
module.exports = {
	linkDirs: ["C:\\Users\\Username\\torrents\\links"],
	dataDirs: ["C:\\Users\\Username\\media"],
	torrentDir: "C:\\Users\\Username\\AppData\\Local\\qBittorrent\\BT_backup",
};
```

### Migrating Paths Between Systems

If you're moving your cross-seed setup between systems:

1. Update all path references in your config.js
2. Use the `cross-seed clear-client-cache` command to refresh client paths
3. For torrents that use specific save paths, you may need to update them in
   your client

### Path Mapping Cheat Sheet

| Setting    | Native Linux Example                | Native Windows Example                                                | Docker Example      |
| ---------- | ----------------------------------- | --------------------------------------------------------------------- | ------------------- |
| linkDirs   | ["/data/links"]                     | ["D:\\\\data\\\\links"]                                               | ["/data/links"]     |
| dataDirs   | ["/data/media"]                     | ["D:\\\\data\\\\media"]                                               | ["/data/media"]     |
| torrentDir | "/home/user/.qbittorrent/BT_backup" | "C:\\\\Users\\\\name\\\\AppData\\\\Local\\\\qBittorrent\\\\BT_backup" | "/config/BT_backup" |
| outputDir  | "/home/user/.cross-seed/output"     | "C:\\\\Users\\\\name\\\\.cross-seed\\\\output"                        | "/config/output"    |

By understanding and correctly implementing path mapping, you'll avoid the most
common issues with cross-seed and ensure smooth operation of your cross-seeding
workflow.
