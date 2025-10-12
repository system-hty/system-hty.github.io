const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const comment = JSON.parse(event.body);
    
    // 确保数据目录存在
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    // 读取现有评论
    const dataPath = path.join(dataDir, 'comments.json');
    let comments = [];
    
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      comments = JSON.parse(data);
    }
    
    // 添加新评论
    comments.push(comment);
    
    // 保存评论
    fs.writeFileSync(dataPath, JSON.stringify(comments, null, 2));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '保存评论失败' })
    };
  }
};