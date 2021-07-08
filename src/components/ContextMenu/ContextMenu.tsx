import React, { useState, useMemo, Fragment } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { DotMenuIcon, MicOffIcon, StarIcon } from '../Icons';

export interface ContextMenuClasses {
  root?: string;
  trigger?: string;
  menu?: string;
  menuItem?: string;
  menuTitle?: string;
  menuIcon?: string;
}

export interface ContextMenuItem {
  label: string;
  value: any;
  icon?: JSX.Element;
}

export interface ContextMenuProps {
  classes?: ContextMenuClasses;
  position?: 'left' | 'right';
  items: Array<ContextMenuItem>;
  renderItem?: (item: ContextMenuItem) => JSX.Element;
  onItemClick: (item: ContextMenuItem) => void;
}

const defaultClasses: ContextMenuClasses = {
  root: 'absolute right-2.5 top-2.5 flex flex-col z-50',
  trigger:
    'self-end w-9 h-9 rounded-full bg-gray-300 cursor-pointer flex items-center justify-center',
  menu: 'bg-gray-200 mt-2.5 rounded-lg w-44 h-auto py-2 text-white',
  menuItem:
    'flex items-center px-2 h-10 hover:bg-gray-300 bg-gray-200 cursor-pointer',
  menuIcon: 'w-6',
  menuTitle:
    'ml-2 text-gray-100 dark:text-white text-base flex-1 min-w-0 truncate',
};

export const ContextMenu = ({
  classes,
  items,
  renderItem,
  onItemClick,
}: ContextMenuProps) => {
  const [open, setOpen] = useState(false);
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<ContextMenuClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-videoTileControls',
      }),
    [],
  );

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={styler('root')} onClick={() => setOpen(!open)}>
        <div className={styler('trigger')}>
          <DotMenuIcon className="fill-current text-white w-5" />
        </div>
        {open && (
          <div className={`${styler('menu')}`}>
            {items.map(item => {
              return (
                <div
                  className={styler('menuItem')}
                  onClick={() => onItemClick(item)}
                >
                  {renderItem ? (
                    renderItem(item)
                  ) : (
                    <Fragment>
                      <span className={styler('menuIcon')}>{item.icon}</span>
                      <span className={styler('menuTitle')}>{item.label}</span>
                    </Fragment>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};
