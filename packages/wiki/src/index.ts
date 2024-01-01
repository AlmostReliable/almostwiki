import { DefaultThemeOptions, Plugin, PluginFunction, SidebarConfig, UserConfig, defaultTheme } from "vuepress";
import { searchPlugin } from "@vuepress/plugin-search";
import { getDirname, path } from "@vuepress/utils";
import LinkValidator from "./link-validator";
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
        logo: "https://camo.githubusercontent.com/6bf9d86b8de8f9243d5a6ccaaa8515d5a8d865ea94d2e84f04fbaa3acd3d801d/68747470733a2f2f692e696d6775722e636f6d2f336237476a6b6e2e706e6722",
        sidebar: almostConfig?.sidebar || "auto",
        sidebarDepth: 2,
    };

    return {
        title: "Almost Reliable",
        clientConfigFile: path.resolve(__dirname, "./client/config.js"),
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
