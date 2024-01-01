import { defineClientConfig } from "@vuepress/client";

import Layout from "./Layout.vue";

import "./styles/index.scss";

export default defineClientConfig({
    layouts: {
        Layout,
    },
});
