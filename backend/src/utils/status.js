function computeStatus(endDate, currentStatus) {
  if (currentStatus === 'Terminated') {
    return 'Terminated';
  }

  if (currentStatus === 'Pending Approval') {
    return 'Pending Approval';
  }

  if (currentStatus === 'Draft') {
    return 'Draft';
  }

  if (currentStatus === 'Expired') {
    return 'Expired';
  }

  if (currentStatus === 'Expiring Soon') {
    return 'Expiring Soon';
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

  return 'Active';
}

module.exports = { computeStatus };
