import { createClient, SupabaseClient } from '@supabase/supabase-js'

interface DatabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
  connectionPool?: number
  timeout?: number
}

interface ConfigManager {
  config: DatabaseConfig | null
  client: SupabaseClient | null
  initialized: boolean
}

class SupabaseConfigManager {
  private static instance: ConfigManager = {
    config: null,
    client: null,
    initialized: false
  }

  // 获取默认配置（从环境变量）
  private static getDefaultConfig(): DatabaseConfig | null {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url || !anonKey) {
      return null
    }

    return {
      url,
      anonKey,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      connectionPool: 10,
      timeout: 30
    }
  }

  // 从数据库加载配置
  static async loadConfigFromDatabase(): Promise<DatabaseConfig | null> {
    try {
      // 首先使用默认配置连接数据库
      const defaultConfig = this.getDefaultConfig()
      if (!defaultConfig) {
        console.warn('No default config available, cannot load from database')
        return null
      }

      const client = createClient(defaultConfig.url, defaultConfig.anonKey)
      
      // 查询数据库中的配置
      const { data: settings, error } = await client
        .from('settings')
        .select('key, value')
        .in('key', ['db_url', 'db_anon_key', 'db_service_key', 'db_connection_pool', 'db_timeout'])

      if (error) {
        console.warn('Failed to load config from database:', error)
        return defaultConfig
      }

      if (!settings || settings.length === 0) {
        console.log('No database config found, using default')
        return defaultConfig
      }

      // 构建配置对象
      const dbConfig: Partial<DatabaseConfig> = {}
      settings.forEach(setting => {
        switch (setting.key) {
          case 'db_url':
            dbConfig.url = setting.value
            break
          case 'db_anon_key':
            dbConfig.anonKey = setting.value
            break
          case 'db_service_key':
            dbConfig.serviceRoleKey = setting.value
            break
          case 'db_connection_pool':
            dbConfig.connectionPool = parseInt(setting.value) || 10
            break
          case 'db_timeout':
            dbConfig.timeout = parseInt(setting.value) || 30
            break
        }
      })

      // 确保必要的字段存在
      const finalConfig: DatabaseConfig = {
        url: dbConfig.url || defaultConfig.url,
        anonKey: dbConfig.anonKey || defaultConfig.anonKey,
        serviceRoleKey: dbConfig.serviceRoleKey || defaultConfig.serviceRoleKey,
        connectionPool: dbConfig.connectionPool || 10,
        timeout: dbConfig.timeout || 30
      }

      console.log('Loaded config from database successfully')
      return finalConfig

    } catch (error) {
      console.error('Error loading config from database:', error)
      return this.getDefaultConfig()
    }
  }

  // 初始化配置
  static async initialize(): Promise<SupabaseClient | null> {
    if (this.instance.initialized && this.instance.client) {
      return this.instance.client
    }

    try {
      // 尝试从数据库加载配置
      let config = await this.loadConfigFromDatabase()
      
      // 如果没有数据库配置，使用默认配置
      if (!config) {
        config = this.getDefaultConfig()
      }

      if (!config) {
        console.error('No valid Supabase configuration found')
        return null
      }

      // 创建客户端
      const client = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        db: {
          schema: 'public'
        }
      })

      this.instance.config = config
      this.instance.client = client
      this.instance.initialized = true

      console.log('Supabase client initialized successfully')
      return client

    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      return null
    }
  }

  // 获取当前客户端
  static getClient(): SupabaseClient | null {
    return this.instance.client
  }

  // 获取当前配置
  static getConfig(): DatabaseConfig | null {
    return this.instance.config
  }

  // 重新加载配置
  static async reloadConfig(): Promise<SupabaseClient | null> {
    this.instance.initialized = false
    this.instance.client = null
    this.instance.config = null
    
    return await this.initialize()
  }

  // 更新配置（用于管理后台）
  static async updateConfig(newConfig: Partial<DatabaseConfig>): Promise<boolean> {
    try {
      const client = this.getClient()
      if (!client) {
        throw new Error('No client available for config update')
      }

      const updates: any[] = []
      if (newConfig.url) {
        updates.push({ key: 'db_url', value: newConfig.url, category: 'database', is_public: false })
      }
      if (newConfig.anonKey) {
        updates.push({ key: 'db_anon_key', value: newConfig.anonKey, category: 'database', is_public: false })
      }
      if (newConfig.serviceRoleKey) {
        updates.push({ key: 'db_service_key', value: newConfig.serviceRoleKey, category: 'database', is_public: false })
      }
      if (newConfig.connectionPool !== undefined) {
        updates.push({ key: 'db_connection_pool', value: newConfig.connectionPool.toString(), category: 'database', is_public: false })
      }
      if (newConfig.timeout !== undefined) {
        updates.push({ key: 'db_timeout', value: newConfig.timeout.toString(), category: 'database', is_public: false })
      }

      // 批量更新设置
      for (const update of updates) {
        const { error } = await client
          .from('settings')
          .upsert(update, { onConflict: 'key' })
        
        if (error) {
          throw error
        }
      }

      // 重新加载配置
      await this.reloadConfig()
      
      console.log('Database config updated successfully')
      return true

    } catch (error) {
      console.error('Failed to update database config:', error)
      return false
    }
  }

  // 检查数据库连接状态
  static async checkConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      const client = this.getClient()
      if (!client) {
        return { connected: false, error: 'No client available' }
      }

      const { data, error } = await client
        .from('settings')
        .select('count')
        .limit(1)

      if (error) {
        return { connected: false, error: error.message }
      }

      return { connected: true }

    } catch (error: any) {
      return { connected: false, error: error.message }
    }
  }
}

export default SupabaseConfigManager
export type { DatabaseConfig } 