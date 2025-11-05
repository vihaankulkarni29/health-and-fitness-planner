import client from './client';

export async function getMyHealthMetrics() {
  const { data } = await client.get('/health_metrics/me');
  return data; // HealthMetric[]
}

export async function createHealthMetric(metric) {
  const { data } = await client.post('/health_metrics/', metric);
  return data; // HealthMetric
}

export async function updateHealthMetric(id, metric) {
  const { data } = await client.put(`/health_metrics/${id}`, metric);
  return data; // HealthMetric
}

export async function deleteHealthMetric(id) {
  const { data } = await client.delete(`/health_metrics/${id}`);
  return data; // HealthMetric
}
