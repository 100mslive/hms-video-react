import React, { useMemo, useState, useEffect } from 'react';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
  menuItemActive?: string;
  menuTitleContainer?: string;
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
  trigger?: JSX.Element;
  onTrigger?: (open: boolean) => void;
  children:
    | React.ReactElement<ContextMenuItemProps>
    | React.ReactElement<ContextMenuItemProps>[];
  menuProps?: Partial<MenuProps>;
}

export interface ContextMenuItemProps extends ContextMenuDataItem {
  classes?: ContextMenuItemClasses;
  onClick: () => void;
  children?: JSX.Element;
  active?: boolean;
}

const defaultClasses: ContextMenuClasses = {
  root: 'absolute right-2.5 top-2.5 flex flex-col items-end',
  trigger:
    'w-9 h-9 rounded-full bg-gray-300 cursor-pointer flex items-center justify-center z-20',
  triggerIcon: 'fill-current text-white w-5',
  menu:
    'bg-white max-w-full dark:bg-gray-200 mt-2.5 rounded-lg w-44 h-auto max-h-15 py-2 overflow-y-auto text-white z-20',
  menuItem:
    'w-full flex flex-row flex-wrap items-center px-2 my-1 hover:bg-gray-600 dark:hover:bg-gray-300 cursor-pointer',
  menuIcon: 'w-6 mr-2 fill-current text-gray-100 dark:text-white',
  menuTitle: 'text-gray-100 dark:text-white text-base min-w-0 truncate',
  menuItemChildren: 'w-11/12 ml-1 justify-self-center',
  menuItemActive: 'bg-gray-600 dark:bg-gray-300',
  menuTitleContainer: 'w-full flex items-center',
};

export const ContextMenuItem = ({
  classes,
  icon,
  label,
  children,
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
    <>
      <div className={styler('menuTitleContainer')}>
        {icon && <span className={styler('menuIcon')}>{icon}</span>}
        <span className={styler('menuTitle')} title={label}>
          {label}
        </span>
      </div>
      {children && <div className={styler('menuItemChildren')}>{children}</div>}
    </>
  );
};

export const ContextMenu = ({
  classes,
  children,
  menuOpen = false,
  trigger,
  onTrigger,
  menuProps,
}: ContextMenuProps) => {
  const { tw } = useHMSTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<ContextMenuClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-contextmenu',
      }),
    [classes],
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
    onTrigger && onTrigger(true);
  };

  useEffect(() => {
    setOpen(menuOpen);
  }, [menuOpen]);

  // Don't render context menu when no children are present
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null;
  }

  return (
    <div className={styler('root')}>
      <div className={styler('trigger')} onClick={handleClick}>
        {trigger || (
          <DotMenuIcon
            className={styler('triggerIcon')}
            aria-label="more"
            aria-controls="context-menu"
            aria-haspopup="true"
          />
        )}
      </div>
      <Menu
        id="context-menu"
        anchorEl={anchorEl}
        autoFocus={false}
        open={open}
        getContentAnchorEl={null}
        onClose={() => {
          setOpen(false);
          onTrigger && onTrigger(false);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{ paper: styler('menu') }}
        {...menuProps}
      >
        {React.Children.map(children, child => {
          return (
            <MenuItem
              key={child.key}
              classes={{
                root: `${styler('menuItem')}  ${
                  child.props.active ? styler('menuItemActive') : ''
                }`,
              }}
              style={{
                minHeight: 40,
              }}
              onClick={() => {
                child.props.onClick();
                setOpen(false);
              }}
            >
              {child}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};
