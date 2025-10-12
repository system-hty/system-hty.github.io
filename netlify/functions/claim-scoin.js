const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event, context) => {
    try {
        // 验证用户
        const user = context.clientContext.user;
        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: '未授权访问' })
            };
        }
        
        const userId = user.sub;
        const isAdmin = user.email === '644043561@qq.com';
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        // 连接到FaunaDB
        const client = new faunadb.Client({
            secret: process.env.FAUNADB_SECRET
        });
        
        // 获取当前记录
        const record = await client.query(
            q.Get(q.Match(q.Index('scoin_by_user_id'), userId))
        );
        
        // 检查今天是否已经领取
        if (record.data.lastClaimDate === today) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: '今天已经领取过S币了' })
            };
        }
        
        // 计算要添加的S币数量
        const amountToAdd = isAdmin ? 114514 : 1;
        
        // 更新记录
        const updatedRecord = await client.query(
            q.Update(record.ref, {
                data: {
                    balance: record.data.balance + amountToAdd,
                    lastClaimDate: today
                }
            })
        );
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                balance: updatedRecord.data.balance,
                lastClaimDate: updatedRecord.data.lastClaimDate
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};