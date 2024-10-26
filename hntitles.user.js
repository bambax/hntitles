// ==UserScript==
// @name         Hacker News Title Unmoderator
// @version      0.9.2
// @namespace    http://tampermonkey.net/
// @version      2024-10-25
// @description  Reveal original titles of HN stories
// @author       EB
// @match        https://news.ycombinator.com/
// @match        https://news.ycombinator.com/news
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// @connect      hntitles.medusis.com
// ==/UserScript==

(async function() {
    'use strict';
    GM.addStyle('.changed a { color: #956; }');
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    // get all ids (they are in a tr with id and class "athing")
    const ids = [...$$(".athing")].map(elt => elt.id);
    const qstr = ids.join(",");
    const hnt = "https://hntitles.medusis.com/readtitles.php?i=" + qstr;

    // load list from store and act on it
    const r = await GM.xmlHttpRequest({
        url: hnt,
        responseType: 'json'
        }).catch(e => console.error(e));
    if (r.status < 200 || r.status > 400) {
        console.warn("bad response", r.status);
        // stop here if bad response from server
        return;
        }

    const titles = r.response;
    for (const id in titles) {
        const originalTitle = titles[id].title
        const target = document.getElementById(id);
        if (target) {
            const titleLink = target.querySelector("span.titleline > a")
            const currentTitle = titleLink.innerText
            // compare current title to original title using lower case
            // (many edits only remove capitalization without changing anything else)
            const dist = levenshtein(currentTitle.toLowerCase(), originalTitle.toLowerCase());
            // console.log(id, "dist:", dist);
            if (dist >= 5) {
                // console.log(id, dist, currentTitle);
                target.title = `was >> ${originalTitle}`;
                target.classList.add("changed");
                titleLink.innerText = "*" + currentTitle;
                }
            }
        else {
            // should never happen, as the ids are taken from the page itself
            // if it does happen, most likely a problem with finding the 'target' (selector problem)
            console.warn(id, "NOT FOUND");
            }
        }

    // calculate the Levenshtein distance between a and b
    function levenshtein(str1, str2) {
        let [len1, len2] = [str1.length, str2.length];

        // Ensure str1 is the longer string for space optimization
        if (len1 < len2) {
            [str1, str2] = [str2, str1];
            [len1, len2] = [len2, len1];
            }

        const matrix = Array(2).fill().map(() => Array(len2 + 1));

        // Initialize first row
        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
            }

        // Fill matrix
        for (let i = 1; i <= len1; i++) {
            matrix[i % 2][0] = i;
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i-1] === str2[j-1] ? 0 : 1;
                matrix[i % 2][j] = Math.min(
                    matrix[(i-1) % 2][j] + 1, // deletion
                    matrix[i % 2][j-1] + 1, // insertion
                    matrix[(i-1) % 2][j-1] + cost // substitution
                    );
                }
            }

        return matrix[len1 % 2][len2];
        };

    })();
