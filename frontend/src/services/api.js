const API_BASE = '/api';

export const surveyApi = {
  async createSurvey(surveyData) {
    const response = await fetch(`${API_BASE}/surveys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyData),
    });
    if (!response.ok) throw new Error('Failed to create survey');
    return response.json();
  },

  async listSurveys() {
    const response = await fetch(`${API_BASE}/surveys`);
    if (!response.ok) throw new Error('Failed to fetch surveys');
    return response.json();
  },

  async getSurvey(id) {
    const response = await fetch(`${API_BASE}/surveys/${id}`);
    if (!response.ok) throw new Error('Failed to fetch survey');
    return response.json();
  },

  async getSurveyByShareId(shareId) {
    const response = await fetch(`${API_BASE}/surveys/share/${shareId}`);
    if (!response.ok) throw new Error('Failed to fetch survey');
    return response.json();
  },

  async updateSurvey(id, surveyData) {
    const response = await fetch(`${API_BASE}/surveys/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyData),
    });
    if (!response.ok) throw new Error('Failed to update survey');
    return response.json();
  },

  async deleteSurvey(id) {
    const response = await fetch(`${API_BASE}/surveys/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete survey');
    return true;
  },

  async submitResponse(surveyId, answers) {
    const response = await fetch(`${API_BASE}/surveys/${surveyId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    if (!response.ok) throw new Error('Failed to submit response');
    return response.json();
  },

  async getResponses(surveyId) {
    const response = await fetch(`${API_BASE}/surveys/${surveyId}/responses`);
    if (!response.ok) throw new Error('Failed to fetch responses');
    return response.json();
  },

  async getAnalytics(surveyId) {
    const response = await fetch(`${API_BASE}/surveys/${surveyId}/analytics`);
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },
};
