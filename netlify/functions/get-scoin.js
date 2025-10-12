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
        
        // 连接到FaunaDB
        const client = new faunadb.Client({
            secret: process.env.FAUNADB_SECRET
        });
        
        // 尝试获取用户记录
        try {
            const result = await client.query(
                q.Get(q.Match(q.Index('scoin_by_user_id'), userId))
            );
            
            return {
                statusCode: 200,
                body: JSON.stringify({
                    balance: result.data.balance,
                    lastClaimDate: result.data.lastClaimDate
                })
            };
        } catch (error) {
            // 如果记录不存在，创建新记录
            if (error.message === 'instance not found') {
                const initialBalance = isAdmin ? 114514 : 0;
                
                const newRecord = await client.query(
                    q.Create(q.Collection('scoin'), {
                        data: {
                            userId: userId,
                            balance: initialBalance,
                            lastClaimDate: null
                        }
                    })
                );
                
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        balance: newRecord.data.balance,
                        lastClaimDate: newRecord.data.lastClaimDate
                    })
                };
            }
            
            throw error;
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};