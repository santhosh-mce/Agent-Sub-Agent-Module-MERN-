const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const csv = require('csv-parse');
const auth = require('../middleware/auth');
const Item = require('../models/Item');
const SubAgent = require('../models/SubAgent');
const { distributeItems } = require('../utils/distribute');

const upload = multer({ dest: 'tmp/' });

router.post('/', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ msg: 'File required' });
  const ext = path.extname(req.file.originalname).toLowerCase();
  let rows = [];

  // parse CSV
  const parseCsv = (buffer) =>
    new Promise((resolve, reject) => {
      csv.parse(buffer, { columns: true, trim: true }, (err, records) => err ? reject(err) : resolve(records));
    });

  if (ext === '.csv') {
    rows = await parseCsv(fs.readFileSync(req.file.path));
  } else if (['.xlsx', '.xls'].includes(ext)) {
    const wb = xlsx.readFile(req.file.path);
    rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
  }

  // Normalize and validate
  const itemsData = rows.map(r => ({
    firstName: r.FirstName || r.firstName || '',
    phone: r.Phone || r.phone || '',
    notes: r.Notes || r.notes || ''
  }));

  for (const [i, r] of itemsData.entries()) {
    if (!r.firstName || !r.phone) return res.status(400).json({ msg: `Row ${i+1} missing required fields` });
  }

  const subAgents = await SubAgent.find({ active: true }).limit(5);
  if (!subAgents.length) return res.status(400).json({ msg: 'Add active subagents first' });

  const items = await Promise.all(itemsData.map(d => new Item(d).save()));
  const mapping = distributeItems(items, subAgents);

  // Update assignedTo
  for (const agentId in mapping) {
    for (const it of mapping[agentId]) await Item.findByIdAndUpdate(it._id, { assignedTo: agentId });
  }

  fs.unlinkSync(req.file.path);
  res.json({ distribution: mapping });
});

router.get('/lists', auth, async (req, res) => {
  const items = await Item.find().populate('assignedTo', 'name email phone');
  res.json(items);
});

// DELETE single item by ID
router.delete('/lists/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Item not found' });

    await Item.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// DELETE all items
router.delete('/lists', auth, async (req, res) => {
  try {
    await Item.deleteMany({});
    res.json({ msg: 'All items deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
