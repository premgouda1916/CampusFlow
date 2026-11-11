import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses and normalize error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        localStorage.removeItem('campusflow_token');
        localStorage.removeItem('campusflow_user');
        window.location.href = '/login?session_expired=true';
      }
    }
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export const authService = {
  login: (data) => api.post('/auth/login', data),
  registerStudent: (data) => api.post('/auth/register/student', data),
  registerRecruiter: (data) => api.post('/auth/register/recruiter', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const studentService = {
  getMyProfile: () => api.get('/students/me'),
  updateMyProfile: (data) => api.put('/students/me', data),
  uploadResume: (formData) => api.post('/students/me/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getStudentById: (id) => api.get(`/students/${id}`),
  listStudents: (params) => api.get('/students', { params }),
};

export const companyService = {
  getCompanies: (params) => api.get('/companies', { params }),
  getCompanyById: (id) => api.get(`/companies/${id}`),
  createCompany: (data) => api.post('/companies', data),
  verifyCompany: (id, verified) => api.patch(`/companies/${id}/verify?verified=${verified}`),
};

export const recruiterService = {
  getMyProfile: () => api.get('/recruiters/me'),
  getPendingRecruiters: (params) => api.get('/recruiters/pending', { params }),
  approveRecruiter: (id, approved) => api.patch(`/recruiters/${id}/approve?approved=${approved}`),
};

export const jobService = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  checkEligibility: (id) => api.get(`/jobs/${id}/eligibility`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  publishJob: (id) => api.patch(`/jobs/${id}/publish`),
  closeJob: (id) => api.patch(`/jobs/${id}/close`),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

export const applicationService = {
  applyForJob: (jobId, data) => api.post(`/applications/jobs/${jobId}`, data || {}),
  getMyApplications: (params) => api.get('/applications/me', { params }),
  getJobApplications: (jobId, params) => api.get(`/applications/job/${jobId}`, { params }),
  getCompanyApplications: (params) => api.get('/applications/company', { params }),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, data) => api.patch(`/applications/${id}/status`, data),
  withdrawApplication: (id) => api.post(`/applications/${id}/withdraw`),
  getApplicationHistory: (id) => api.get(`/applications/${id}/history`),
};

export const interviewService = {
  scheduleInterview: (applicationId, data) => api.post(`/interviews/applications/${applicationId}`, data),
  updateFeedback: (id, data) => api.patch(`/interviews/${id}/feedback`, data),
  getMyInterviews: (params) => api.get('/interviews/me', { params }),
  getCompanyInterviews: (params) => api.get('/interviews/company', { params }),
};

export const offerService = {
  createOffer: (applicationId, data) => api.post(`/offers/applications/${applicationId}`, data),
  respondToOffer: (id, action) => api.patch(`/offers/${id}/respond`, { action }),
  getMyOffers: (params) => api.get('/offers/me', { params }),
  getCompanyOffers: (params) => api.get('/offers/company', { params }),
};

export const driveService = {
  getAllDrives: () => api.get('/placement/drives'),
  getDriveById: (id) => api.get(`/placement/drives/${id}`),
  createDrive: (data) => api.post('/placement/drives', data),
  updateDrive: (id, data) => api.put(`/placement/drives/${id}`, data),
};

export const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export const analyticsService = {
  getStudentDashboard: () => api.get('/analytics/student'),
  getRecruiterDashboard: () => api.get('/analytics/recruiter'),
  getPlacementOfficerDashboard: () => api.get('/analytics/placement'),
  getAdminDashboard: () => api.get('/analytics/admin'),
};

export const departmentService = {
  getDepartments: () => api.get('/departments'),
};

export default api;
