import { defineClientConfig } from "@vuepress/client";

import Layout from "./components/Layout.vue";

import "./styles/index.scss";

export default defineClientConfig({
    enhance: ({ app }) => {
        console.log("[AlmostReliable] Client config loaded");
    },
    layouts: {
        Layout,
    },
});
