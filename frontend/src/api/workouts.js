import client from './client';

export async function startSession(trainee_id, program_id) {
  const payload = { trainee_id, program_id };
  const { data } = await client.post('/workout_sessions/start', payload);
  return data; // WorkoutSession
}

export async function endSession(session_id) {
  const { data } = await client.put(`/workout_sessions/${session_id}/end`);
  return data; // WorkoutSession
}

export async function getSession(session_id) {
  const { data } = await client.get(`/workout_sessions/${session_id}`);
  return data; // WorkoutSession
}

export async function logExercise(session_id, log) {
  const { data } = await client.post(`/workout_sessions/${session_id}/log-exercise`, log);
  return data; // ExerciseLog
}
