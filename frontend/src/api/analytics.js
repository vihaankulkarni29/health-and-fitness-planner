import client from './client';

export async function getExerciseFrequency(days = 30) {
  const { data } = await client.get('/analytics/me/exercise-frequency', {
    params: { days }
  });
  return data;
}

export async function getTopExercises(days = 30, limit = 10) {
  const { data } = await client.get('/analytics/me/top-exercises', {
    params: { days, limit }
  });
  return data;
}

export async function getVolumeTrend(days = 30) {
  const { data } = await client.get('/analytics/me/volume-trend', {
    params: { days }
  });
  return data;
}

export async function getPersonalRecords() {
  const { data } = await client.get('/analytics/me/personal-records');
  return data;
}

export async function getAnalyticsSummary() {
  const { data } = await client.get('/analytics/me/summary');
  return data;
}
