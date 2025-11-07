import client from './client';

export async function getMyClients(skip = 0, limit = 100) {
  const { data } = await client.get('/trainer-dashboard/me/clients', {
    params: { skip, limit }
  });
  return data;
}

export async function getClientProgress(clientId, days = 30) {
  const { data } = await client.get(`/trainer-dashboard/me/clients/${clientId}/progress`, {
    params: { days }
  });
  return data;
}

export async function getTrainerDashboardStats() {
  const { data } = await client.get('/trainer-dashboard/me/dashboard-stats');
  return data;
}
