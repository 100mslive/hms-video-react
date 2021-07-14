import React, { useState, useMemo, useEffect } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { DotMenuIcon } from '../Icons';
import './index.css';

export interface ContextMenuClasses {
  root?: string;
  trigger?: string;
  triggerIcon?: string;
  menu?: string;
  menuItem?: string;
  menuTitle?: string;
  menuIcon?: string;
  menuItemChildren?: string;
}

export type ContextMenuItemClasses = Omit<
  ContextMenuClasses,
  'root' | 'trigger' | 'menu'
>;

export interface ContextMenuDataItem {
  label: string;
  icon?: JSX.Element;
}

export interface ContextMenuProps {
  classes?: ContextMenuClasses;
  menuOpen?: boolean;
  children:
    | React.ReactElement<ContextMenuItemProps>
    | React.ReactElement<ContextMenuItemProps>[];
}

export interface ContextMenuItemProps extends ContextMenuDataItem {
  classes?: ContextMenuItemClasses;
  onClick: () => void;
  children?: JSX.Element;
}

const defaultClasses: ContextMenuClasses = {
  root: 'absolute right-2.5 top-2.5 flex flex-col items-end',
  trigger:
    'w-9 h-9 rounded-full bg-gray-300 cursor-pointer flex items-center justify-center z-20',
  triggerIcon: 'fill-current text-white w-5',
  menu:
    'bg-white max-w-full dark:bg-gray-200 mt-2.5 rounded-lg w-44 h-auto max-h-15 py-2 text-white z-20',
  menuItem:
    'flex flex-row flex-wrap items-center px-2 hover:bg-gray-600 dark:hover:bg-gray-300 cursor-pointer',
  menuIcon: 'w-6 mr-2 fill-current text-gray-100 dark:text-white',
  menuTitle: 'text-gray-100 dark:text-white text-base w-9/12 min-w-0 truncate',
  menuItemChildren: 'w-11/12 ml-1 justify-self-center',
};

export const ContextMenuItem = ({
  classes,
  icon,
  label,
  children,
  onClick,
}: ContextMenuItemProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<ContextMenuClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-contextmenu',
      }),
    [],
  );

  return (
    <div
      className={styler('menuItem')}
      onClick={onClick}
      style={{ minHeight: 40 }}
    >
      {icon && <span className={styler('menuIcon')}>{icon}</span>}
      <span className={styler('menuTitle')}>{label}</span>
      {children && <div className={styler('menuItemChildren')}>{children}</div>}
    </div>
  );
};

export const ContextMenu = ({
  classes,
  children,
  menuOpen = false,
}: ContextMenuProps) => {
  const [open, setOpen] = useState(menuOpen);
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<ContextMenuClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-contextmenu',
      }),
    [],
  );

  useEffect(() => {
    setOpen(menuOpen);
  }, [menuOpen]);

  return (
    <div className={styler('root')}>
      <div className={styler('trigger')} onClick={() => setOpen(!open)}>
        <DotMenuIcon className={styler('triggerIcon')} />
      </div>
      {open && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div className={`${styler('menu')}`}>{children}</div>
        </ClickAwayListener>
      )}
    </div>
  );
};
