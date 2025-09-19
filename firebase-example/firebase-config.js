// Firebase 配置和初始化
import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// Firebase 配置对象
const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'your-app-id',
}

// 初始化 Firebase
const app = initializeApp(firebaseConfig)

// 初始化 Firebase 服务
export const auth = getAuth(app)
export const db = getFirestore(app)

// 开发环境使用模拟器 (可选)
if (process.env.NODE_ENV === 'development') {
  // 注意：模拟器只在开发环境使用
  // connectAuthEmulator(auth, "http://localhost:9099")
  // connectFirestoreEmulator(db, 'localhost', 8080)
}

export default app
