import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getMyHealthMetrics, createHealthMetric, deleteHealthMetric } from '../api/healthMetrics';
import { me } from '../api/auth';

const HealthMetricsPage = () => {
  const [metrics, setMetrics] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [bodyFat, setBodyFat] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, metricsData] = await Promise.all([
          me(),
          getMyHealthMetrics()
        ]);
        setUser(userData);
        setMetrics(metricsData);
      } catch (e) {
        setError('Failed to load health metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setWeightKg('');
    setHeightCm('');
    setBodyFat('');
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const newMetric = await createHealthMetric({
        trainee_id: user.id,
        weight_kg: weightKg ? parseFloat(weightKg) : null,
        height_cm: heightCm ? parseFloat(heightCm) : null,
        body_fat_percentage: bodyFat ? parseFloat(bodyFat) : null,
      });
      setMetrics(prev => [newMetric, ...prev]);
      handleClose();
    } catch (err) {
      setError('Failed to add health metric');
    } finally {
      setSubmitting(false);
    }
  }, [weightKg, heightCm, bodyFat, user]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this metric?')) return;
    
    try {
      await deleteHealthMetric(id);
      setMetrics(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError('Failed to delete metric');
    }
  }, []);

  // Prepare chart data
  const chartData = [...metrics].reverse().map(m => ({
    date: new Date(m.recorded_at).toLocaleDateString(),
    weight: m.weight_kg,
    bodyFat: m.body_fat_percentage,
  }));

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Health Metrics
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Metric
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {metrics.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                No health metrics recorded yet. Click "Add Metric" to start tracking your progress!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Weight & Body Fat Chart */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Progress Chart
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="weight"
                      stroke="#8884d8"
                      name="Weight (kg)"
                      connectNulls
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="bodyFat"
                      stroke="#82ca9d"
                      name="Body Fat (%)"
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Metrics Table */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Measurement History
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Weight (kg)</TableCell>
                        <TableCell align="right">Weight (lbs)</TableCell>
                        <TableCell align="right">Height (cm)</TableCell>
                        <TableCell align="right">Body Fat (%)</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {metrics.map((metric) => (
                        <TableRow key={metric.id}>
                          <TableCell>
                            {new Date(metric.recorded_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="right">
                            {metric.weight_kg ? metric.weight_kg.toFixed(1) : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {metric.weight_kg ? (metric.weight_kg * 2.20462).toFixed(1) : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {metric.height_cm ? metric.height_cm.toFixed(1) : '-'}
                          </TableCell>
                          <TableCell align="right">
                            {metric.body_fat_percentage ? metric.body_fat_percentage.toFixed(1) : '-'}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(metric.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Add Metric Dialog */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Add Health Metric</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Height (cm)"
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Body Fat Percentage"
                    type="number"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    inputProps={{ step: 0.1, min: 0, max: 100 }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || (!weightKg && !heightCm && !bodyFat)}
              >
                {submitting ? 'Adding...' : 'Add Metric'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Container>
  );
};

export default HealthMetricsPage;
