const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '..', 'data', 'projects.json');

function readProjects() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeProjects(projects) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

router.get('/', (req, res) => {
  try {
    const projects = readProjects();
    res.json(projects);
  } catch {
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const projects = readProjects();
    const newProject = {
      id: uuidv4(),
      title: req.body.title || '',
      description: req.body.description || '',
      imageUrl: req.body.imageUrl || '',
      tags: req.body.tags || [],
      githubUrl: req.body.githubUrl || '',
      liveUrl: req.body.liveUrl || '',
      category: req.body.category || '',
    };
    projects.push(newProject);
    writeProjects(projects);
    res.status(201).json(newProject);
  } catch {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const projects = readProjects();
    const idx = projects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });

    const updated = {
      ...projects[idx],
      title: req.body.title ?? projects[idx].title,
      description: req.body.description ?? projects[idx].description,
      imageUrl: req.body.imageUrl ?? projects[idx].imageUrl,
      tags: req.body.tags ?? projects[idx].tags,
      githubUrl: req.body.githubUrl ?? projects[idx].githubUrl,
      liveUrl: req.body.liveUrl ?? projects[idx].liveUrl,
      category: req.body.category ?? projects[idx].category,
    };
    projects[idx] = updated;
    writeProjects(projects);
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    let projects = readProjects();
    const idx = projects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });

    projects.splice(idx, 1);
    writeProjects(projects);
    res.json({ message: 'Project deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
