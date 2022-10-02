# FAQ & Troubleshooting

## What can I do about `error parsing torrent at http://…`?

This means that the jacket download link didn't resolve to a torrent file. It's
possible you got rate-limited so you might want to try again in a day or more.
Otherwise, just ignore it. There's nothing cross-seed will be able to do to fix
it.

## rtorrent injected torrents don't check (or start at all) until force rechecked
Remove any `stop_untied=` schedules from your .rtorrent.rc.

Commonly: `schedule2 = untied_directory, 5, 5, (cat,"stop_untied=",(cfg.watch),"*.torrent")`

## Failed to inject, saving instead.

TODO
