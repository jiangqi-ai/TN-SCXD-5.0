// 清理浏览器存储脚本
// 在浏览器控制台中运行此脚本来清理Supabase存储

console.log('🧹 开始清理浏览器存储...');

// 清理所有Supabase相关的localStorage项
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.includes('supabase')) {
    keysToRemove.push(key);
  }
}

keysToRemove.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ 已清理: ${key}`);
});

// 清理sessionStorage
const sessionKeysToRemove = [];
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  if (key && key.includes('supabase')) {
    sessionKeysToRemove.push(key);
  }
}

sessionKeysToRemove.forEach(key => {
  sessionStorage.removeItem(key);
  console.log(`✅ 已清理会话存储: ${key}`);
});

console.log(`🎉 清理完成！共清理了 ${keysToRemove.length + sessionKeysToRemove.length} 个存储项`);
console.log('💡 请刷新页面以使更改生效');

// 提供一键清理函数
window.clearSupabaseStorage = function() {
  localStorage.clear();
  sessionStorage.clear();
  console.log('🧹 已清理所有浏览器存储');
  window.location.reload();
} 