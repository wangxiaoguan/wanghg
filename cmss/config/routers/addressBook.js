import { createRouteData, errorPage, loadingPage } from './../routerUtil';

export default createRouteData('/addressbook', '', './addressBook/framework', [
  loadingPage,
  errorPage,
]);
