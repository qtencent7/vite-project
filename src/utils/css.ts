// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 CSS 类名的工具函数
 * @param inputs 任意数量的类名参数
 * @returns 合并后的类名字符串
 * 
 * 特点：
 * 1. 可以处理多种类型的输入（字符串、对象、数组等）
 * 2. 自动处理 Tailwind 类名冲突
 * 3. 移除假值（false, null, undefined）
 * 4. 保持类名的优先级
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}