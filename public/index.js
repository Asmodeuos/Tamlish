
// login/signup

import { auth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "./firebase-config.js";

const loginpg = document.getElementById("loginpg");
const LIexitBtn = document.getElementById("LIexitBtn");
const SUexitBtn = document.getElementById("SUexitBtn");
const signinBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const signuppg = document.getElementById("signuppg");
const signUp = document.getElementById("signUp");
const login = document.getElementById("login");
const wrapper = document.getElementById("wrapper")
const signoutBtn = document.getElementById("signoutBtn")
const sign_in_email = loginpg.querySelector("input[type='email']");
const sign_in_password = loginpg.querySelector("input[type='password']");
const sign_up_email = signuppg.querySelector("input[type='email']");
const sign_up_password = signuppg.querySelector("input[type='password']");

// wrapper.addEventListener("click", (e) => {
//   if (e.target.id === "signinBtn"){
//     loginpg.style.display = "flex";
//   }
// });
const errorpage1 = document.getElementById("errorPage1")
const errorpage2 = document.getElementById("errorPage2")
signinBtn.addEventListener("click", () => {
    loginpg.style.display = "flex";
    errorpage1.textContent = ""
    errorpage2.textContent = ""
});

LIexitBtn.addEventListener("click", () => {
    loginpg.style.display = "none";
});

signupBtn.addEventListener("click", () => {
    loginpg.style.display = "none";
    signuppg.style.display = "flex";
});

SUexitBtn.addEventListener("click", () => {
    signuppg.style.display = "none";
});


signUp.addEventListener("click", () => {
  createUserWithEmailAndPassword(auth, sign_up_email.value, sign_up_password.value)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log("User created:", user.email);
    signuppg.style.display = "none"  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Registration error:", errorCode, errorMessage);
    errorpage2.textContent = errorMessage
  });
});

login.addEventListener("click", () => {
  signInWithEmailAndPassword(auth, sign_in_email.value, sign_in_password.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("User signed in:", user.email); 
    loginpg.style.display = "none" })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("Sign in error:", errorCode, errorMessage)
    errorpage1.textContent = errorMessage
  });
})


onAuthStateChanged(auth, (user) => {
  if (user !== null) {
    let displayName;
    user.providerData.forEach((profile) => {
    const providerId = profile.providerId;
    console.log("Provider ID:", providerId);

    if (providerId === "password") {
      displayName = user.email.split("@")[0];
      console.log("Display name from email:", displayName);
    } 
    else if (providerId === "google.com") {
      displayName = user.displayName;
      console.log("Display name from Google:", displayName);
    }
    })
    signinBtn.textContent = displayName;
    signinBtn.id = "displayNameBtn";
    wrapper.id = "wrapper1"

    const wrapper1 = document.getElementById("wrapper1")
    const stats = document.getElementById('statsGUI');
    const statsexitBtn = document.getElementById("statsexitBtn")

    wrapper1.addEventListener("click", () => {
      if (auth.currentUser){
        stats.style.display = "block"
      }
    })

    statsexitBtn.addEventListener("click", (e) => {
      e.stopPropagation();   // stop the click from reaching wrapper1
      stats.style.display = "none";
    })

    signoutBtn.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          console.log("User signed out");
          signinBtn.id = "signinBtn"
          signinBtn.textContent = "Sign In"
          wrapper.id = "wrapper"
          stats.style.display = "none"
          signinBtn.style.visibility = "visible";
        })
        .catch((error) => {
          console.error(error);
        });
    

  })
  }
  else {
    signinBtn.style.visibility = "visible";
  }
})

const provider = new GoogleAuthProvider();
const googleBtns = document.querySelectorAll(".googleLoginBtn")

googleBtns.forEach((googleBtn) =>{
  googleBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("User signed in:", result.user.displayName)
      loginpg.style.display = "none"
      signuppg.style.display = "none"
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log("Error:", error.code, error.message)
      errorpage1.textContent = errorMessage
      errorpage2.textContent = errorMessage

    });

})
})







// // conversation



