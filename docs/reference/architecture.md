# Architecture

```mermaid
flowchart
subgraph Matching
    assessCandidate -->
    performAction -->
    sendResultsNotification
end
subgraph performAction
    linking["linking (if possible)"] --> inject
    linking --> save
end
subgraph checkNewCandidateMatch
    getTorrentByFuzzyName
end
subgraph findOnOtherSites["findOnOtherSites (single search)"]
    searchTorznab
end
subgraph findSearchableTorrents
    searcheeGeneration["make searchees from \n- torrentDir\n- dataDirs"] -->
    filterDupes -->
    filterByContent -->
    filterTimestamps
end
findSearchableTorrents --> findMatchesBatch
findMatchesBatch --> findOnOtherSites
announce["/api/announce"] --> checkNewCandidateMatch --> Matching
rss["rssCadence"] --> checkNewCandidateMatch

webhook["/api/webhook"] -->
indexNewTorrents -->
createSearchee["create searchee"] -->
searchForLocalTorrentByCriteria --> findOnOtherSites
findOnOtherSites --> Matching

searchCadence --> findSearchableTorrents

crossSeedSearch["cross-seed search"] --> findSearchableTorrents

checkNewCandidateMatch --> getTorrentByFuzzyName
```

## Pipelines

### Search pipeline

#### Entry points

-   `cross-seed daemon --searchCadence <cadence>`
-   `cross-seed search`
-   `POST /api/search`

The search pipeline takes an owned torrent, parses its name, and then searches for
its parsed name on all of your Torznab indexers. After that, it's given a list
of candidates, which then all run through the [**matching algorithm**](#matching-algorithm)
against the owned torrent. Any resulting matches will then run through the configured
[**action**](#actions).

### RSS pipeline

#### Entry points

-   `cross-seed daemon --rssCadence <cadence>`
-   `POST /api/announce`

The RSS pipeline takes a candidate torrent's metadata `{ name, size }` and
searches through your local torrent collection to see if any existing torrents
have the same name. If found, it will run the pair of torrents through the
[**matching algorithm**](#matching-algorithm). If a match is found, it will then
run through the configured [**action**](#actions).

## Prefiltering

Prefiltering occurs during the startup of `cross-seed`. This will index all the .torrent files from
[`torrentDir`](../basics/options.md#torrentdir) and data from any [`dataDirs`](../basics/options.md#datadirs)
you may have added.

-   If you're using [injection](../tutorials/injection.md), the existence of any .torrent files implies their
    presence in the client. If the torrent is not present in your client, it will fail injection and save instead.

-   Your [`torrentDir`](../basics/options.md#torrentdir) should not contain torrent files that are not present in your client.

-   Prefiltering de-duplicates. Multiple files/torrents with the same name will not be searched multiple times.
    :::info
    .torrent files from your [`torrentDir`](../basics/options.md#torrentdir) will take precedence over files in your [`dataDirs`](../basics/options.md#datadirs) with the same name.
    :::

## Matching algorithm

TODO

## Actions

Three things can happen during the `action` phase:

-   link data files (if data-based)
-   inject matching torrent file
-   save matching torrent file
