import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

export async function getStats(req: Request, res: Response): Promise<void> {
  try {
    const [[projectCount]]: [any[], any] = await pool.query('SELECT COUNT(*) as count FROM projects');
    const [[skillCount]]: [any[], any] = await pool.query('SELECT COUNT(*) as count FROM skills');
    const [[educationCount]]: [any[], any] = await pool.query('SELECT COUNT(*) as count FROM education');
    const [[achievementCount]]: [any[], any] = await pool.query('SELECT COUNT(*) as count FROM achievements');
    const [[messageCount]]: [any[], any] = await pool.query('SELECT COUNT(*) as count FROM contact_messages');
    const [[unreadMessageCount]]: [any[], any] = await pool.query('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0');

    res.json({
      success: true,
      data: {
        totalProjects: projectCount.count,
        totalSkills: skillCount.count,
        totalEducation: educationCount.count,
        totalAchievements: achievementCount.count,
        totalMessages: messageCount.count,
        unreadMessages: unreadMessageCount.count,
        systemStatus: 'Healthy',
        dbEngine: 'MySQL 8.0 InnoDB',
        serverUptime: Math.floor(process.uptime()),
      },
    });
  } catch (error: any) {
    logger.error('Error fetching admin stats:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi truy vấn dữ liệu thống kê.' });
  }
}
