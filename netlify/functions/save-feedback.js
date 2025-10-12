const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const feedback = JSON.parse(event.body);
    
    // 确保数据目录存在
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    // 读取现有反馈
    const dataPath = path.join(dataDir, 'feedback.json');
    let feedbacks = [];
    
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      feedbacks = JSON.parse(data);
    }
    
    // 添加新反馈
    feedbacks.push(feedback);
    
    // 保存反馈
    fs.writeFileSync(dataPath, JSON.stringify(feedbacks, null, 2));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '保存反馈失败' })
    };
  }
};