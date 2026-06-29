import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const DINGTALK_TOKEN = process.env.DINGTALK_TOKEN || '';
const DINGTALK_AES_KEY = process.env.DINGTALK_AES_KEY || '';
const DINGTALK_CLIENT_ID = process.env.DINGTALK_CLIENT_ID || '';
const DINGTALK_CLIENT_SECRET = process.env.DINGTALK_CLIENT_SECRET || '';

function decryptMsg(encrypt: string): string {
  const aesKey = CryptoJS.enc.Base64.parse(DINGTALK_AES_KEY + '=');
  const iv = aesKey.clone().words.slice(0, 4);
  const ivHex = CryptoJS.lib.WordArray.create(iv);
  
  const decryptResult = CryptoJS.AES.decrypt(encrypt, aesKey, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  const decrypted = decryptResult.toString(CryptoJS.enc.Utf8);
  return decrypted;
}

function encryptMsg(text: string): string {
  const aesKey = CryptoJS.enc.Base64.parse(DINGTALK_AES_KEY + '=');
  const iv = aesKey.clone().words.slice(0, 4);
  const ivHex = CryptoJS.lib.WordArray.create(iv);
  
  const srcs = CryptoJS.enc.Utf8.parse(text);
  const encrypted = CryptoJS.AES.encrypt(srcs, aesKey, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return encrypted.toString();
}

function computeSignature(token: string, timestamp: string, nonce: string, encrypt: string): string {
  const arr = [token, timestamp, nonce, encrypt].sort();
  const str = arr.join('');
  const hash = CryptoJS.SHA1(str);
  return hash.toString();
}

function verifySignature(token: string, timestamp: string, nonce: string, encrypt: string, msgSignature: string): boolean {
  const computed = computeSignature(token, timestamp, nonce, encrypt);
  return computed === msgSignature;
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

async function sendMessage(chatId: string, text: string): Promise<void> {
  const accessToken = await getAccessToken();
  const url = 'https://api.dingtalk.com/v1.0/robot/groupMessages/send';
  
  const payload = {
    chatId: chatId,
    msgType: 'text',
    text: {
      content: text
    }
  };
  
  try {
    await axios.post(url, payload, {
      headers: { 
        'Content-Type': 'application/json',
        'x-acs-dingtalk-access-token': accessToken
      }
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'GET') {
    const { msg_signature, timestamp, nonce, encrypt } = req.query;
    
    if (!encrypt) {
      return res.status(200).send('');
    }
    
    const isVerified = verifySignature(
      DINGTALK_TOKEN,
      String(timestamp),
      String(nonce),
      String(encrypt),
      String(msg_signature)
    );
    
    if (!isVerified) {
      console.error('签名验证失败');
      return res.status(200).send('');
    }
    
    try {
      const decrypted = decryptMsg(String(encrypt));
      const xmlMatch = decrypted.match(/<content>(.*?)<\/content>/);
      const challenge = xmlMatch ? xmlMatch[1] : '';
      
      const encryptedReply = encryptMsg(challenge);
      const replySignature = computeSignature(
        DINGTALK_TOKEN,
        String(timestamp),
        String(nonce),
        encryptedReply
      );
      
      return res.status(200).json({
        encrypt: encryptedReply,
        msg_signature: replySignature,
        timestamp: timestamp,
        nonce: nonce
      });
    } catch (error) {
      console.error('解密失败:', error);
      return res.status(200).send('');
    }
  } else if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { msg_signature, timestamp, nonce, encrypt } = body;
    
    if (!encrypt || !msg_signature) {
      return res.status(200).json({
        encrypt: '',
        msg_signature: '',
        timestamp: '',
        nonce: ''
      });
    }
    
    const isVerified = verifySignature(
      DINGTALK_TOKEN,
      String(timestamp),
      String(nonce),
      String(encrypt),
      String(msg_signature)
    );
    
    if (!isVerified) {
      console.error('签名验证失败');
      return res.status(200).json({
        encrypt: '',
        msg_signature: '',
        timestamp: '',
        nonce: ''
      });
    }
    
    try {
      const decrypted = decryptMsg(String(encrypt));
      console.log('收到钉钉消息:', decrypted);
      
      const jsonMatch = decrypted.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const messageData = JSON.parse(jsonMatch[0]);
        const { text, chatId, senderId, senderStaffId, sessionWebhook } = messageData;
        
        if (text && chatId && DINGTALK_CLIENT_ID && DINGTALK_CLIENT_SECRET) {
          const replyText = `收到消息: ${text.content || ''}\n发送者: ${senderStaffId || senderId}\n时间: ${new Date().toLocaleString()}`;
          await sendMessage(chatId, replyText);
        }
      }
      
      const encryptedReply = encryptMsg('success');
      const replySignature = computeSignature(
        DINGTALK_TOKEN,
        String(timestamp),
        String(nonce),
        encryptedReply
      );
      
      return res.status(200).json({
        encrypt: encryptedReply,
        msg_signature: replySignature,
        timestamp: timestamp,
        nonce: nonce
      });
    } catch (error) {
      console.error('处理消息失败:', error);
      return res.status(200).json({
        encrypt: '',
        msg_signature: '',
        timestamp: '',
        nonce: ''
      });
    }
  } else {
    return res.status(200).json({
      encrypt: '',
      msg_signature: '',
      timestamp: '',
      nonce: ''
    });
  }
}