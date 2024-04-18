import React from 'react';
import {Link} from '@gravity-ui/uikit';

import './header.scss';

function Header() {
  return (
    <div className="header">
      <div className="wrapper">
          <Link href="/">
              <img src="https://storage.yandexcloud.net/diplodoc-www-assets/navigation/diplodoc-logo.svg" />
          </Link>
        <Link href="https://diplodoc.com/docs/ru/" view="primary">
          <span className="text">Документация</span>
        </Link>
      </div>
    </div>
  );
}

export default Header;
