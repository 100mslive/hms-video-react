import React, { useState, useMemo } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { DotMenuIcon } from '../Icons';
import './index.css';

export interface ContextMenuClasses {
  root?: string;
  trigger?: string;
  menu?: string;
  menuItem?: string;
  menuTitle?: string;
  menuIcon?: string;
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
  children:
    | React.ReactElement<ContextMenuItemProps>
    | React.ReactElement<ContextMenuItemProps>[];
}

export interface ContextMenuItemProps extends ContextMenuDataItem {
  classes?: ContextMenuItemClasses;
  onClick: () => void;
}

const defaultClasses: ContextMenuClasses = {
  root: 'absolute right-2.5 top-2.5 flex flex-col items-end z-50',
  trigger:
    'w-9 h-9 rounded-full bg-gray-300 cursor-pointer flex items-center justify-center',
  menu:
    'bg-white max-w-full dark:bg-gray-200 mt-2.5 rounded-lg w-44 h-auto py-2 text-white',
  menuItem:
    'flex items-center px-2 h-10 hover:bg-gray-600 dark:hover:bg-gray-300 cursor-pointer',
  menuIcon: 'w-6 mr-2 fill-current text-gray-100 dark:text-white',
  menuTitle: 'text-gray-100 dark:text-white text-base flex-1 min-w-0 truncate',
};

export const ContextMenuItem = ({
  classes,
  icon,
  label,
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
    <div className={styler('menuItem')} onClick={onClick}>
      {icon && <span className={styler('menuIcon')}>{icon}</span>}
      <span className={styler('menuTitle')}>{label}</span>
    </div>
  );
};

export const ContextMenu = ({ classes, children }: ContextMenuProps) => {
  const [open, setOpen] = useState(false);
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
    <div className={styler('root')}>
      <div className={styler('trigger')} onClick={() => setOpen(!open)}>
        <DotMenuIcon className="fill-current text-white w-5" />
      </div>
      {open && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div className={`${styler('menu')}`}>{children}</div>
        </ClickAwayListener>
      )}
    </div>
  );
};
