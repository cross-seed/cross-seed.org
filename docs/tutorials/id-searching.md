---
title: Searching by Media IDs
id: id-searching
---

As of v6, `cross-seed` can query Sonarr and Radarr instances to look up IMDb,
TheTVDB, TheMovieDB, and TVMaze IDs for your content and forward the IDs to
indexers resulting in **far better search results and match rates**. 

If cross-seed doesn't find any IDs for an item, it will fall back to text-based searching. 

### Benefits

-   **More Matches**: Searches by unique ID reduce mismatches due to naming
    inconsistencies.
-   **Less Unnecessary Snatches**: Search results from indexers will have fewer
    bogus (but sometimes similar-looking) results.
-   **Lighter on Trackers**: ID-based searches use cheaper and more accurate
    search capabilities supported by many indexers, relying less on expensive
    text-based search.

### Configuration

1. Retrieve API Keys
    1. Open Sonarr or Radarr WebUI.
    2. Go to Settings > General and copy the API Key.
2. Construct URLs

Format URLs with your API keys:

```
# Replace with your Sonarr/Radarr URL and API key

http://localhost:8989/?apikey=YOUR_API_KEY
http://localhost:7878/?apikey=YOUR_API_KEY

# or, for Docker:

http://localhost:8989/?apikey=YOUR_API_KEY
http://radarr:7878/?apikey=YOUR_API_KEY
```

3. Update `config.js`

Add these URLs to `config.js` under the `sonarr` and `radarr` keys:

```js
module.exports = {
	// ... other settings ...
	sonarr: ["http://localhost:8989/?apikey=12345"],
	radarr: ["http://localhost:7878/?apikey=67890"],
};
```

For multiple instances (e.g., separate 4K libraries), list each URL in an array:

```js
module.exports = {
	// ... other settings ...
	sonarr: [
		"http://localhost:8989/?apikey=12345",
		"http://localhost4k:8990/?apikey=54321",
	],
	radarr: [
		"http://localhost:7878/?apikey=67890",
		"http://localhost4k:7879/?apikey=09876",
	],
};
```

Many thanks to [**zakary**](https://github.com/zakkarry) for implementing this feature.
