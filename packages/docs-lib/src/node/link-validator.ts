function createUrl(link: string): URL {
    const url = new URL(link);
    if (url.protocol !== "https:") {
        throw new Error(`[AlmostReliable] Link must be HTTPS: ${link}`);
    }

    return url;
}

/**
 * Checks if a given link is allowed based on a list of allowed URLs.
 *
 * @param {string} link - The link to check.
 * @param {URL[]} allowedURLs - The list of allowed URLs.
 * @return {boolean} Returns true if the link is allowed, false otherwise.
 */
function isLinkAllowed(link: string, allowedURLs: URL[]) {
    const urlToCheck = createUrl(link);
    return allowedURLs.some((url) => {
        return url.host === urlToCheck.host && urlToCheck.pathname.startsWith(url.pathname);
    });
}

/**
 * Validates the replacements and checks if the links are allowed. Will only check links which are absolute URLs.
 * If a link is not allowed, an error will be thrown.
 *
 * @param {Record<string, string>} replacements - The replacements to be validated.
 * @param {URL[]} allowedURLs - The allowed URLs.
 * @throws {Error} if a link is not allowed.
 */
function validateReplacements(replacements: Record<string, string>, allowedURLs: URL[]) {
    for (const [key, link] of Object.entries(replacements)) {
        if (!isAbsoluteLink(link)) {
            continue;
        }

        if (!isLinkAllowed(link, allowedURLs)) {
            throw new Error(
                `[AlmostReliable] Link "${link}" (@${key}) is not allowed. Link must be part of: ${toStringURL(
                    allowedURLs,
                )}`,
            );
        }
    }
}

function isAbsoluteLink(link: string) {
    return link.startsWith("https://");
}

function shouldReplaceLink(link: string) {
    return link.startsWith("@");
}

function toStringURL(urls: URL[]) {
    return urls.map((url) => `"${url.toString()}"`).join(", ");
}

/**
 * Replaces a link with a replacement value from the given replacements object.
 *
 * @param {string} link - The link to be replaced.
 * @param {Record<string, string>} replacements - An object containing the replacement values.
 * @throws {Error} if the link does not start with '@'.
 * @throws {Error} if the link key is not found in the replacements object.
 * @return {string} The replacement value for the given link.
 */
function replaceLink(link: string, replacements: Record<string, string>) {
    if (!shouldReplaceLink(link)) {
        throw new Error(`[AlmostReliable] Link must start with @, when replacing: ${link}`);
    }

    const linkWithoutAt = link.slice(1);
    const result = replacements[linkWithoutAt];
    if (!result) {
        const str = JSON.stringify(replacements);
        throw new Error(`[AlmostReliable] Link-Key "${link}" not found in replacements: ${str}`);
    }

    return result;
}

export default (allowedLinks: string[], replacements: Record<string, string>) => {
    const allowedURLs = allowedLinks.map(createUrl);
    validateReplacements(replacements, allowedURLs);

    return (link: string) => {
        if (shouldReplaceLink(link)) {
            const l = replaceLink(link, replacements);
            console.log(`[AlmostReliable] Replacing link "${link}" with "${l}"`);
            return l;
        }

        if (isAbsoluteLink(link) && !isLinkAllowed(link, allowedURLs)) {
            throw new Error(
                `[AlmostReliable] Link "${link}" is not allowed. Link must be part of: ${toStringURL(allowedURLs)}`,
            );
        }

        return link;
    };
};
