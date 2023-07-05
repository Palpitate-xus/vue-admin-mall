/**

 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import EmptyLayout from '@/layouts/EmptyLayout'
import { publicPath, routerMode } from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: {
          title: '首页',
          icon: 'home',
          affix: true,
        },
      },
    ],
  },
  /* {
    path: "/test",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "test",
        name: "Test",
        component: () => import("@/views/test/index"),
        meta: {
          title: "test",
          icon: "marker",
          permissions: ["admin"],
        },
      },
    ],
  }, */

  // {
  //   path: '/mall',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'Mall',
  //   meta: {
  //     title: '商城',
  //     icon: 'shopping-cart',
  //     permissions: ['admin'],
  //   },

  //   children: [
  //     {
  //       path: 'pay',
  //       name: 'Pay',
  //       component: () => import('@/views/mall/pay/index'),
  //       meta: {
  //         title: '支付',
  //         noKeepAlive: true,
  //       },
  //       children: null,
  //     },
  //     {
  //       path: 'goodsList',
  //       name: 'GoodsList',
  //       component: () => import('@/views/mall/goodsList/index'),
  //       meta: {
  //         title: '商品列表',
  //       },
  //     },
  //   ],
  // },
  {
    path: '/products',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Products',
    meta: {
      title: '商品管理',
      icon: 'shopping-cart',
      permissions: ['admin', 'supplier'],
    },
    children: [
      {
        path: '/productsManagement',
        name: 'ProductManagement',
        component: () => import('@/views/productsManagement/index'),
        meta: { title: '商品管理', icon: 'box' },
      },
    ],
  },
  // {
  //   path: '/suppliers',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'Suppliers',
  //   meta: {
  //     title: '供应商管理',
  //     icon: 'shopping-cart',
  //     permissions: ['admin'],
  //   },
  //   children: [
  //     {
  //       path: '/suppliersManagement',
  //       name: 'SuppliersManagement',
  //       component: () => import('@/views/suppliersManagement/index'),
  //       meta: { title: '供应商管理', icon: 'truck' },
  //     },
  //   ],
  // },
  {
    path: '/orders',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Orders',
    meta: {
      title: '订单管理',
      icon: 'shopping-cart',
      permissions: ['supplier'],
    },
    children: [
      {
        path: '/ordersManagement',
        name: 'OrdersManagement',
        component: () => import('@/views/ordersManagement/index'),
        meta: { title: '订单管理', icon: 'truck' },
      },
    ],
  },
  // {
  //   path: '/error',
  //   component: EmptyLayout,
  //   redirect: 'noRedirect',
  //   name: 'Error',
  //   meta: { title: '错误页', icon: 'bug' },
  //   children: [
  //     {
  //       path: '401',
  //       name: 'Error401',
  //       component: () => import('@/views/401'),
  //       meta: { title: '401' },
  //     },
  //     {
  //       path: '404',
  //       name: 'Error404',
  //       component: () => import('@/views/404'),
  //       meta: { title: '404' },
  //     },
  //   ],
  // },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})

export function resetRouter() {
  location.reload()
}

export default router
