const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// GET /api/leads
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      sort = 'createdAt'
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const leads = await Lead.find(query)
      .sort({ [sort]: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Lead.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      leads
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/leads/analytics
router.get('/analytics', async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const convertedLeads = await Lead.countDocuments({ status: 'Converted' });

    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      totalLeads,
      convertedLeads,
      leadsByStatus
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
