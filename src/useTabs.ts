import {ReactNode, useState} from 'react';
import {TabsItemProps, TabsProps} from '@gravity-ui/uikit/legacy';

export type TabItem = TabsItemProps & {node?: ReactNode};

export type UseTabsParameters = {
  items: TabItem[];
  initial: string;
  onSetActive?: (active: string) => void;
};

function useTabs(parameters: UseTabsParameters): [TabsProps['items'], string, (a: string) => void] {
  const {items, initial, onSetActive} = parameters;

  const [active, setTabActive] = useState(initial);

  const handleSetTabActive = (value: string) => {
    setTabActive(value);

    if (onSetActive) {
      onSetActive(value);
    }
  };

  return [items, active, handleSetTabActive];
}

export {useTabs};
export default {useTabs};
