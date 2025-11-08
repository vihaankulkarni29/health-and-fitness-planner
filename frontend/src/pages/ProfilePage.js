import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import { me } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await me();
        setUser(userData);
        setFirstName(userData.first_name || '');
        setLastName(userData.last_name || '');
        setEmail(userData.email || '');
      } catch (e) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, you'd have an update profile endpoint
      // For now, we'll show a message that the feature is coming soon
      setSuccess('Profile update feature coming soon!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <Spinner center label="Loading profile..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container maxWidth="md">
        <Box sx={{ mb: 2 }}>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
        </Box>

        <Typography variant="h1" component="h1" gutterBottom>
          My Profile
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={3}>
          {/* Profile Info Card */}
          <Grid item xs={12}>
            <Card>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  size="lg"
                  color="orange"
                  sx={{ mr: 2 }}
                >
                  <PersonIcon sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5">
                    {user?.first_name} {user?.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              </Box>

                <Divider sx={{ my: 2 }} />

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Input
                        fullWidth
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Input
                        fullWidth
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Input
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="primary"
                        startIcon={<SaveIcon />}
                        disabled={submitting}
                      >
                        {submitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
            </Card>
          </Grid>

          {/* Stats Card */}
          <Grid item xs={12}>
            <Card>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Member ID:
                    </Typography>
                    <Typography variant="body2">
                      #{user?.id}
                    </Typography>
                  </Box>
                  {user?.program && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Current Program:
                      </Typography>
                      <Typography variant="body2">
                        {user.program.name}
                      </Typography>
                    </Box>
                  )}
                  {user?.program?.trainer && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Trainer:
                      </Typography>
                      <Typography variant="body2">
                        {user.program.trainer.first_name} {user.program.trainer.last_name}
                      </Typography>
                    </Box>
                  )}
              </Stack>
            </Card>
          </Grid>

          {/* Password Change Card */}
          <Grid item xs={12}>
            <Card>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Password change functionality coming soon.
              </Typography>
              <Button variant="secondary" disabled>
                Change Password
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AppLayout>
  );
};

export default ProfilePage;
