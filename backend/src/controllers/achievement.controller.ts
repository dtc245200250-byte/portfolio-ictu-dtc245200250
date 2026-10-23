import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

export async function getAchievements(req: Request, res: Response): Promise<void> {
  try {
    const [rows]: [any[], any] = await pool.query(
      'SELECT * FROM achievements ORDER BY display_order ASC, created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error: any) {
    logger.error('Error fetching achievements:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi truy vấn thành tích.' });
  }
}

export async function createAchievement(req: Request, res: Response): Promise<void> {
  const { title, issuer, date_achieved, description, credential_url, display_order } = req.body;

  if (!title || !issuer || !date_achieved) {
    res.status(400).json({ success: false, message: 'Tiêu đề, đơn vị cấp và ngày đạt được là bắt buộc.' });
    return;
  }

  try {
    const [result]: [any, any] = await pool.query(
      `INSERT INTO achievements (title, issuer, date_achieved, description, credential_url, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        issuer,
        date_achieved,
        description || '',
        credential_url || '',
        Number(display_order) || 0,
      ]
    );

    logger.info(`Achievement created: "${title}" (ID: ${result.insertId})`);
    res.status(201).json({
      success: true,
      message: 'Thêm thành tích thành công.',
      data: { id: result.insertId },
    });
  } catch (error: any) {
    logger.error('Error creating achievement:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi thêm thành tích.' });
  }
}

export async function updateAchievement(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, issuer, date_achieved, description, credential_url, display_order } = req.body;

  if (!title || !issuer || !date_achieved) {
    res.status(400).json({ success: false, message: 'Tiêu đề, đơn vị cấp và ngày đạt được là bắt buộc.' });
    return;
  }

  try {
    const [result]: [any, any] = await pool.query(
      `UPDATE achievements SET
        title = ?, issuer = ?, date_achieved = ?, description = ?, credential_url = ?, display_order = ?
       WHERE id = ?`,
      [
        title,
        issuer,
        date_achieved,
        description || '',
        credential_url || '',
        Number(display_order) || 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Không tìm thấy thành tích để cập nhật.' });
      return;
    }

    logger.info(`Achievement updated: ID ${id}`);
    res.json({ success: true, message: 'Cập nhật thành tích thành công.' });
  } catch (error: any) {
    logger.error('Error updating achievement:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi cập nhật thành tích.' });
  }
}

export async function deleteAchievement(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const [result]: [any, any] = await pool.query('DELETE FROM achievements WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Không tìm thấy thành tích để xóa.' });
      return;
    }

    logger.info(`Achievement deleted: ID ${id}`);
    res.json({ success: true, message: 'Xóa thành tích thành công.' });
  } catch (error: any) {
    logger.error('Error deleting achievement:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi xóa thành tích.' });
  }
}
