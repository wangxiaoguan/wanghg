import memoizeOne from 'memoize-one';
import { getMenuList } from '@/services/system';
import isEqual from 'lodash/isEqual';

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      const name = item.name;
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
// const getSubMenu = item => {
//   // doc: add hideChildrenInMenu
//   if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
//     return {
//       ...item,
//       children: filterMenuData(item.children), // eslint-disable-line
//     };
//   }
//   return item;
// };

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return (
    menuData
      .filter(item => item.name && !item.hideInMenu)
      // .map(item => check(item.authority, getSubMenu(item)))
      .filter(item => item)
  );
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

// 添加三种类型动态路由
const getNewRouters = (routes, menuList) => {
  const homeList = [];
  const partyTaskList = [];
  const danamicList = [];
  for (let i = 0; i < menuList.length; i += 1) {
    if (menuList[i].msgid === '') {
      const DamicRoute = JSON.parse(JSON.stringify(routes[4]));
      DamicRoute.name = `${menuList[i].name}`;
      DamicRoute.path = `/seekActivity/${menuList[i].id}`;
      DamicRoute.component = routes[4].component;
      DamicRoute.routes = routes[4].routes;
      danamicList.push(DamicRoute);
    } else if (menuList[i].msgid === 'PARTYTASK') {
      const DamicRoute = JSON.parse(JSON.stringify(routes[3]));
      DamicRoute.name = `${menuList[i].name}`;
      DamicRoute.path = `/task/${menuList[i].id}`;
      DamicRoute.component = routes[3].component;
      DamicRoute.routes = routes[3].routes;
      partyTaskList.push(DamicRoute);
    } else if (menuList[i].msgid === 'HOME') {
      const DamicRoute = JSON.parse(JSON.stringify(routes[2]));
      DamicRoute.name = `${menuList[i].name}`;
      DamicRoute.path = `/thematic/${menuList[i].id}`;
      DamicRoute.component = routes[2].component;
      DamicRoute.routes = routes[2].routes;
      homeList.push(DamicRoute);
    }
  }
  routes.splice(2, 3);
  routes.splice(2, 0, ...homeList, ...partyTaskList, ...danamicList);
  return routes;
};

const memoizeOneRoutes = memoizeOne(getNewRouters, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    menuDetail: [], // 从服务器获取的菜单信息
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData({ payload, callback }, { call, put }) {
      const { routes, authority, params } = payload;
      // 获取首页动态路由
      const response = yield call(getMenuList, params);
      let menuDetail = [];
      let NewRoutes;
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        NewRoutes = memoizeOneRoutes(routes, response.resultMap.menuList);
        menuDetail = response.resultMap.menuList.map(item => {
          return {
            name: item.name,
            id: item.id,
            type: item.type,
            msgid: item.msgid,
          };
        });
        // console.log ('response===', response, menuDetail);
      } else {
        NewRoutes = memoizeOneRoutes(routes, []);
      }
      const menuData = filterMenuData(memoizeOneFormatter(NewRoutes, authority));
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, menuDetail },
      });
      callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
