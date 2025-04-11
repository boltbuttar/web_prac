import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  // Mock data - would be replaced with actual API data
  const stats = {
    totalUsers: 150,
    activeTutors: 45,
    totalSessions: 320,
    revenue: 25000,
    pendingApprovals: 5,
    activeStudents: 105
  };

  const recentUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student',
      status: 'active',
      joinDate: '2024-03-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'tutor',
      status: 'pending',
      joinDate: '2024-03-14'
    },
    // Add more mock data as needed
  ];

  const systemStatus = {
    serverStatus: 'healthy',
    databaseStatus: 'healthy',
    apiStatus: 'healthy',
    lastBackup: '2024-03-19 02:00 AM'
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ mr: 2, color }}>
          {icon}
        </Box>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon fontSize="large" />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Tutors"
            value={stats.activeTutors}
            icon={<SchoolIcon fontSize="large" />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Sessions"
            value={stats.totalSessions}
            icon={<EventIcon fontSize="large" />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            icon={<MoneyIcon fontSize="large" />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={<WarningIcon fontSize="large" />}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Students"
            value={stats.activeStudents}
            icon={<CheckCircleIcon fontSize="large" />}
            color="secondary.main"
          />
        </Grid>
      </Grid>

      {/* Recent Users and System Status */}
      <Grid container spacing={3}>
        {/* Recent Users */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Users
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Join Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          size="small"
                          color={user.role === 'tutor' ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          color={user.status === 'active' ? 'success' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>
                        <Button size="small" color="primary">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Server Status"
                  secondary={
                    <Chip
                      label={systemStatus.serverStatus}
                      size="small"
                      color={systemStatus.serverStatus === 'healthy' ? 'success' : 'error'}
                    />
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Database Status"
                  secondary={
                    <Chip
                      label={systemStatus.databaseStatus}
                      size="small"
                      color={systemStatus.databaseStatus === 'healthy' ? 'success' : 'error'}
                    />
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="API Status"
                  secondary={
                    <Chip
                      label={systemStatus.apiStatus}
                      size="small"
                      color={systemStatus.apiStatus === 'healthy' ? 'success' : 'error'}
                    />
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Last Backup"
                  secondary={systemStatus.lastBackup}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <Button variant="contained" color="primary">
                  Manage Users
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary">
                  View Reports
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary">
                  System Settings
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="primary">
                  Backup Database
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 