import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const DINGTALK_TOKEN = process.env.DINGTALK_TOKEN || '';
const DINGTALK_AES_KEY = process.env.DINGTALK_AES_KEY || '';
const DINGTALK_CLIENT_ID = process.env.DINGTALK_CLIENT_ID || '';
const DINGTALK_CLIENT_SECRET = process.env.DINGTALK_CLIENT_SECRET || '';

function decryptAES(encrypt: string, aesKey: string): string {
  const key = CryptoJS.enc.Base64.parse(aesKey);
  const iv = key.clone().words.slice(0, 4);
  const ivHex = CryptoJS.lib.WordArray.create(iv);
  
  const decryptResult = CryptoJS.AES.decrypt(encrypt, key, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  const decrypted = decryptResult.toString(CryptoJS.enc.Utf8);
  const xmlMatch = decrypted.match(/<content>(.*?)<\/content>/);
  const textMatch = decrypted.match(/<Text>(.*?)<\/Text>/);
  
  if (xmlMatch) {
    return xmlMatch[1];
  } else if (textMatch) {
    return textMatch[1];
  }
  return decrypted;
}

function verifySignature(token: string, timestamp: string, nonce: string, encrypt: string): boolean {
  const arr = [token, timestamp, nonce, encrypt].sort();
  const str = arr.join('');
  const hash = CryptoJS.SHA1(str);
  return hash.toString() === encrypt;
}

async function getAccessToken(): Promise<string> {
  const url = 'https://api.dingtalk.com/v1.0/oauth2/accessToken';
  const params = new URLSearchParams({
    clientId: DINGTALK_CLIENT_ID,
    clientSecret: DINGTALK_CLIENT_SECRET
  });
  
  try {
    const response = await axios.post(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data.accessToken;
  } catch (error) {
    console.error('获取 accessToken 失败:', error);
    throw error;
  }
}

async function sendMessageToDingtalk(chatId: string, text: string): Promise<void> {
  const accessToken = await getAccessToken();
  const url = `https://api.dingtalk.com/v1.0/robot/groupMessages/send?access_token=${accessToken}`;
  
  const payload = {
    chatId: chatId,
    msgType: 'text',
    text: {
      content: text
    }
  };
  
  try {
    await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { msg_signature, timestamp, nonce, encrypt } = req.query;
    
    if (!msg_signature || !timestamp || !nonce || !encrypt) {
      return res.status(400).send('缺少参数');
    }
    
    const isVerified = verifySignature(
      DINGTALK_TOKEN,
      timestamp as string,
      nonce as string,
      msg_signature as string
    );
    
    if (!isVerified) {
      return res.status(401).send('签名验证失败');
    }
    
    const decrypted = decryptAES(encrypt as string, DINGTALK_AES_KEY);
    return res.status(200).json({
      msg_signature,
      timestamp,
      nonce,
      encrypt: decrypted
    });
  } else if (req.method === 'POST') {
    const { msg_signature, timestamp, nonce } = req.headers;
    const { encrypt } = req.body;
    
    if (!msg_signature || !timestamp || !nonce || !encrypt) {
      return res.status(400).send('缺少参数');
    }
    
    const isVerified = verifySignature(
      DINGTALK_TOKEN,
      timestamp as string,
      nonce as string,
      msg_signature as string
    );
    
    if (!isVerified) {
      return res.status(401).send('签名验证失败');
    }
    
    try {
      const decrypted = decryptAES(encrypt, DINGTALK_AES_KEY);
      console.log('收到钉钉消息:', decrypted);
      
      const messageData = JSON.parse(decrypted);
      const { text, chatId, senderId } = messageData;
      
      if (text && chatId) {
        const replyText = `收到消息: ${text.content}\n发送者: ${senderId}\n时间: ${new Date().toLocaleString()}`;
        await sendMessageToDingtalk(chatId, replyText);
      }
      
      return res.status(200).json({
        status: 'success',
        message: '消息处理成功',
        received: decrypted
      });
    } catch (error) {
      console.error('处理消息失败:', error);
      return res.status(500).json({
        status: 'error',
        message: '处理消息失败'
      });
    }
  } else {
    return res.status(405).send('不支持的请求方法');
  }
}