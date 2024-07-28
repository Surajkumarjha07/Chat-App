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
import Link from 'next/link';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleDarkMode } from '../redux/slices/darkMode';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

const drawerWidth = 240;

const openedMixin = (theme, isDarkMode) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: isDarkMode ? '#4B5563' : 'white',
  color: isDarkMode ? 'white' : 'black'
});

const closedMixin = (theme, isDarkMode) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: isDarkMode ? '#4B5563' : 'white',
  color: isDarkMode ? 'white' : 'black'
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
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
  ({ theme, open, isDarkMode }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme, isDarkMode),
      '& .MuiDrawer-paper': openedMixin(theme, isDarkMode),
    }),
    ...(!open && {
      ...closedMixin(theme, isDarkMode),
      '& .MuiDrawer-paper': closedMixin(theme, isDarkMode),
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
  const [color, setColor] = useState('')
  const isDarkMode = useAppSelector(state => state.darkMode.isDarkMode)
  const dispatch = useAppDispatch()

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const changePage = (index) => {
    localStorage.setItem('storedIndex', index)
    setSelectedIndex(index)
  }

  useEffect(() => {
    let storedIndex = localStorage.getItem('storedIndex')
    if (storedIndex !== null) {
      setSelectedIndex(Number(storedIndex))
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

    let colors = ['bg-red-400', 'bg-green-500', 'bg-yellow-400', 'bg-orange-600', 'bg-gray-400', 'bg-red-700', 'bg-emerald-500']
    let color = colors[Math.floor(Math.random() * colors.length)]
    setColor(color)

  }, [])

  const handleChange = () => {
    dispatch(toggleDarkMode())
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} className={`${isDarkMode ? 'bg-gray-700' : 'bg-green-700'} shadow-none`}>
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

          <FormControlLabel control={<Switch />} label="Dark-Mode" onChange={handleChange} className='fixed right-32' />

          {
            token ?
              <div className='group fixed right-10 h-44 top-2 w-full cursor-pointer'>
                <div className={`rounded-full fixed right-10 w-12 h-12 ${color} outline-dashed flex justify-center items-center text-2xl`}>
                  {username[0].toUpperCase()}
                </div>

                <div className={`group-hover:block justify-center items-center gap-7 hidden rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} w-fit px-4 h-32 fixed right-10 top-20`}>

                  <div className='flex justify-end items-center gap-4 mt-2'>
                    <Link href={'../updateUser'}>
                      <button className='text-black bg-blue-100 px-2 py-2 rounded-full'>
                        <EditRoundedIcon />
                      </button>
                    </Link>

                    <Link href={'../deleteUser'}>
                      <button className='text-red-600 bg-red-100 px-2 py-2 rounded-full'>
                        <DeleteRoundedIcon />
                      </button>
                    </Link>
                  </div>

                  <div className='flex justify-center items-center gap-4 mt-4'>
                    <div className={`rounded-full w-12 h-12 ${color} flex justify-center items-center text-2xl`}>
                      {username[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className='text-lg font-semibold'> {username} </h2>
                      <p className='text-sm'> {email} </p>
                    </div>
                  </div>

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
      <Drawer variant="permanent" open={open} isDarkMode={isDarkMode}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List className={`${open === true ? 'px-4' : ''}`}>
          {menuItems.map((item, index) => (
            <Link href={item.link} key={index}>
              <ListItem key={index} disablePadding sx={{ display: 'block' }} className={`rounded-md ${selectedIndex === index ? `${isDarkMode ? 'bg-gray-500' : 'bg-green-600 text-white'} ` : ''}`} onClick={() => changePage(index)}>
                <ListItemButton className='px-4'>
                  <ListItemIcon className={`${selectedIndex === index ? 'text-white' : ''} ${isDarkMode ? 'text-white' : ''}`}>
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
