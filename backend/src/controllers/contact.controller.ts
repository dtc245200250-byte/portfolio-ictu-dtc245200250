import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

export async function submitContact(req: Request, res: Response): Promise<void> {
  const { sender_name, sender_email, subject, message } = req.body;

  if (!sender_name || !sender_email || !message) {
    res.status(400).json({ success: false, message: 'Họ tên, email và nội dung tin nhắn không được để trống.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sender_email)) {
    res.status(400).json({ success: false, message: 'Địa chỉ email không đúng định dạng.' });
    return;
  }

  try {
    const [result]: [any, any] = await pool.query(
      'INSERT INTO contact_messages (sender_name, sender_email, subject, message) VALUES (?, ?, ?, ?)',
      [sender_name.trim(), sender_email.trim(), (subject || 'Liên hệ từ Portfolio').trim(), message.trim()]
    );

    logger.info(`New contact message received from "${sender_name}" (${sender_email})`);
    res.status(201).json({
      success: true,
      message: 'Cảm ơn bạn! Tin nhắn liên hệ của bạn đã được gửi thành công.',
      data: { id: result.insertId },
    });
  } catch (error: any) {
    logger.error('Error submitting contact message:', { error: error.message });
    res.status(500).json({ success: false, message: 'Không thể gửi tin nhắn. Vui lòng thử lại sau.' });
  }
}

export async function getContactMessages(req: Request, res: Response): Promise<void> {
  try {
    const [rows]: [any[], any] = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error: any) {
    logger.error('Error fetching contact messages:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi truy vấn tin nhắn liên hệ.' });
  }
}

export async function markMessageRead(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { is_read } = req.body;

  try {
    const [result]: [any, any] = await pool.query(
      'UPDATE contact_messages SET is_read = ? WHERE id = ?',
      [is_read ? 1 : 0, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Không tìm thấy tin nhắn.' });
      return;
    }

    res.json({ success: true, message: 'Cập nhật trạng thái tin nhắn thành công.' });
  } catch (error: any) {
    logger.error('Error marking message read:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi cập nhật tin nhắn.' });
  }
}

export async function deleteContactMessage(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const [result]: [any, any] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Không tìm thấy tin nhắn để xóa.' });
      return;
    }

    logger.info(`Contact message deleted: ID ${id}`);
    res.json({ success: true, message: 'Xóa tin nhắn thành công.' });
  } catch (error: any) {
    logger.error('Error deleting contact message:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi khi xóa tin nhắn.' });
  }
}
