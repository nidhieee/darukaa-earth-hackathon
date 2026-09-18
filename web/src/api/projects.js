import client from './client';

export const getProjects = async () => {
  const res = await client.get('/projects');
  return res.data;
};

export const createProject = async (data) => {
  const res = await client.post('/projects', data);
  return res.data;
};

export const updateProject = async (id, data) => {
  const res = await client.patch(`/projects/${id}`, data);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await client.delete(`/projects/${id}`);
  return res.data;
};
