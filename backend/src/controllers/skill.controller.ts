import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

export async function getSkills(req: Request, res: Response): Promise<void> {
  try {
    const [rows]: [any[], any] = await pool.query(
      'SELECT * FROM skills ORDER BY category ASC, display_order ASC, name ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error: any) {
    logger.error('Error fetching skills:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi truy vấn kỹ năng.' });
  }
}

export async function createSkill(req: Request, res: Response): Promise<void> {
  const { category, name, proficiency, icon, display_order } = req.body;

  if (!category || !name) {
    res.status(400).json({ success: false, message: 'Danh mục và tên kỹ năng không được để trống.' });
    return;
  }

  try {
    const [result]: [any, any] = await pool.query(
      'INSERT INTO skills (category, name, proficiency, icon, display_order) VALUES (?, ?, ?, ?, ?)',
      [
        category,
        name,
        Math.min(100, Math.max(1, Number(proficiency) || 80)),
        icon || 'code',
        Number(display_order) || 0,
      ]
    );

    logger.info(`Skill created: "${name}" (ID: ${result.insertId})`);
    res.status(201).json({
      success: true,
      message: 'Thêm kỹ năng thành công.',
      data: { id: result.insertId },
    });
  } catch (error: any) {
    logger.error('Error creating skill:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi thêm kỹ năng.' });
  }
}

export async function updateSkill(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { category, name, proficiency, icon, display_order } = req.body;

  if (!category || !name) {
    res.status(400).json({ success: false, message: 'Danh mục và tên kỹ năng không được để trống.' });
    return;
  }

  try {
    const [result]: [any, any] = await pool.query(
      `UPDATE skills SET
        category = ?, name = ?, proficiency = ?, icon = ?, display_order = ?
       WHERE id = ?`,
      [
        category,
        name,
        Math.min(100, Math.max(1, Number(proficiency) || 80)),
        icon || 'code',
        Number(display_order) || 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Không tìm thấy kỹ năng để cập nhật.' });
      return;
    }

    logger.info(`Skill updated: ID ${id}`);
    res.json({ success: true, message: 'Cập nhật kỹ năng thành công.' });
  } catch (error: any) {
    logger.error('Error updating skill:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi cập nhật kỹ năng.' });
  }
}

export async function deleteSkill(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const [result]: [any, any] = await pool.query('DELETE FROM skills WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Không tìm thấy kỹ năng để xóa.' });
      return;
    }

    logger.info(`Skill deleted: ID ${id}`);
    res.json({ success: true, message: 'Xóa kỹ năng thành công.' });
  } catch (error: any) {
    logger.error('Error deleting skill:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi xóa kỹ năng.' });
  }
}
