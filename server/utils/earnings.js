const calculateEarnings = (sessions) => {
  const earnings = {
    total: 0,
    weekly: 0,
    monthly: 0,
    bySubject: {},
    byDate: {}
  };

  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  sessions.forEach(session => {
    const amount = session.duration * session.hourlyRate;
    earnings.total += amount;

    // Calculate weekly earnings
    if (session.date >= weekStart) {
      earnings.weekly += amount;
    }

    // Calculate monthly earnings
    if (session.date >= monthStart) {
      earnings.monthly += amount;
    }

    // Group by subject
    if (!earnings.bySubject[session.subject]) {
      earnings.bySubject[session.subject] = 0;
    }
    earnings.bySubject[session.subject] += amount;

    // Group by date
    const dateStr = session.date.toISOString().split('T')[0];
    if (!earnings.byDate[dateStr]) {
      earnings.byDate[dateStr] = 0;
    }
    earnings.byDate[dateStr] += amount;
  });

  return earnings;
};

module.exports = {
  calculateEarnings
}; 