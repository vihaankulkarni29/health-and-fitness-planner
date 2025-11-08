import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getMyHealthMetrics, createHealthMetric, deleteHealthMetric } from '../api/healthMetrics';
import { me } from '../api/auth';
import AppLayout from '../components/AppLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Table from '../components/ui/Table';
import Spinner from '../components/ui/Spinner';

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
      <AppLayout>
        <Spinner center label="Loading health metrics..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 2 }}>
          <Button variant="ghost" onClick={() => window.history.back()}>
            ← Back
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h1" component="h1">
            Health Metrics
          </Typography>
          <Button
            variant="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Metric
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {metrics.length === 0 ? (
          <Card>
            <Typography variant="body2" color="text.secondary">
              No health metrics recorded yet. Click "Add Metric" to start tracking your progress!
            </Typography>
          </Card>
        ) : (
          <>
            {/* Weight & Body Fat Chart */}
            <Card sx={{ mb: 3 }}>
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
                      stroke="#D84315"
                      name="Weight (kg)"
                      connectNulls
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="bodyFat"
                      stroke="#43A047"
                      name="Body Fat (%)"
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
            </Card>

            {/* Metrics Table */}
            <Card>
              <Typography variant="h6" gutterBottom>
                Measurement History
              </Typography>
              <Table
                columns={[
                  {
                    id: 'date',
                    label: 'Date',
                    field: 'recorded_at',
                    render: (row) => new Date(row.recorded_at).toLocaleDateString(),
                  },
                  {
                    id: 'weight_kg',
                    label: 'Weight (kg)',
                    field: 'weight_kg',
                    align: 'right',
                    render: (row) => row.weight_kg ? row.weight_kg.toFixed(1) : '-',
                  },
                  {
                    id: 'weight_lbs',
                    label: 'Weight (lbs)',
                    field: 'weight_lbs',
                    align: 'right',
                    render: (row) => row.weight_kg ? (row.weight_kg * 2.20462).toFixed(1) : '-',
                  },
                  {
                    id: 'height',
                    label: 'Height (cm)',
                    field: 'height_cm',
                    align: 'right',
                    render: (row) => row.height_cm ? row.height_cm.toFixed(1) : '-',
                  },
                  {
                    id: 'body_fat',
                    label: 'Body Fat (%)',
                    field: 'body_fat_percentage',
                    align: 'right',
                    render: (row) => row.body_fat_percentage ? row.body_fat_percentage.toFixed(1) : '-',
                  },
                  {
                    id: 'actions',
                    label: 'Actions',
                    field: 'actions',
                    align: 'right',
                    render: (row) => (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    ),
                  },
                ]}
                data={metrics}
                emptyMessage="No health metrics recorded"
                emptyDescription="Start tracking by adding your first metric above"
              />
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
                  <Input
                    fullWidth
                    label="Weight (kg)"
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    fullWidth
                    label="Height (cm)"
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    inputProps={{ step: 0.1, min: 0 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
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
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || (!weightKg && !heightCm && !bodyFat)}
              >
                {submitting ? 'Adding...' : 'Add Metric'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </AppLayout>
  );
};

export default HealthMetricsPage;
