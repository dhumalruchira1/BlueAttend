import Notification from '../models/Notification.js';

export const myNotifications = async (req, res, next) => {
  try {
    const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ notifications: items });
  } catch (e) { next(e); }
};

export const markRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { read: true });
    res.json({ ok: true });
  } catch (e) { next(e); }
};