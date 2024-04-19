import React from 'react';
import {Link, Tabs} from '@gravity-ui/uikit';

import './header.scss';

function Header({activeTab, items, handleSetInputAreaTabActive}) {
  return (
    <div className="header">
      <div className="wrapper">
          <Link href="/playground">
              <img src="https://storage.yandexcloud.net/diplodoc-www-assets/navigation/diplodoc-logo.svg" />
          </Link>
          <Tabs
              className="header__tabs"
              activeTab={activeTab}
              items={items}
              onSelectTab={handleSetInputAreaTabActive}
              // children={(prop) => <h1>{prop}</h1>}
              wrapTo={(item, node) => <div className="header__tab">{node}</div>}
          />
        <Link href="https://diplodoc.com/docs/ru/" view="primary" className={'documentation'}>
          <span className="text">Документация</span>
        </Link>
      </div>
    </div>
  );
}

export default Header;
