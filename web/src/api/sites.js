import client from './client';

export const createSite = async (projectId, data) => {
  const res = await client.post(`/projects/${projectId}/sites`, data);
  return res.data;
};

export const getSite = async (id) => {
  const res = await client.get(`/sites/${id}`);
  return res.data;
};

export const getSiteAnalytics = async (siteId) => {
  const res = await client.get(`/sites/${siteId}/analytics`);
  return res.data;
};

export const updateSite = async (siteId, data) => {
  const res = await client.patch(`/sites/${siteId}`, data);
  return res.data;
};

export const deleteSite = async (siteId) => {
  const res = await client.delete(`/sites/${siteId}`);
  return res.data;
};
