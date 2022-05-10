import Vue from 'vue';

import VueRouter from 'vue-router';

Vue.use(VueRouter)

import greenhouseData from "@/components/greenhouseData";
import kongzhi from "@/components/kongzhi";

const router = new VueRouter({
	// mode: "history",
	mode : "hash",
    routes: [{
        path: "/",
        component: greenhouseData
    },
    {
        path: '/kongzhi',
        component: kongzhi
    },

    ]
});


export default router

