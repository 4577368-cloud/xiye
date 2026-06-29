import { DWClient, TOPIC_ROBOT, TOPIC_CARD } from 'dingtalk-stream';

const DINGTALK_CLIENT_ID = process.env.DINGTALK_CLIENT_ID || '';
const DINGTALK_CLIENT_SECRET = process.env.DINGTALK_CLIENT_SECRET || '';

const client = new DWClient({
  clientId: DINGTALK_CLIENT_ID,
  clientSecret: DINGTALK_CLIENT_SECRET,
});

client.registerCallbackListener(TOPIC_ROBOT, async (res) => {
  console.log('[钉钉机器人消息]', res.data);
  
  try {
    const { text, senderStaffId, sessionWebhook, chatId, senderId } = JSON.parse(res.data);
    
    const replyText = `收到消息: ${text?.content || ''}\n发送者ID: ${senderStaffId || senderId}\n时间: ${new Date().toLocaleString()}`;
    
    const accessToken = await client.getAccessToken();
    
    const body = {
      at: {
        atUserIds: [senderStaffId],
        isAtAll: false,
      },
      text: {
        content: replyText,
      },
      msgtype: 'text',
    };
    
    const result = await fetch(sessionWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-acs-dingtalk-access-token': accessToken,
      },
      body: JSON.stringify(body),
    });
    
    if (result.ok) {
      const responseData = await result.json();
      client.socketCallBackResponse(res.headers.messageId, responseData);
      console.log('[消息回复成功]', responseData);
    } else {
      console.error('[消息回复失败]', await result.text());
    }
  } catch (error) {
    console.error('[处理机器人消息失败]', error);
  }
});

client.registerCallbackListener(TOPIC_CARD, async (res) => {
  console.log('[卡片动作回调]', res.data);
  
  try {
    const cardData = JSON.parse(res.data);
    const { outTrackId, userId, content } = cardData;
    
    console.log(`卡片ID: ${outTrackId}, 用户ID: ${userId}, 内容: ${content}`);
    
    client.socketCallBackResponse(res.headers.messageId, {
      status: 'SUCCESS',
    });
  } catch (error) {
    console.error('[处理卡片动作失败]', error);
  }
});

client.on('connect', () => {
  console.log('[钉钉Stream] 连接成功');
});

client.on('close', () => {
  console.log('[钉钉Stream] 连接关闭');
});

client.on('error', (error) => {
  console.error('[钉钉Stream] 连接错误:', error);
});

export { client };

export async function startDingtalkStream() {
  console.log('[钉钉Stream] 正在连接...');
  await client.connect();
}

export async function stopDingtalkStream() {
  console.log('[钉钉Stream] 正在断开连接...');
  process.exit(0);
}