import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

export async function getProjects(req: Request, res: Response): Promise<void> {
  try {
    const [rows]: [any[], any] = await pool.query(
      'SELECT * FROM projects ORDER BY display_order ASC, created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error: any) {
    logger.error('Error fetching projects:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi truy vấn danh sách dự án.' });
  }
}

export async function createProject(req: Request, res: Response): Promise<void> {
  const { title, description, technologies, github_url, live_url, thumbnail_url, featured, display_order } = req.body;

  if (!title || !description || !technologies) {
    res.status(400).json({ success: false, message: 'Tiêu đề, mô tả và công nghệ không được để trống.' });
    return;
  }

  try {
    const [result]: [any, any] = await pool.query(
      `INSERT INTO projects (title, description, technologies, github_url, live_url, thumbnail_url, featured, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        technologies,
        github_url || '',
        live_url || '',
        thumbnail_url || '',
        featured ? 1 : 0,
        Number(display_order) || 0,
      ]
    );

    logger.info(`Project created: "${title}" (ID: ${result.insertId})`);
    res.status(201).json({
      success: true,
      message: 'Thêm dự án mới thành công.',
      data: { id: result.insertId },
    });
  } catch (error: any) {
    logger.error('Error creating project:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi thêm dự án mới.' });
  }
}

export async function updateProject(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { title, description, technologies, github_url, live_url, thumbnail_url, featured, display_order } = req.body;

  if (!title || !description || !technologies) {
    res.status(400).json({ success: false, message: 'Tiêu đề, mô tả và công nghệ không được để trống.' });
    return;
  }

  try {
    const [result]: [any, any] = await pool.query(
      `UPDATE projects SET
        title = ?, description = ?, technologies = ?, github_url = ?, live_url = ?,
        thumbnail_url = ?, featured = ?, display_order = ?
       WHERE id = ?`,
      [
        title,
        description,
        technologies,
        github_url || '',
        live_url || '',
        thumbnail_url || '',
        featured ? 1 : 0,
        Number(display_order) || 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Không tìm thấy dự án để cập nhật.' });
      return;
    }

    logger.info(`Project updated: ID ${id}`);
    res.json({ success: true, message: 'Cập nhật dự án thành công.' });
  } catch (error: any) {
    logger.error('Error updating project:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi cập nhật dự án.' });
  }
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const [result]: [any, any] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Không tìm thấy dự án để xóa.' });
      return;
    }

    logger.info(`Project deleted: ID ${id}`);
    res.json({ success: true, message: 'Xóa dự án thành công.' });
  } catch (error: any) {
    logger.error('Error deleting project:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi khi xóa dự án.' });
  }
}
