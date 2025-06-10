import { createSupabaseClient } from './supabase'

export interface AppSetting {
  key: string
  value: string
  data_type: 'string' | 'number' | 'boolean'
  is_public: boolean
}

// 缓存设置以减少数据库查询
let settingsCache: Record<string, AppSetting> = {}
let lastCacheUpdate: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

/**
 * 获取单个设置值
 */
export async function getSetting(key: string, defaultValue?: string): Promise<string | null> {
  try {
    const supabase = createSupabaseClient()
    
    // 检查缓存
    const now = Date.now()
    if (settingsCache[key] && (now - lastCacheUpdate) < CACHE_DURATION) {
      return settingsCache[key].value
    }

    const { data, error } = await supabase
      .from('settings')
      .select('key, value, data_type, is_public')
      .eq('key', key)
      .single()

    if (error || !data) {
      return defaultValue || null
    }

    // 更新缓存
    settingsCache[key] = data
    lastCacheUpdate = now

    return data.value
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error)
    return defaultValue || null
  }
}

/**
 * 获取布尔值设置
 */
export async function getBooleanSetting(key: string, defaultValue: boolean = false): Promise<boolean> {
  const value = await getSetting(key, defaultValue.toString())
  return value === 'true'
}

/**
 * 获取数字设置
 */
export async function getNumberSetting(key: string, defaultValue: number = 0): Promise<number> {
  const value = await getSetting(key, defaultValue.toString())
  return parseInt(value || '0', 10) || defaultValue
}

/**
 * 检查用户注册是否开启
 */
export async function isRegistrationEnabled(): Promise<boolean> {
  return await getBooleanSetting('allow_user_registration', true)
}

/**
 * 检查是否需要邮箱验证
 */
export async function isEmailVerificationRequired(): Promise<boolean> {
  return await getBooleanSetting('require_email_verification', false)
}

/**
 * 获取注册提示信息
 */
export async function getRegistrationMessage(): Promise<string> {
  return await getSetting('registration_message', '欢迎注册！') || '欢迎注册！'
}

/**
 * 获取每日最大注册用户数
 */
export async function getMaxUsersPerDay(): Promise<number> {
  return await getNumberSetting('max_users_per_day', 100)
}

/**
 * 获取公开设置（用于前端）
 */
export async function getPublicSettings(): Promise<Record<string, string>> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .eq('is_public', true)

    if (error || !data) {
      return {}
    }

    const settings: Record<string, string> = {}
    data.forEach(setting => {
      settings[setting.key] = setting.value
    })

    return settings
  } catch (error) {
    console.error('Error getting public settings:', error)
    return {}
  }
}

/**
 * 清除设置缓存
 */
export function clearSettingsCache(): void {
  settingsCache = {}
  lastCacheUpdate = 0
}

/**
 * 批量获取设置
 */
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', keys)

    if (error || !data) {
      return {}
    }

    const settings: Record<string, string> = {}
    data.forEach(setting => {
      settings[setting.key] = setting.value
    })

    return settings
  } catch (error) {
    console.error('Error getting settings:', error)
    return {}
  }
} 