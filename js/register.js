
// OOG FUNCTIE VOOR WACHTWOORD
function togglePassword(fieldId, eyeIcon) {
    let passwordInput = document.getElementById(fieldId);
    let icon = eyeIcon.querySelector("i");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye-slash"); 
        icon.classList.add("fa-eye"); 
    } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye"); 
        icon.classList.add("fa-eye-slash"); 
    }
}


//CONTROLEREN OF DE WACHTWOORD EFFECTIEF OVEREENKOMT
function validatePasswords() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    let errorMessage = document.getElementById("password-error");

// checken of de wachtwoord juist is
    if (password !== confirmPassword) {
        errorMessage.textContent = "Wachtwoorden komen niet overeen!";
        errorMessage.style.display = "block"; 
    } else {
    
        errorMessage.textContent = "";
        errorMessage.style.display = "none"; 
    }
}
