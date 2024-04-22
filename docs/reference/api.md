# HTTP API

`cross-seed` has an HTTP API as part of [Daemon Mode](../basics/daemon.md). When
you run the `cross-seed daemon` command, the app starts an HTTP server, listening
on port 2468 (configurable with the [`port`](../basics/options#port) option).

:::tip
You can easily configure your torrent client to [send search commands when a torrent finishes.](../basics/daemon#set-up-automatic-searches-for-finished-downloads)
:::

## Authorization

You can specify an API key using the [`apiKey`](../basics/options.md#apikey) option, or let
`cross-seed` generate one for you (default).

:::caution Be advised
API authorization using an API key is now mandatory as of v6. The `apiAuth` option has been
deprecated and removed.
:::

:::danger
Even with API authorization, we still recommend that you **do not expose its port to untrusted networks (such as the Internet).**
:::

To find your generated API key, run the `cross-seed api-key` command.
The API key can be included with your requests in either of two ways:

```shell
# provide api key as a query param
curl -XPOST localhost:2468/api/webhook?apikey=YOUR_API_KEY --data-urlencode ...
# provide api key as an HTTP header
curl -XPOST localhost:2468/api/webhook -H "X-Api-Key: YOUR_API_KEY" --data-urlencode ...
```

## POST `/api/webhook`

This endpoint invokes a search, on all configured trackers, for a specific
torrent name, infoHash, or torrent data. You can provide the name directly,
or you can provide an infoHash or path to search for, which `cross-seed` will
use to either look up the torrent in your [`torrentDir`](../basics/options#torrentdir) or parse the
filename directly. It will respond with `204 No Content` once it has received your
request successfully.

:::tip
Searches that match a torrent file always take precedence, even in data-based searching.

:::

### Supported formats

| `Content-Type`                      | Supported |
| ----------------------------------- | --------- |
| `application/json`                  | ✅        |
| `application/x-www-form-urlencoded` | ✅        |

### Request Payload

```js
POST /api/webhook
{
	// one of { name, infoHash, path } is required
	name: "<torrent name here>",
	infoHash: "<infoHash of torrent>",
	path: "/path/to/torrent/file.mkv",
	outputDir: "/path/to/output/dir", // optional
}
```

```shell script
curl -XPOST http://localhost:2468/api/webhook \
  --data-urlencode 'name=<torrent name here>' \
  --data-urlencode 'outputDir=/path/to/output/dir'
```

Alternatively, you can use JSON:

```shell script
curl -XPOST http://localhost:2468/api/webhook \
  -H 'Content-Type: application/json' \
  --data '{"name":"<torrent name here>"}'
```

## POST `/api/announce`

Use this endpoint to feed announces into cross-seed. For each `announce`,
`cross-seed` will check if the provided search criteria match any torrents you already
have. If found, it will run our matching algorithm to verify that the torrents
do indeed match, and inject the announced torrent.

:::info
This is a _real-time_ alternative to scanning RSS feeds via [`rssCadence`](../basics/options.md#rsscadence). Consider turning the RSS
scan off ([`rssCadence: null,`](../basics/options.md#rsscadence)), or significantly raising the time if you set up this feature.
:::

This endpoint returns `200` if your request was received and a completed match was found in your client, if a match was found to be incomplete (still downloading) then `cross-seed` will return the status code `202`, and if no match was found `cross-seed` will respond with a `204 No Content`.

:::tip
The most common way to implement an "announce feed" is utilizing [autobrr](../basics/faq-troubleshooting.md#how-can-i-use-autobrr-with-cross-seed).
:::

### Supported formats

| `Content-Type`                      | Supported |
| ----------------------------------- | --------- |
| `application/json`                  | ✅        |
| `application/x-www-form-urlencoded` | ✅        |

### Request Payload

```js
POST /api/announce
{
	"name": "string", // torrent name
	"guid": "string", // ideally the torrent's comments/listing url, would be for caching purposes
	"link": "string", // download link
	"size": "number", // in bytes
	"tracker": "string" // this is for logging purposes
}
```
