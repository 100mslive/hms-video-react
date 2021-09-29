import React, { useMemo, useState, useEffect } from 'react';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core';
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
  menuIconRight?: string;
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
  iconRight?: string;
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
  noGutters?: boolean;
}

export interface ContextMenuItemProps extends ContextMenuDataItem {
  classes?: ContextMenuItemClasses;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  children?: JSX.Element;
  active?: boolean;
  closeMenuOnClick?: boolean;
  addDivider?: boolean;
}

const defaultClasses: ContextMenuClasses = {
  root: 'absolute right-2.5 top-2.5 flex flex-col items-end',
  trigger:
    'w-9 h-9 rounded-full bg-gray-300 cursor-pointer flex items-center justify-center z-20',
  triggerIcon: 'fill-current text-white w-5',
  menu:
    'bg-white max-w-full dark:bg-gray-200 mt-2.5 w-48 h-auto max-h-15 overflow-y-auto text-white z-20',
  menuItem:
    'w-full flex flex-row flex-wrap items-center px-2 my-1 hover:bg-gray-600 dark:hover:bg-gray-300 cursor-pointer',
  menuIcon: 'w-6 mr-2 fill-current text-gray-100 dark:text-white',
  menuIconRight:
    'w-6 ml-2 fill-current text-gray-100 dark:text-white justify-self-end flex-shrink-0',
  menuTitle: 'text-gray-100 dark:text-white text-base min-w-0 flex-1 truncate',
  menuItemChildren: 'w-11/12 ml-1 justify-self-center',
  menuItemActive: 'bg-gray-600 dark:bg-gray-300',
  menuTitleContainer: 'w-full flex items-center py-2',
};

const useMenuStyles = makeStyles({
  paper: {
    borderRadius: '12px',
    '& > .MuiList-padding': {
      padding: (props: Partial<ContextMenuProps>) =>
        props.noGutters ? '0' : '8px 0',
    },
  },
});

const useStyles = makeStyles({
  gutters: {
    padding: (props: Partial<ContextMenuProps>) =>
      props.noGutters ? '0' : '0 12px',
  },
  divider: {
    borderTop: '1px solid #777777',
    paddingTop: '12px',
    paddingBottom: '12px',
  },
});

export const ContextMenuItem = ({
  classes,
  icon,
  label,
  children,
  iconRight,
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
        {iconRight && (
          <span className={styler('menuIconRight')}>{iconRight}</span>
        )}
      </div>
      {children && <div className={styler('menuItemChildren')}>{children}</div>}
    </>
  );
};

ContextMenuItem.defaultProps = {
  closeMenuOnClick: true,
  addDivider: false,
};

export const ContextMenu = ({
  classes,
  children,
  menuOpen = false,
  trigger,
  onTrigger,
  menuProps,
  noGutters,
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
    [],
  );
  const menuItemClasses = useStyles({ noGutters });
  const menuClasses = useMenuStyles({ noGutters });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
    onTrigger && onTrigger(true);
  };

  const handleClose = () => {
    setOpen(false);
    onTrigger && onTrigger(false);
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
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{ paper: `${menuClasses.paper} ${styler('menu')}` }}
        {...menuProps}
      >
        {React.Children.map(children, child => {
          if (!child) {
            return null;
          }
          return (
            <MenuItem
              key={child.key}
              classes={{
                root: `${styler('menuItem')} ${
                  child.props.active ? styler('menuItemActive') : ''
                } ${child.props.addDivider ? menuItemClasses.divider : ''}`,
                gutters: menuItemClasses.gutters,
              }}
              disableTouchRipple
              style={{
                minHeight: 40,
              }}
              onClick={event => {
                child.props.onClick && child.props.onClick(event);
                if (child.props.closeMenuOnClick) {
                  handleClose();
                }
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
