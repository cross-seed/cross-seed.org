---
id: config-examples
sidebar_position: 12
title: Configuration Examples
---

## Ready-to-Use Configuration Examples

Setting up cross-seed correctly can be challenging, especially when dealing with
JavaScript syntax and various environment considerations. This guide provides
ready-to-use configuration examples for various common scenarios.

### Basic Configuration Syntax

Every cross-seed config.js file follows this basic structure:

```js
module.exports = {
	// Your settings go here
	setting1: "value",
	setting2: ["array", "of", "values"],
	setting3: true,
};
```

:::caution JavaScript Syntax Remember these essential JavaScript syntax rules:

- Strings must be wrapped in quotes: `"like this"` or `'like this'`
- Arrays must be in square brackets: `["item1", "item2"]`
- Each line (except the last in a section) must end with a comma
- Paths with backslashes on Windows must use double backslashes:
  `"C:\\Users\\Name"` :::

### Simple Stand-Alone Setup

This configuration is suitable for a basic setup on a single machine with one
torrent client:

```js
module.exports = {
	// Required indexer settings
	torznab: [
		"http://localhost:9696/1/api?apikey=your-prowlarr-api-key-here",
		"http://localhost:9696/2/api?apikey=your-prowlarr-api-key-here",
	],

	// Torrent client settings
	action: "inject",
	torrentClients: ["qbittorrent:http://username:password@localhost:8080"],
	useClientTorrents: true,

	// Linking configuration (recommended)
	linkDirs: ["/data/torrents/cross-seed-links"],
	linkType: "hardlink",

	// Search behavior
	matchMode: "partial",
	searchCadence: "1 day",
	rssCadence: "30 minutes",
	excludeRecentSearch: "3 days",
	excludeOlder: "2 weeks",

	// Web UI settings
	host: "0.0.0.0",
	port: 2468,

	// Optional notification
	notificationWebhookUrls: [],
};
```

### Docker Configuration

This is optimized for a Docker setup with proper volume mappings:

```js
module.exports = {
	// Required indexer settings
	torznab: [
		"http://prowlarr:9696/1/api?apikey=your-prowlarr-api-key-here",
		"http://prowlarr:9696/2/api?apikey=your-prowlarr-api-key-here",
	],

	// Torrent client settings
	action: "inject",
	torrentClients: ["qbittorrent:http://username:password@qbittorrent:8080"],
	useClientTorrents: true,

	// Linking configuration (recommended)
	linkDirs: ["/data/torrents/cross-seed-links"],
	linkType: "hardlink",

	// Search behavior
	matchMode: "partial",
	searchCadence: "1 day",
	rssCadence: "30 minutes",
	excludeRecentSearch: "3 days",
	excludeOlder: "2 weeks",

	// Web UI settings
	host: "0.0.0.0",
	port: 2468,

	// API security - strongly recommended for Docker
	apiKey: "generate-an-api-key-with-cross-seed-api-key-command",
};
```

### Windows Configuration

This example is tailored for Windows environments, with proper path formatting:

```js
module.exports = {
	// Required indexer settings
	torznab: [
		"http://localhost:9696/1/api?apikey=your-prowlarr-api-key-here",
		"http://localhost:9696/2/api?apikey=your-prowlarr-api-key-here",
	],

	// Torrent client settings
	action: "inject",
	torrentClients: ["qbittorrent:http://username:password@localhost:8080"],
	useClientTorrents: true,

	// Linking configuration (recommended)
	// NOTE: Windows paths MUST use double backslashes
	linkDirs: ["D:\\torrents\\cross-seed-links"],
	linkType: "hardlink",

	// Optional data directories (if using media libraries)
	dataDirs: ["D:\\media\\movies", "D:\\media\\tv"],

	// Search behavior
	matchMode: "partial",
	searchCadence: "1 day",
	rssCadence: "30 minutes",
	excludeRecentSearch: "3 days",
	excludeOlder: "2 weeks",

	// Web UI settings
	host: "0.0.0.0",
	port: 2468,
};
```

### Multi-Client Configuration

This configuration demonstrates setting up cross-seed with multiple torrent
clients:

```js
module.exports = {
	// Required indexer settings
	torznab: [
		"http://localhost:9696/1/api?apikey=your-prowlarr-api-key-here",
		"http://localhost:9696/2/api?apikey=your-prowlarr-api-key-here",
	],

	// Multiple torrent clients
	action: "inject",
	torrentClients: [
		// Primary client
		"qbittorrent:http://username:password@localhost:8080",

		// Secondary client
		"deluge:http://:password@localhost:8112/json",

		// Read-only client (only used as a source, never for injection)
		"transmission:readonly:http://username:password@localhost:9091/transmission/rpc",
	],
	useClientTorrents: true,

	// Linking configuration
	linkDirs: ["/data/torrents/cross-seed-links"],
	linkType: "hardlink",

	// Search behavior
	matchMode: "partial",
	searchCadence: "1 day",
	rssCadence: "30 minutes",
	excludeRecentSearch: "3 days",
	excludeOlder: "2 weeks",

	// Web UI settings
	host: "0.0.0.0",
	port: 2468,
};
```

### Data-Based Matching Configuration

This example focuses on setting up cross-seed for data-based matching from
existing media libraries:

```js
module.exports = {
	// Required indexer settings
	torznab: [
		"http://localhost:9696/1/api?apikey=your-prowlarr-api-key-here",
		"http://localhost:9696/2/api?apikey=your-prowlarr-api-key-here",
	],

	// Torrent client settings
	action: "inject",
	torrentClients: ["qbittorrent:http://username:password@localhost:8080"],
	useClientTorrents: true,

	// Data directories for media libraries
	dataDirs: ["/data/media/movies", "/data/media/tv"],
	maxDataDepth: 2,

	// Linking configuration (required for data-based matching)
	linkDirs: ["/data/torrents/cross-seed-links"],
	linkType: "hardlink",

	// Search behavior optimized for renamed media
	matchMode: "flexible", // Use "partial" for even better matching
	searchCadence: "1 day",
	rssCadence: "30 minutes",
	excludeRecentSearch: "3 days",
	excludeOlder: "2 weeks",

	// Web UI settings
	host: "0.0.0.0",
	port: 2468,
};
```

### Unraid Configuration

Specifically tailored for Unraid users:

```js
module.exports = {
	// Required indexer settings
	torznab: [
		"http://prowlarr:9696/1/api?apikey=your-prowlarr-api-key-here",
		"http://prowlarr:9696/2/api?apikey=your-prowlarr-api-key-here",
	],

	// Torrent client settings
	action: "inject",
	torrentClients: ["qbittorrent:http://username:password@qbittorrent:8080"],
	useClientTorrents: true,

	// Linking configuration
	// Using user shares path structure
	linkDirs: ["/mnt/user/data/torrents/cross-seed-links"],
	linkType: "hardlink",

	// Optional data directories (if using media libraries)
	dataDirs: ["/mnt/user/data/media/movies", "/mnt/user/data/media/tv"],
	maxDataDepth: 2,

	// Search behavior
	matchMode: "partial",
	searchCadence: "1 day",
	rssCadence: "30 minutes",
	excludeRecentSearch: "3 days",
	excludeOlder: "2 weeks",

	// Web UI settings
	host: "0.0.0.0",
	port: 2468,

	// Security - recommended for exposed containers
	apiKey: "generate-an-api-key-with-cross-seed-api-key-command",
};
```

### Multiple Drives Configuration

For setups with multiple physical drives without pooling:

```js
module.exports = {
	// Required indexer settings
	torznab: [
		"http://localhost:9696/1/api?apikey=your-prowlarr-api-key-here",
		"http://localhost:9696/2/api?apikey=your-prowlarr-api-key-here",
	],

	// Torrent client settings
	action: "inject",
	torrentClients: ["qbittorrent:http://username:password@localhost:8080"],
	useClientTorrents: true,

	// Multiple link directories for different drives
	linkDirs: [
		"/mnt/disk1/torrents/cross-seed-links",
		"/mnt/disk2/torrents/cross-seed-links",
		"/mnt/disk3/torrents/cross-seed-links",
	],
	linkType: "hardlink",

	// Multiple data directories across drives
	dataDirs: ["/mnt/disk1/media", "/mnt/disk2/media", "/mnt/disk3/media"],
	maxDataDepth: 2,

	// Search behavior
	matchMode: "partial",
	searchCadence: "1 day",
	rssCadence: "30 minutes",
	excludeRecentSearch: "3 days",
	excludeOlder: "2 weeks",

	// Web UI settings
	host: "0.0.0.0",
	port: 2468,
};
```

### Media Server Integration Configuration

Optimized for integration with Sonarr/Radarr/Plex:

```js
module.exports = {
	// Required indexer settings
	torznab: [
		"http://localhost:9696/1/api?apikey=your-prowlarr-api-key-here",
		"http://localhost:9696/2/api?apikey=your-prowlarr-api-key-here",
	],

	// Integration with Sonarr/Radarr for ID-based searching
	sonarr: ["http://localhost:8989?apikey=your-sonarr-api-key-here"],
	radarr: ["http://localhost:7878?apikey=your-radarr-api-key-here"],

	// Torrent client settings
	action: "inject",
	torrentClients: ["qbittorrent:http://username:password@localhost:8080"],
	useClientTorrents: true,

	// Linking configuration
	linkDirs: ["/data/torrents/cross-seed-links"],
	linkType: "hardlink",

	// Use Arr's organized libraries
	dataDirs: ["/data/media/movies", "/data/media/tv"],
	maxDataDepth: 2,

	// Search behavior optimized for Arr libraries
	matchMode: "flexible",
	seasonFromEpisodes: 0.8, // Try to match season packs with 80% of episodes
	searchCadence: "1 day",
	rssCadence: "30 minutes",
	excludeRecentSearch: "3 days",
	excludeOlder: "2 weeks",

	// Arr client categories
	duplicateCategories: true,

	// Web UI settings
	host: "0.0.0.0",
	port: 2468,
};
```

### VPN Environment Configuration

For setups where the torrent client is behind a VPN:

```js
module.exports = {
	// Required indexer settings
	torznab: [
		"http://prowlarr:9696/1/api?apikey=your-prowlarr-api-key-here",
		"http://prowlarr:9696/2/api?apikey=your-prowlarr-api-key-here",
	],

	// Torrent client settings with VPN IP
	action: "inject",
	torrentClients: [
		// Using the VPN container's IP address instead of hostname
		"qbittorrent:http://username:password@10.0.0.2:8080",
	],
	useClientTorrents: true,

	// Linking configuration
	linkDirs: ["/data/torrents/cross-seed-links"],
	linkType: "hardlink",

	// Search behavior
	matchMode: "partial",
	searchCadence: "1 day",
	rssCadence: "30 minutes",
	excludeRecentSearch: "3 days",
	excludeOlder: "2 weeks",

	// Web UI settings
	host: "0.0.0.0",
	port: 2468,

	// Security - strongly recommended for VPN setups
	apiKey: "generate-an-api-key-with-cross-seed-api-key-command",
};
```

### Advanced Matching Configuration

This configuration is optimized for finding the maximum number of cross-seeds:

```js
module.exports = {
	// Required indexer settings
	torznab: [
		"http://localhost:9696/1/api?apikey=your-prowlarr-api-key-here",
		"http://localhost:9696/2/api?apikey=your-prowlarr-api-key-here",
	],

	// Torrent client settings
	action: "inject",
	torrentClients: ["qbittorrent:http://username:password@localhost:8080"],
	useClientTorrents: true,

	// Linking configuration (required for partial matching)
	linkDirs: ["/data/torrents/cross-seed-links"],
	linkType: "hardlink",

	// Advanced matching options
	matchMode: "partial",
	seasonFromEpisodes: 0.7, // Match season packs with only 70% of episodes
	fuzzySizeThreshold: 0.05, // Allow 5% size difference
	autoResumeMaxDownload: 104857600, // Auto-resume if less than 100MB to download
	ignoreNonRelevantFilesToResume: true, // Resume if missing only NFO/sample files

	// Include more content types
	includeSingleEpisodes: true,
	includeNonVideos: true,

	// Search behavior
	searchCadence: "1 day",
	rssCadence: "30 minutes",
	excludeRecentSearch: "3 days",
	excludeOlder: "2 weeks",

	// Web UI settings
	host: "0.0.0.0",
	port: 2468,
};
```

### Selective Content Configuration

This configuration demonstrates how to use the blocklist to be selective about
what gets cross-seeded:

```js
module.exports = {
	// Required indexer settings
	torznab: [
		"http://localhost:9696/1/api?apikey=your-prowlarr-api-key-here",
		"http://localhost:9696/2/api?apikey=your-prowlarr-api-key-here",
	],

	// Torrent client settings
	action: "inject",
	torrentClients: ["qbittorrent:http://username:password@localhost:8080"],
	useClientTorrents: true,

	// Linking configuration
	linkDirs: ["/data/torrents/cross-seed-links"],
	linkType: "hardlink",

	// Selective matching with blocklist
	blockList: [
		// Skip specific release groups
		"name:YIFY",
		"name:YTS",

		// Skip torrents with specific tags or categories
		"tag:nocseed",
		"category:books",

		// Skip specific trackers
		"tracker:animebytes.tv",

		// Skip very small files
		"sizeBelow:104857600", // Skip below 100MB

		// Skip regex patterns
		"nameRegex:(?i)sample|trailer",
	],

	// Search behavior
	matchMode: "partial",
	searchCadence: "1 day",
	rssCadence: "30 minutes",
	excludeRecentSearch: "3 days",
	excludeOlder: "2 weeks",

	// Web UI settings
	host: "0.0.0.0",
	port: 2468,
};
```

### Configuration Template Customization Guide

To adapt these templates to your specific needs:

1. **Choose the closest starting template** to your setup
2. **Replace placeholders**:
    - API keys
    - Usernames and passwords
    - Hostnames or IP addresses
    - File paths
3. **Adjust paths** to match your system's directory structure
4. **Fine-tune matching settings** based on your preference
5. **Test your configuration** with the daemon's validation

Remember to restart cross-seed after making config changes for them to take
effect.
