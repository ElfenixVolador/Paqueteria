// server/controllers/auth.controller.js
import * as AuthService from '../services/auth.service.js';

export async function register(req, res) {
  try {
    const result = await AuthService.registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err.code === 'USER_EXISTS') {
      return res.status(409).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
}

export async function login(req, res) {
  try {
    const result = await AuthService.loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    if (err.code === 'USER_NOT_FOUND') {
      return res.status(404).json({ message: err.message });
    }
    if (err.code === 'WRONG_PASSWORD') {
      return res.status(401).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
}

export async function me(req, res) {
  try {
    const user = await AuthService.getUserById(req.userId);
    res.status(200).json({ user });
  } catch (err) {
    if (err.code === 'USER_NOT_FOUND') {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
}
