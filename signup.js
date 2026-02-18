import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

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

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent   = msg;
  el.style.display = 'block';
}

function hideError() {
  document.getElementById('error-msg').style.display = 'none';
}

async function doSignup() {
  hideError();

  const username = document.getElementById('username').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm  = document.getElementById('confirm').value;

  // 유효성 검사
  if (!/^[a-zA-Z0-9_]{4,20}$/.test(username)) {
    showError('아이디: 4~20자, 영문/숫자/_ 만 허용됩니다.'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('올바른 이메일 형식이 아닙니다.'); return;
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
    showError('비밀번호: 8자 이상, 영문+숫자를 포함해야 합니다.'); return;
  }
  if (password !== confirm) {
    showError('비밀번호가 일치하지 않습니다.'); return;
  }

  // 아이디 중복 확인
  const q        = query(collection(db, 'users'), where('username', '==', username));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    showError('이미 사용 중인 아이디입니다.'); return;
  }

  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    await updateProfile(user, { displayName: username });

    await setDoc(doc(db, 'users', user.uid), {
      uid:       user.uid,
      username:  username,
      email:     email,
      createdAt: serverTimestamp()
    });

    alert('회원가입이 완료되었습니다!');
    window.location.href = 'login.html';

  } catch (err) {
    const messages = {
      'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
      'auth/invalid-email':        '유효하지 않은 이메일입니다.',
      'auth/weak-password':        '비밀번호가 너무 약합니다.'
    };
    showError(messages[err.code] || '오류가 발생했습니다: ' + err.message);
  }
}

function clearForm() {
  document.getElementById('username').value = '';
  document.getElementById('email').value    = '';
  document.getElementById('password').value = '';
  document.getElementById('confirm').value  = '';
  hideError();
  document.getElementById('username').focus();
}

window.doSignup  = doSignup;
window.clearForm = clearForm;