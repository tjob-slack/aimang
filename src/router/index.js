import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    //component: () => import('@/views/cloudBase/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // toDo
  {
    path: '/',
    component: Layout,
    redirect: '/toDoList',
    meta: {
      title: '待办任务',
      icon: 'plane'
    },
    children: [{
        path: 'toDoList',
        name: 'toDoList',
        component: () => import('@/views/toDo/toDoList'),
        meta: {
          title: '待办任务',
        }
      },
    ]
  },
  // 素材管理
  {
    path: '/material',
    component: Layout,
    redirect: '/material/upload',
    meta: {
      title: '素材管理',
      icon: 'plane'
    },
    children: [{
        path: 'check-template',
        name: 'check-template',
        component: () => import('@/views/material/check-template'),
        meta: {
          title: '查看模板',
        }
      },
      {
        path: 'logo',
        name: 'logo',
        component: () => import('@/views/material/check-logo'),
        meta: {
          title: '查看logo',
        }
      },
      {
        path: 'generate',
        name: 'generate',
        component: () => import('@/views/material/generate'),
        meta: {
          title: '生成素材',
        }
      },
      {
        path: 'check',
        name: 'check',
        component: () => import('@/views/material/check'),
        meta: {
          title: '查看素材',
        }
      },
    ]
  }
  //doctorOrder
  ,{
    path: '/doctorOrder',
    component: Layout,
    redirect: '/doctorOrder-list',
    meta: {
      title: '门诊预约',
      icon: 'plane'
    },
    
	  children: [{
      path: 'doctorOrder-list',  // 二级路径
      name: '预约申请',
      component: () => import('@/views/doctorOrder/doctorOrder-list'), // 懒加载，此处写所添加文件的路径
      meta: {
        title: '预约申请', icon:'plane' //配置选项可配置测试名称和图标
      }
    }
    ]
  } 
  //medicalOrder
  ,{
    path: '/medicalOrder',
    component: Layout,
    redirect: '/medicalOrder-list',
    meta: {
      title: '购药申请',
      icon: 'plane'
    },
    
	  children: [{
      path: 'medicalOrder-list',  // 二级路径
      name: '购药申请',
      component: () => import('@/views/medicalOrder/medicalOrder-list'), // 懒加载，此处写所添加文件的路径
      meta: {
        title: '购药申请', icon:'plane' //配置选项可配置测试名称和图标
      }
    }
    ]
  } 
 //news
  ,{
	  path: '/news',  //url路径
    component: Layout, // 此处不用动，这个全局统一的一个布局文件
    redirect: '/news-list',
    meta: {
      title: '新闻公告',
      icon: 'plane'
    },
	  children: [{
      path: 'news-list',  // 二级路径
      name: '新闻列表',
      component: () => import('@/views/news/news-list'), // 懒加载，此处写所添加文件的路径
      meta: {
        title: '新闻列表', icon:'plane' //配置选项可配置测试名称和图标
      }
      ,
    }
    ,{
      path: 'add-news',
      name: '发布新闻',
      component: () => import('@/views/news/add-news'),
      meta: {
        title: '发布新闻', icon:'plane'
      }
    }
    
    ]
  },
  //vuetifyDemo
  {
    path: '/vuetifyDemo',
    component: Layout,
    redirect: 'fullCalendar',
    meta: {
      title: 'vuetifyDemo-card',
      icon: 'plane'
    },
    
	  children: [
      {
        path: '/fullCalendar',  //url路径
        component: Layout, // 此处不用动，这个全局统一的一个布局文件
        component: () => import('@/views/fullCalendar/index'),
        meta: {
          title: 'fullCalendar',
          icon: 'plane'
        }
      },
      {
      path: '/card',  //url路径
      component: Layout, // 此处不用动，这个全局统一的一个布局文件
      component: () => import('@/views/vuetifyDemo/card'),
      meta: {
        title: 'vuetifyDemo card',
        icon: 'plane'
      }
      }
      ,{ path: '/calendar',  //url路径
      component: Layout, // 此处不用动，这个全局统一的一个布局文件
      component: () => import('@/views/vuetifyDemo/calendar'),
      meta: {
        title: 'vuetifyDemo canlendar',
        icon: 'plane'
      }
      }
      ,{ path: '/dialog',  //url路径
      component: Layout, // 此处不用动，这个全局统一的一个布局文件
      component: () => import('@/views/vuetifyDemo/dialog'),
      meta: {
        title: 'Elemedialog',
        icon: 'plane'
      }}
      ,{ path: '/weekly',  //url路径
      component: Layout, // 此处不用动，这个全局统一的一个布局文件
      component: () => import('@/views/vuetifyDemo/weekly'),
      meta: {
        title: 'weekly',
        icon: 'plane'
      }}
      ,{ path: '/formCreate',  //url路径
      component: Layout, // 此处不用动，这个全局统一的一个布局文件
      component: () => import('@/views/vuetifyDemo/formCreate'),
      meta: {
        title: 'formCreate',
        icon: 'plane'
      }}
      ,{ path: '/vue-form-maker',  //url路径
      component: Layout, // 此处不用动，这个全局统一的一个布局文件
      component: () => import('@/views/vuetifyDemo/vue-form-maker'),
      meta: {
        title: 'vue-form-maker',
        icon: 'plane'
      }}
    ]
  }
  //checkIn
  ,{
    path: '/checkIn',
    component: Layout,
    redirect: '/checkIn',
    meta: {
      title: '预检分诊',
      icon: 'plane'
    },
    children: [{
      path: '/checkIn',  //url路径
      component: Layout, // 此处不用动，这个全局统一的一个布局文件
      component: () => import('@/views/checkIn/index'),
      meta: {
        title: '预检分诊',
        icon: 'plane'
      }
    }]
  }
  //familyCheck
  ,{
    path: '/familyCheck',
    component: Layout,
    redirect: '/familyCheck',
    meta: {
      title: '居家自测',
      icon: 'plane'
    },
    children: [{
      path: '/familyCheck',  //url路径
      component: Layout, // 此处不用动，这个全局统一的一个布局文件
      component: () => import('@/views/familyCheck/index'),
      meta: {
        title: '居家自测',
        icon: 'plane'
      }
    }]
  }
  // 404 page must be placed at the end !!!
  /**
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
  */ 
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
