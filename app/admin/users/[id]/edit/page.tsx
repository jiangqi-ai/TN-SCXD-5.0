'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User } from '@/types/database';
import { toast } from 'react-hot-toast';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';
  const [user, setUser] = useState<Partial<User>>({
    username: '',
    email: '',
    role: 'user',
    status: 'active',
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew) {
      fetchUser(params.id as string);
    }
  }, [isNew, params.id]);

  const fetchUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error('获取用户详情失败');
      }
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户详情失败');
      toast.error('获取用户详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(
        isNew ? '/api/users' : `/api/users/${params.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '保存用户失败');
      }

      toast.success(isNew ? '用户已创建' : '用户已更新');
      router.push('/admin/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存用户失败');
      toast.error(err instanceof Error ? err.message : '保存用户失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/users')}
          className="text-blue-600 hover:text-blue-900"
        >
          ← 返回用户列表
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {isNew ? '添加用户' : '编辑用户'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              用户名
            </label>
            <input
              type="text"
              id="username"
              value={user.username}
              onChange={(e) =>
                setUser({ ...user, username: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              邮箱
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              角色
            </label>
            <select
              id="role"
              value={user.role}
              onChange={(e) =>
                setUser({ ...user, role: e.target.value as 'admin' | 'user' })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              状态
            </label>
            <select
              id="status"
              value={user.status}
              onChange={(e) =>
                setUser({ ...user, status: e.target.value as 'active' | 'inactive' })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="active">激活</option>
              <option value="inactive">禁用</option>
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/users')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 