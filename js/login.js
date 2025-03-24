// js/login.js
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded - login.js is running");
    
    // Check if elements exist
    const loginBtn = document.getElementById('login-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const togglePassword = document.querySelector('.toggle-password');
    const btnText = document.querySelector('.btn-text');
    const spinner = document.querySelector('.spinner');
    
    // Debug element existence
    console.log("Login button exists:", !!loginBtn);
    console.log("Username input exists:", !!usernameInput);
    console.log("Password input exists:", !!passwordInput);
    console.log("Error message exists:", !!errorMessage);
    console.log("Toggle password exists:", !!togglePassword);
    console.log("Button text exists:", !!btnText);
    console.log("Spinner exists:", !!spinner);
    
    // If any element is missing, show alert
    if (!loginBtn || !usernameInput || !passwordInput || !errorMessage || !togglePassword || !btnText || !spinner) {
        console.error("Some elements are missing from the DOM");
        alert("Login page error: Some elements could not be found. Check console for details.");
        return; // Stop execution if elements are missing
    }
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        console.log("Toggle password clicked");
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
    
    // Login functionality
    loginBtn.addEventListener('click', function(e) {
        console.log("Login button clicked");
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        console.log("Username entered:", username);
        console.log("Password entered:", password.replace(/./g, '*')); // Log masked password
        
        // Show loading state
        btnText.textContent = 'Signing in...';
        spinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        
        // Simulate API call
        console.log("Starting login timeout...");
        setTimeout(function() {
            console.log("Login timeout completed");
            // For demo purposes, accept "admin/admin" as valid credentials
            if (username === 'admin' && password === 'admin') {
                console.log("Credentials valid, logging in");
                // Store login state
                try {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('username', username);
                    console.log("Login state stored in localStorage");
                } catch (e) {
                    console.error("Error storing login state:", e);
                }
                
                // Redirect to main page
                console.log("Redirecting to index.html");
                window.location.href = 'index.html';
            } else {
                console.log("Invalid credentials");
                // Show error
                errorMessage.classList.remove('hidden');
                btnText.textContent = 'Sign In';
                spinner.classList.add('hidden');
                
                // Shake effect for error
                loginBtn.classList.add('shake');
                setTimeout(() => {
                    loginBtn.classList.remove('shake');
                }, 500);
            }
        }, 1500); // Simulate network delay
    });
    
    // Also allow Enter key to submit
    passwordInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            console.log("Enter key pressed in password field");
            loginBtn.click();
        }
    });
    
    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
    `;
    document.head.appendChild(style);
    
    // Focus on username field on load
    usernameInput.focus();
    console.log("Login.js initialization complete");
});

// Add global error handler
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.message, 'at', e.filename, ':', e.lineno);
});

// Add this to your login.js
function storeLoginState(username) {
    try {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        return true;
    } catch (e) {
        console.error("LocalStorage error:", e);
        // Fallback to cookies
        document.cookie = "isLoggedIn=true; path=/; max-age=86400";
        document.cookie = "username=" + username + "; path=/; max-age=86400";
        return false;
    }
}
