import {useState} from 'react';
import {TabsProps} from '@gravity-ui/uikit';

export type UseTabsParameters = {
  items: TabsProps['items'];
  initial: string;
  onSetActive?: (active: string) => void;
};

function useTabs(parameters: UseTabsParameters):[TabsProps['items'], string, (a: string) => void] {
  const {items, initial, onSetActive} = parameters;

  const [active, setTabActive] = useState(initial);

  const handleSetTabActive = (active: string) => {
    setTabActive(active);

    if (onSetActive) {
      onSetActive(active);
    }
  }

  return [items, active, handleSetTabActive ];
}

export {useTabs};
export default {useTabs};
