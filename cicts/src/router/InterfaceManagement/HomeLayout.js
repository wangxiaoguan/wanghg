import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Carousel from '../../view/content/SystemSettings/HomeLayout/Carousel/Carousel.js';
import CarouselDetail from '../../view/content/SystemSettings/HomeLayout/Carousel/detail.js';
import Tag from '../../view/content/SystemSettings/HomeLayout/Tag/Tag.js';
import TagDetail from '../../view/content/SystemSettings/HomeLayout/Tag/detail.js';
import ContentManagement from '../../view/content/SystemSettings/HomeLayout/ContentManagement/Content';
import Menu from '../../view/content/SystemSettings/HomeLayout/Menu/Menu.js';
import MenuDetail from '../../view/content/SystemSettings/HomeLayout/Menu/detail.js';
const HomeMatch = 'HomeLayout';
const HomeLayout = (_) => {
  return(
    <Switch>
      {_.p('20003.21402.000')(<Route exact path={`${_.match}/${HomeMatch}/Carousel`} component={Carousel} />)}
      <Route path={`${_.match}/${HomeMatch}/NewCarousel`} component={CarouselDetail} />
      <Route path={`${_.match}/${HomeMatch}/CarouselDetail`} component={CarouselDetail} />
      <Route path={`${_.match}/${HomeMatch}/EditCarousel`} component={CarouselDetail} />

      {_.p('20003.21401.000')(<Route exact path={`${_.match}/${HomeMatch}/Tag`} component={Tag} />)}
      <Route path={`${_.match}/${HomeMatch}/NewTag`} component={TagDetail} />
      <Route path={`${_.match}/${HomeMatch}/EditTag`} component={TagDetail} />

      {_.p('20003.21403.000')(<Route exact path={`${_.match}/${HomeMatch}/Menu`} component={Menu} />)}
      <Route path={`${_.match}/${HomeMatch}/NewMenu`} component={MenuDetail} />
      <Route path={`${_.match}/${HomeMatch}/EditMenu`} component={MenuDetail} />

      {_.p('20003.21404.000')(<Route
        path={`${_.match}/${HomeMatch}/ContentManagement`}
        component={ContentManagement}
      />)}
    </Switch>
  );
};
export default HomeLayout;
