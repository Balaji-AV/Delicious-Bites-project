const FEEDBACK_KEY = 'db-feedback-items';
const CANCELLATION_KEY = 'db-cancellation-requests';

const readJson = (key, fallback = []) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFeedbackItems = () => readJson(FEEDBACK_KEY, []);

export const createFeedbackItem = ({ name, message, rating, userId }) => {
  const items = getFeedbackItems();
  const next = {
    id: Date.now(),
    userId,
    name,
    message,
    rating,
    approved: false,
    createdAt: new Date().toISOString()
  };
  const updated = [next, ...items];
  writeJson(FEEDBACK_KEY, updated);
  return next;
};

export const setFeedbackApproval = (id, approved) => {
  const items = getFeedbackItems();
  const updated = items.map((item) =>
    item.id === id
      ? {
          ...item,
          approved
        }
      : item
  );
  writeJson(FEEDBACK_KEY, updated);
  return updated;
};

export const getCancellationRequests = () => readJson(CANCELLATION_KEY, []);

export const createCancellationRequest = ({ orderId, userId, userName, userEmail }) => {
  const requests = getCancellationRequests();
  const exists = requests.some((item) => item.orderId === orderId);
  if (exists) return requests;

  const next = [
    {
      id: Date.now(),
      orderId,
      userId,
      userName,
      userEmail,
      createdAt: new Date().toISOString()
    },
    ...requests
  ];

  writeJson(CANCELLATION_KEY, next);
  return next;
};

export const removeCancellationRequest = (orderId) => {
  const requests = getCancellationRequests();
  const updated = requests.filter((item) => item.orderId !== orderId);
  writeJson(CANCELLATION_KEY, updated);
  return updated;
};
