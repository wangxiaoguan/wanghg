// import pageRoutes from './config/router.config';

const pageRoutes = require('./config/router.config.js');
const menuName = require('./src/locales/zh-CN/menu');


const FS = require('fs');

let excel = `<tr><th>序号</th><td>菜单级别</td><td>上级路径</td><td>本级路径</td><td>菜单名</td><td>名称</td></tr>\r\n`;
let rowIndex = 1;

function createAuthority(routeList, parentNode = null, index = 1) {
  for (let i = 0; i < routeList.length; i++) {

    let item = routeList[i];
    if (item.hideInMenu) {
      continue;
    }

    if (parentNode && parentNode.menuName) {
      item.menuName = `${parentNode.menuName}.${item.name}`;
    }
    else if (item.name) {
      item.menuName = `menu.${item.name}`;
    }

    if (index > 1 && item.name) {
      excel += `<tr><th>${rowIndex}</th><td>${index}</td><td>${parentNode ? parentNode.path : ''}</td><td>${item.path}</td><td>${menuName[item.menuName] || ''}</td><td>${item.name}</td></tr>\r\n`;
      rowIndex++;
    }
    if (item.routes && item.routes.length > 0) {
      createAuthority(item.routes, item, index + 1);
    }
  }
}

createAuthority(pageRoutes);

FS.writeFileSync('菜单统计.html', `<style>
table {
  border-collapse: collapse;
}
td,th {
  border: 1px solid;
  padding: 10px;
}
</style>
<table>
${excel}
</table>`);