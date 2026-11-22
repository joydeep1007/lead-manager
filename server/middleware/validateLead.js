const LEAD_SOURCES = ['Website', 'Referral', 'Cold Call', 'Social', 'Other'];
const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLead(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const { name, email, status, source } = body;
  const errors = [];

  if (typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required');
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    errors.push('invalid email');
  }

  if (!LEAD_STATUSES.includes(status)) {
    errors.push(`status must be one of: ${LEAD_STATUSES.join(', ')}`);
  }

  if (!LEAD_SOURCES.includes(source)) {
    errors.push(`source must be one of: ${LEAD_SOURCES.join(', ')}`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  return next();
}

validateLead.LEAD_SOURCES = LEAD_SOURCES;
validateLead.LEAD_STATUSES = LEAD_STATUSES;

module.exports = validateLead;
