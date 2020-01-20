export const themes = {
  whiteTheme: {
    name: '白色',
  },
  blackTheme: {
    name: '黑色',
    themeBg: '#1d1e2c',
    themeColor: '#ffffff',
    menuColor: '#ffffff',
    menuBg: '#151621',
    menuOpenColor: '#FFFFFF',
    menuOpenBg: '#2d2d3d',
    menuSelectedBg: '#0c74f6',
    menuSelectedColor: 'white',
    layoutBg: '#1d1e2c ',
    layoutHeaderBg: '#191a26',
    layoutHeaderBorder: '#2b2d3c',
    themeLightColor: 'white',

    cardBg: '#191a27',
    cardHeadColor: '#085cc6',
    cardBorder: 'solid 1px rgba(56, 58, 80, 0.5)',
    inputBorder: 'solid 1px #2b2d3c;',
    inputBg: '#121320',
    themeDarkColor: 'rgba(255, 255, 255, 0.45)',
    tableHeadBg: '#0c74f6',
    tableHeadColor: '#ffffff',
    tableHeadShadow: '0px 1px 0px 0px #2b2d3c',
    tableBorder: '1px solid #2b2d3c',
    tableHoverBg: '#545454',
    tableTr2n: '#151624',
    selectArrowBg: '#0c74f6',
    selectArrowBorderColor: '#0c74f6',
    treeColor: 'rgba(255,255,255,0.65)',
    treeNodeSelectBg: '#545454',
  },
  grayTheme: {
    name: '灰色',
    themeBg: '#323244',
    themeColor: '#ffffff',
    menuColor: '#ffffff',
    menuBg: '#28283a',
    menuOpenColor: '#FFFFFF',
    menuOpenBg: '#2d2d3d',
    menuSelectedBg: '#0c74f6',
    menuSelectedColor: 'white',
    layoutBg: '#323244',
    layoutHeaderBg: '#2c2c3e',
    layoutHeaderBorder: '#2b2d3c',
    themeLightColor: 'white',

    cardBg: '#2d2d3e',
    cardHeadColor: '#f8f9fa',
    cardBorder: 'solid 1px rgba(79, 79, 98, 0.5)',
    inputBorder: 'solid 1px #4f4f62',
    inputBg: '#28283b',
    themeDarkColor: 'rgba(255, 255, 255, 0.45)',
    tableHeadBg: '#5d5e66',
    tableHeadColor: '#ffffff',
    tableHeadShadow: '0px 1px 0px 0px #2b2d3c',
    tableBorder: '1px solid #5d5d6a',
    tableHoverBg: '#545454',
    tableTr2n: '#2e2e41',
    selectArrowBg: '#0c74f6',
    selectArrowBorderColor: '#0c74f6',
    treeColor: 'rgba(255,255,255,0.65)',
    treeNodeSelectBg: '#545454',
  },
};

export function updateTheme() {
  const themeKey = localStorage.getItem('themeKey');
  if (themeKey && window.less) {
    window.less.modifyVars(themes[themeKey]);
    document.getElementById('root').className = themeKey;
  }
}
