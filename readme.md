# HN Titles

## What it is

This is a simple Tamperscript that _"unmoderates"_ titles of Hacker News stories: 
it displays the content of the title in a caption as it was before being moderated (changed).

## How to install

Just click on this link: 
[hntitles](https://raw.githubusercontent.com/bambax/hntitles/refs/heads/master/hntitles.user.js).

(One needs to have the [Tampermonkey](https://www.tampermonkey.net/) browser extension already 
installed for this to work of course.)

## Who do this

The main reason is that sometimes the titles are moderated long after they
appear on the front page; when that happens one doesn't know they
have already visited the page and it's annoying. This is like renaming someone after
they're an adult and you know them already, it's confusing.

There should be a maximum timeframe for moderating, or a maximum set of points, 
after which moderating is no longer possible.

The other reason is that moderating can occasionally remove information in the name of
removing clickbait; having access to the original title is useful.

## How it works

A cron job on a server downloads titles from the [newest](https://news.ycombinator.com/newest)
page at regular intervals and stores the original titles.

The extension scans titles on HN pages and compares them to the stored version using
[Levenshtein distance](https://simple.wikipedia.org/wiki/Levenshtein_distance); if
the distance is >= 5 it shows them with an asterisk and a different color, and a
mouseover shows the original title.

## More information

Here's a [great post](https://news.ycombinator.com/item?id=20429573) 
by [dang](https://news.ycombinator.com/user?id=dang)
about moderating HN titles.

The original titles have been stored starting 2024-10-25, so for any
story prior to that date, no original title is available or will be shown.

The script only runs on the HN homepage and the /news page (which is
the same).