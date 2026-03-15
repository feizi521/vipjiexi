// Cloudflare Workers 后台管理系统
// 用于动态管理工具配置

// 工具配置数据
let toolsConfig = {
  vip: {
    icon: '🎬',
    title: 'VIP视频解析',
    description: '支持爱奇艺、优酷、腾讯等VIP视频解析'
  },
  m3u8: {
    icon: '📹',
    title: 'm3u8视频提取',
    description: '提取在线视频的m3u8地址，方便下载和播放'
  },
  aoxing: {
    icon: '🧰',
    title: '傲星工具箱',
    description: '多功能在线工具箱，包含Base64、URL编码解码等功能'
  }
};

// 处理请求
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  
  // CORS 头部
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  
  // 处理 OPTIONS 请求
  if (method === 'OPTIONS') {
    return new Response('', { headers });
  }
  
  // 处理 API 请求
  if (path.startsWith('/api/')) {
    // 简单的认证（实际生产环境应该使用更安全的认证方式）
    const auth = request.headers.get('Authorization');
    if (!auth || auth !== 'Bearer admin123') {
      return new Response('Unauthorized', {
        status: 401,
        headers
      });
    }
    
    // 工具管理 API
    if (path === '/api/tools') {
      switch (method) {
        case 'GET':
          // 获取所有工具
          return new Response(JSON.stringify(toolsConfig), {
            headers: { ...headers, 'Content-Type': 'application/json' }
          });
          
        case 'POST':
          // 添加新工具
          try {
            const body = await request.json();
            const toolId = body.id;
            if (!toolId) {
              return new Response('Missing tool ID', {
                status: 400,
                headers
              });
            }
            toolsConfig[toolId] = {
              icon: body.icon || '📦',
              title: body.title || '新工具',
              description: body.description || '工具描述'
            };
            return new Response(JSON.stringify({ success: true, tool: toolsConfig[toolId] }), {
              headers: { ...headers, 'Content-Type': 'application/json' }
            });
          } catch (error) {
            return new Response('Invalid JSON', {
              status: 400,
              headers
            });
          }
          
        case 'PUT':
          // 更新工具
          try {
            const body = await request.json();
            const toolId = body.id;
            if (!toolId || !toolsConfig[toolId]) {
              return new Response('Tool not found', {
                status: 404,
                headers
              });
            }
            toolsConfig[toolId] = {
              ...toolsConfig[toolId],
              icon: body.icon || toolsConfig[toolId].icon,
              title: body.title || toolsConfig[toolId].title,
              description: body.description || toolsConfig[toolId].description
            };
            return new Response(JSON.stringify({ success: true, tool: toolsConfig[toolId] }), {
              headers: { ...headers, 'Content-Type': 'application/json' }
            });
          } catch (error) {
            return new Response('Invalid JSON', {
              status: 400,
              headers
            });
          }
          
        case 'DELETE':
          // 删除工具
          try {
            const body = await request.json();
            const toolId = body.id;
            if (!toolId || !toolsConfig[toolId]) {
              return new Response('Tool not found', {
                status: 404,
                headers
              });
            }
            delete toolsConfig[toolId];
            return new Response(JSON.stringify({ success: true }), {
              headers: { ...headers, 'Content-Type': 'application/json' }
            });
          } catch (error) {
            return new Response('Invalid JSON', {
              status: 400,
              headers
            });
          }
          
        default:
          return new Response('Method not allowed', {
            status: 405,
            headers
          });
      }
    }
  }
  
  // 处理其他请求
  return new Response('Not found', {
    status: 404,
    headers
  });
}