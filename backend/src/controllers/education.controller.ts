import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

export async function getEducation(req: Request, res: Response): Promise<void> {
  try {
    const [rows]: [any[], any] = await pool.query(
      'SELECT * FROM education ORDER BY display_order ASC, start_year DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error: any) {
    logger.error('Error fetching education:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi truy vấn học vấn.' });
  }
}

export async function createEducation(req: Request, res: Response): Promise<void> {
  const { institution, degree, major, start_year, end_year, gpa, description, display_order } = req.body;

  if (!institution || !degree || !major || !start_year) {
    res.status(400).json({ success: false, message: 'Trường học, văn bằng, chuyên ngành và năm bắt đầu là bắt buộc.' });
    return;
  }

  try {
    const [result]: [any, any] = await pool.query(
      `INSERT INTO education (institution, degree, major, start_year, end_year, gpa, description, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        institution,
        degree,
        major,
        start_year,
        end_year || 'Hiện tại',
        gpa || '',
        description || '',
        Number(display_order) || 0,
      ]
    );

    logger.info(`Education added: "${institution}" (ID: ${result.insertId})`);
    res.status(201).json({
      success: true,
      message: 'Thêm mục học vấn thành công.',
      data: { id: result.insertId },
    });
  } catch (error: any) {
    logger.error('Error creating education:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi thêm học vấn.' });
  }
}

export async function updateEducation(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { institution, degree, major, start_year, end_year, gpa, description, display_order } = req.body;

  if (!institution || !degree || !major || !start_year) {
    res.status(400).json({ success: false, message: 'Trường học, văn bằng, chuyên ngành và năm bắt đầu là bắt buộc.' });
    return;
  }

  try {
    const [result]: [any, any] = await pool.query(
      `UPDATE education SET
        institution = ?, degree = ?, major = ?, start_year = ?, end_year = ?,
        gpa = ?, description = ?, display_order = ?
       WHERE id = ?`,
      [
        institution,
        degree,
        major,
        start_year,
        end_year || 'Hiện tại',
        gpa || '',
        description || '',
        Number(display_order) || 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Không tìm thấy mục học vấn để cập nhật.' });
      return;
    }

    logger.info(`Education updated: ID ${id}`);
    res.json({ success: true, message: 'Cập nhật học vấn thành công.' });
  } catch (error: any) {
    logger.error('Error updating education:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi cập nhật học vấn.' });
  }
}

export async function deleteEducation(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const [result]: [any, any] = await pool.query('DELETE FROM education WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ success: false, message: 'Không tìm thấy mục học vấn để xóa.' });
      return;
    }

    logger.info(`Education deleted: ID ${id}`);
    res.json({ success: true, message: 'Xóa mục học vấn thành công.' });
  } catch (error: any) {
    logger.error('Error deleting education:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi xóa học vấn.' });
  }
}
