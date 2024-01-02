import { DefaultThemeOptions, Plugin, PluginFunction, SidebarConfig, UserConfig, defaultTheme } from "vuepress";
import { searchPlugin } from "@vuepress/plugin-search";
import { getDirname, path } from "@vuepress/utils";
import LinkValidator from "./link-validator.js";
import markdownLink from "markdown-it-replace-link";

const __dirname = getDirname(import.meta.url);

export type AlmostOptions = {
    sidebar?: "auto" | false | SidebarConfig;
    linkReplacements?: Record<string, string>;
};

const linkWhiteList = [
    "https://github.com/AlmostReliable/",
    "https://wiki.latvian.dev/books/kubejs",
    "https://minecraft.wiki",
    "https://wiki.latvian.dev",
];

const almostPlugin = (links: Record<string, string>): Plugin => {
    return {
        name: "almost-plugin",
        extendsMarkdown: (md) => {
            md.use(markdownLink, {
                replaceLink: LinkValidator(linkWhiteList, links),
            });
        },
    };
};

export const defineAlmostConfig = (almostConfig?: AlmostOptions): UserConfig => {
    const themeOptions: DefaultThemeOptions = {
        colorMode: "dark",
        colorModeSwitch: false,
        logo: "https://raw.githubusercontent.com/AlmostReliable/almostwiki/main/logo.png",
        sidebar: almostConfig?.sidebar || "auto",
        sidebarDepth: 2,
    };

    return {
        title: "Almost Reliable",
        clientConfigFile: path.resolve(__dirname, "../client/config.js"),
        theme: defaultTheme(themeOptions),
        plugins: [
            searchPlugin({
                maxSuggestions: 10,
                hotKeys: [
                    {
                        key: "k",
                        ctrl: true,
                    },
                ],
            }),
            almostPlugin(almostConfig?.linkReplacements || {}),
        ],
    };
};
