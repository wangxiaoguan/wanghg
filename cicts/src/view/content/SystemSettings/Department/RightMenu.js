/*
 * @Desc: 菜单
 * @Author: Jackie
 * @Date: 2018-10-25 15:11:48
 * @Last Modified by: Jackie
 * @Last Modified time: 2018-10-26 12:58:26
 */
import React from 'react';
import { Menu } from 'antd';

const isEmpty = obj => {
  if (!obj) {
    return true;
  }
  return Object.keys(obj).length === 0;
};

const RightMenu = ({ rightClickTreeItem = {}, menus = [], onMenuSelect }) => {
  let select = null;
  if (!isEmpty(rightClickTreeItem)) {
    const { pageX, pageY } = rightClickTreeItem;
    const tmpStyle = {
      position: 'fixed',
      left: `${pageX}px`,
      top: `${pageY}px`,
    };
    const items = menus.map(item => (
      <Menu.Item key={item.key} disabled={item.disabled}>
        {item.label}
      </Menu.Item>
    ));
    select = (
      <Menu className='rightMenu' style={tmpStyle} onSelect={onMenuSelect}>
        {items}
      </Menu>
    );
  }
  return select;
};

export default RightMenu;
