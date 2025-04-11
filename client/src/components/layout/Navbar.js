import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Favorite as FavoriteIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import useAuthStore from '../../store/authStore';
import { usePermissions } from '../../hooks/usePermissions';
import PermissionGuard from '../common/PermissionGuard';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { can, isStudent, isTutor, isAdmin } = usePermissions();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
    handleClose();
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (isStudent()) return '/student/dashboard';
    if (isTutor()) return '/tutor/dashboard';
    if (isAdmin()) return '/admin/dashboard';
    return '/';
  };

  const getRoleSpecificMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'student':
        return [
          { label: 'Dashboard', icon: <DashboardIcon />, path: '/student/dashboard' },
          { label: 'Find Tutors', icon: <SchoolIcon />, path: '/tutors' },
          { label: 'My Sessions', icon: <PersonIcon />, path: '/sessions' },
          { label: 'Wishlist', icon: <FavoriteIcon />, path: '/wishlist' },
          { label: 'Reviews', icon: <FavoriteIcon />, path: '/reviews' }
        ];
      case 'tutor':
        return [
          { label: 'Dashboard', icon: <DashboardIcon />, path: '/tutor/dashboard' },
          { label: 'My Sessions', icon: <PersonIcon />, path: '/sessions' },
          { label: 'Earnings', icon: <FavoriteIcon />, path: '/earnings' },
          { label: 'Profile', icon: <PersonIcon />, path: '/profile' }
        ];
      case 'admin':
        return [
          { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
          { label: 'Tutor Verification', icon: <AdminIcon />, path: '/admin/verification' },
          { label: 'Reports', icon: <FavoriteIcon />, path: '/admin/reports' },
          { label: 'Users', icon: <FavoriteIcon />, path: '/admin/users' }
        ];
      default:
        return [];
    }
  };

  const renderMenuItems = () => {
    const menuItems = getRoleSpecificMenuItems();
    return menuItems.map((item) => (
      <MenuItem
        key={item.label}
        onClick={() => {
          navigate(item.path);
          handleClose();
        }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.label} />
      </MenuItem>
    ));
  };

  const drawer = (
    <List>
      {renderMenuItems()}
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>
    </List>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleMobileMenu}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SchoolIcon sx={{ mr: 1 }} />
          EduConnect
        </Typography>

        {/* Search Bar (Desktop) */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          </Box>
        )}

        {/* Notifications */}
        <IconButton color="inherit" onClick={() => navigate('/notifications')}>
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Wishlist (Student only) */}
        {user && user.role === 'student' && (
          <IconButton color="inherit" onClick={() => navigate('/wishlist')}>
            <Badge badgeContent={2} color="error">
              <FavoriteIcon />
            </Badge>
          </IconButton>
        )}

        {/* User Menu */}
        <Tooltip title="Account settings">
          <IconButton onClick={handleMenu}>
            <Avatar
              alt={user?.profile?.firstName}
              src={user?.profile?.profileImage}
              sx={{ width: 32, height: 32 }}
            >
              {user?.profile?.firstName?.[0]}
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Desktop Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {renderMenuItems()}
        </Menu>

        {/* Mobile Menu */}
        {isMobile && (
          <Drawer
            variant="temporary"
            anchor="right"
            open={Boolean(mobileMenuAnchor)}
            onClose={handleClose}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 