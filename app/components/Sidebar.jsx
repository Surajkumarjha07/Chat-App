'use client'
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import Diversity2RoundedIcon from '@mui/icons-material/Diversity2Rounded';
import RoundaboutRightRoundedIcon from '@mui/icons-material/RoundaboutRightRounded';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Image from 'next/image';
import Link from 'next/link';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

let menuItems = [
  { Head: 'Chats', icon: <ChatRoundedIcon />, link: '../chat' },
  { Head: 'Group Chat', icon: <Diversity2RoundedIcon />, link: '../groupChat' },
  { Head: 'About Us', icon: <RoundaboutRightRoundedIcon />, link: '../about' },
];

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const changePage = (index) => {
    setSelectedIndex(index)
    localStorage.setItem('storedIndex', selectedIndex)
  }

  useEffect(() => {
    let storedIndex = localStorage.getItem('storedIndex')
    if (storedIndex !== null) {
      setSelectedIndex(storedIndex)
    }

    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
    }

    let username = localStorage.getItem('username');
    if (username) {
      setUsername(username)
    }

    let email = localStorage.getItem('email');
    if (email) {
      setEmail(email)
    }
  }, [])


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} className='bg-green-700 shadow-none'>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon className='text-white' />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Chatin-Go
          </Typography>

          {
            token ?
              <div className='flex gap-4 justify-center items-center absolute right-10'>
                <Avatar src='/icon.gif' />
                <div>
                  <h2 className='text-lg font-semibold'> { username } </h2>
                  <p className='text-sm'> { email } </p>
                </div>
              </div> :
              <Link href={'/login'}>
                <button className='flex gap-4 justify-center items-center absolute right-10 px-6 py-2 bg-white text-green-700 font-semibold rounded-md cursor-pointer -mt-5'>
                  Log In
                </button>
              </Link>
          }
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List className={`${open === true ? 'px-4' : ''}`}>
          {menuItems.map((item, index) => (
            <Link href={item.link}>
              <ListItem key={index} disablePadding sx={{ display: 'block' }} className={`rounded-md ${selectedIndex === index ? 'bg-green-600 text-white' : ''}`} onClick={() => changePage(index)}>
                <ListItemButton className='px-4'>
                  <ListItemIcon className={`${selectedIndex === index ? 'text-white' : ''}`}>
                    {
                      item.icon
                    }
                  </ListItemIcon>
                  <ListItemText primary={item.Head} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
