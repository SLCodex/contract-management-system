function computeStatus(endDate, currentStatus) {
  if (currentStatus === 'Terminated') {
    return 'Terminated';
  }

  if (currentStatus === 'Pending Approval') {
    return 'Pending Approval';
  }

  const now = new Date();
  const end = new Date(endDate);

  if (end < now) {
    return 'Expired';
  }

  const in30Days = new Date();
  in30Days.setDate(now.getDate() + 30);

  if (end <= in30Days) {
    return 'Expiring Soon';
  }

  if (currentStatus === 'Draft') {
    return 'Draft';
  }

  return 'Active';
}

module.exports = { computeStatus };
