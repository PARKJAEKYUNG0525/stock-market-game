import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// 🔥 Firebase 설정
const firebaseConfig = {
  apiKey:            "AIzaSyBP0SC_o8i4yAk2MI7qYZRzMkYZyESG2ZU",
  authDomain:        "loginprojecrt.firebaseapp.com",
  projectId:         "loginprojecrt",
  storageBucket:     "loginprojecrt.firebasestorage.app",
  messagingSenderId: "550110304627",
  appId:             "1:550110304627:web:458c76fe59b4f7980f0d06",
  measurementId:     "G-WD247VJ9RK"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

async function doLogin() {
  const id       = document.getElementById('userId').value.trim();
  const pw       = document.getElementById('userPw').value;
  const errorMsg = document.getElementById('error-msg');

  if (!id || !pw) {
    errorMsg.textContent   = '아이디와 비밀번호를 입력해주세요.';
    errorMsg.style.display = 'block';
    return;
  }

  try {
    // 이메일 형식이면 차단
    if (id.includes('@')) {
      errorMsg.textContent   = '이메일이 아닌 아이디로 로그인해주세요.';
      errorMsg.style.display = 'block';
      return;
    }

    // Firestore에서 username으로 이메일 찾기
    const q = query(collection(db, 'users'), where('username', '==', id));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      errorMsg.textContent   = '존재하지 않는 아이디입니다.';
      errorMsg.style.display = 'block';
      return;
    }

    const email = snapshot.docs[0].data().email;

    // 이메일로 로그인
    await signInWithEmailAndPassword(auth, email, pw);
    errorMsg.style.display = 'none';
    window.location.href   = 'main.html';

  } catch (err) {
    errorMsg.style.display = 'block';
    document.getElementById('userPw').value = '';
    document.getElementById('userPw').focus();

    const messages = {
      'auth/invalid-credential': '아이디 또는 비밀번호가 잘못되었습니다.',
      'auth/user-not-found':     '존재하지 않는 계정입니다.',
      'auth/wrong-password':     '비밀번호가 올바르지 않습니다.',
      'auth/too-many-requests':  '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.'
    };
    errorMsg.textContent = messages[err.code] || '로그인 오류가 발생했습니다.';
  }
}

function handleEnter(event) {
  if (event.key === 'Enter') doLogin();
}

function clearForm() {
  document.getElementById('userId').value            = '';
  document.getElementById('userPw').value            = '';
  document.getElementById('error-msg').style.display = 'none';
  document.getElementById('userId').focus();
}

window.doLogin     = doLogin;
window.handleEnter = handleEnter;
window.clearForm   = clearForm;