import base64
from PIL import Image
import io

# 读取用户上传的图片（这里使用一个示例URL，实际应该读取上传的图片）
# 由于无法直接读取上传的图片，我将创建一个示例

# 创建一个示例日落图片
img = Image.new('RGB', (1080, 1920), color='#FF6B35')

# 保存为字节
buffer = io.BytesIO()
img.save(buffer, format='JPEG')
img_str = base64.b64encode(buffer.getvalue()).decode()

print(f"data:image/jpeg;base64,{img_str[:100]}...")
print(f"\n完整base64长度: {len(img_str)} 字符")
