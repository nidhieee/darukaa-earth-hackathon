import client from './client';

export const createSite = async (projectId, data) => {
  const res = await client.post(`/projects/${projectId}/sites`, data);
  return res.data;
};

export const getSite = async (id) => {
  const res = await client.get(`/sites/${id}`);
  return res.data;
};

export const getSiteAnalytics = async (id) => {
  const res = await client.get(`/sites/${id}/analytics`);
  return res.data;
};
