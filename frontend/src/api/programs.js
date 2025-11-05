import client from './client';

export async function getProgramExercises(programId) {
  const { data } = await client.get(`/programs/${programId}/exercises`);
  return data;
}

export async function getProgramExercisesByProgram(programId) {
  // Fallback: get all program_exercises and filter by program_id
  const { data } = await client.get('/program_exercises/');
  return data.filter(pe => pe.program_id === programId);
}
