import React, { useState } from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Avatar,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Switch,
    Tooltip,
    Badge,
    useMediaQuery,
    useTheme as useMuiTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    BarChart as BarChartIcon,
    MonitorHeart as MonitorHeartIcon,
    FitnessCenter as FitnessCenterIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
    People as PeopleIcon,
    Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../api/auth';
import { gradients } from '../theme/theme';

const MotionBox = motion(Box);

const DRAWER_WIDTH = 260;

const AppLayout = ({ children, user, toggleTheme, mode }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useMuiTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const isTrainer = user?.role === 'TRAINER';

    const menuItems = [
        {
            text: 'Dashboard',
            icon: <DashboardIcon />,
            path: '/dashboard',
            roles: ['TRAINEE', 'TRAINER', 'ADMIN'],
        },
        {
            text: 'Analytics',
            icon: <BarChartIcon />,
            path: '/analytics',
            roles: ['TRAINEE', 'TRAINER', 'ADMIN'],
        },
        {
            text: 'Health Metrics',
            icon: <MonitorHeartIcon />,
            path: '/health-metrics',
            roles: ['TRAINEE', 'ADMIN'],
        },
        {
            text: 'Trainer Dashboard',
            icon: <PeopleIcon />,
            path: '/trainer-dashboard',
            roles: ['TRAINER', 'ADMIN'],
        },
        {
            text: 'Profile',
            icon: <PersonIcon />,
            path: '/profile',
            roles: ['TRAINEE', 'TRAINER', 'ADMIN'],
        },
    ];

    const visibleMenuItems = menuItems.filter((item) =>
        item.roles.includes(user?.role)
    );

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo Section */}
            <Box
                sx={{
                    p: 3,
                    background: gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <FitnessCenterIcon sx={{ color: 'white', fontSize: 24 }} />
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>
                    FitTrack Pro
                </Typography>
            </Box>

            <Divider />

            {/* Navigation Items */}
            <List sx={{ flex: 1, pt: 2 }}>
                {visibleMenuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    mx: 1.5,
                                    borderRadius: 2,
                                    background: isActive ? gradients.primary : 'transparent',
                                    color: isActive ? 'white' : 'text.primary',
                                    '&:hover': {
                                        background: isActive
                                            ? gradients.primary
                                            : 'action.hover',
                                    },
                                    transition: 'all 0.2s',
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? 'white' : 'text.secondary',
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 700 : 500,
                                        fontSize: '0.95rem',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider />

            {/* Theme Toggle */}
            <Box sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 1.5,
                        borderRadius: 2,
                        background: 'action.hover',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {mode === 'dark' ? 'Dark' : 'Light'} Mode
                        </Typography>
                    </Box>
                    <Switch
                        checked={mode === 'dark'}
                        onChange={toggleTheme}
                        color="primary"
                    />
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    ml: { md: `${DRAWER_WIDTH}px` },
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                }}
                elevation={0}
            >
                <Toolbar>
                    {/* Mobile Menu Button */}
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Page Title */}
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        {visibleMenuItems.find((item) => item.path === location.pathname)
                            ?.text || 'Dashboard'}
                    </Typography>

                    {/* Notifications */}
                    <Tooltip title="Notifications">
                        <IconButton color="inherit" sx={{ mr: 1 }}>
                            <Badge badgeContent={3} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* User Menu */}
                    <Tooltip title="Account">
                        <IconButton onClick={handleMenuClick} sx={{ p: 0.5 }}>
                            <Avatar
                                sx={{
                                    background: gradients.accent,
                                    fontWeight: 700,
                                }}
                            >
                                {user?.first_name?.charAt(0) || 'U'}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            sx: { mt: 1.5, minWidth: 200, borderRadius: 2 },
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {user?.first_name} {user?.last_name}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary' }}
                            >
                                {user?.email}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={() => handleNavigation('/profile')}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', md: 'block' },
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
                    mt: 8,
                    minHeight: 'calc(100vh - 64px)',
                }}
            >
                <AnimatePresence mode="wait">
                    <MotionBox
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </MotionBox>
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default AppLayout;
