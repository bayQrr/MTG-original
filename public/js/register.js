document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.querySelector(".password-container input[type='password']");
    const togglePasswordBtn = document.querySelector(".toggle-password");
    const passwordError = document.getElementById("password-error");
    const submitButton = document.getElementById("btn");

    // Functie om wachtwoord te tonen/verbergen
    function togglePassword() {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
        } else {
            passwordInput.type = "password";
            togglePasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
    }

    // Event listener voor het wachtwoord toggle-icoon
    togglePasswordBtn.addEventListener("click", togglePassword);

    // Wachtwoordvalidatie bij typen
    passwordInput.addEventListener("input", function () {
        const password = passwordInput.value;

        if (password.length < 6) {
            passwordError.textContent = "Wachtwoord moet minstens 6 tekens lang zijn.";
            passwordError.style.color = "red";
            submitButton.disabled = true;
        } else {
            passwordError.textContent = "";
            submitButton.disabled = false;
        }
    });
});
