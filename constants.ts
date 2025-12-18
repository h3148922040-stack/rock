
import { GearConfig } from './types';

export const GEAR_CONFIGS: GearConfig[] = [
  {
    id: 'second-gear',
    name: '秒钟齿轮',
    teeth: 60,
    radius: 40,
    color: '#ef4444', // red-500
    speedRatio: 1,
    position: { x: 0, y: 0 },
    label: '秒轮',
    description: '这是转得最快的齿轮，它带着秒针每分钟转一整圈。'
  },
  {
    id: 'minute-gear',
    name: '分钟齿轮',
    teeth: 60,
    radius: 80,
    color: '#3b82f6', // blue-500
    speedRatio: 1 / 60,
    position: { x: 0, y: 0 },
    label: '分轮',
    description: '秒轮每转60圈，这个蓝色的分轮才转1圈。它是分针的好伙伴。'
  },
  {
    id: 'hour-gear',
    name: '时钟齿轮',
    teeth: 72,
    radius: 120,
    color: '#10b981', // emerald-500
    speedRatio: 1 / (60 * 12),
    position: { x: 0, y: 0 },
    label: '时轮',
    description: '它是最沉稳的齿轮，走得最慢，负责告诉我们现在是几点。'
  },
  {
    id: 'escape-gear',
    name: '擒纵轮',
    teeth: 15,
    radius: 30,
    color: '#f59e0b', // amber-500
    speedRatio: 2,
    position: { x: 100, y: -60 },
    label: '心脏',
    description: '就像时钟的心跳，它控制着能量一点一点释放，发出“滴答”声。'
  }
];
