document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    const registerLink = document.getElementById('register-link');

    // Test account credentials
    const validUsername = 'admin';
    const validPassword = 'admin';

    // Focus username input on load
    usernameInput.focus();

    // Login function
    function attemptLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate inputs
        if (!username || !password) {
            errorMessage.textContent = 'Please enter both username and password';
            return;
        }

        // Check credentials
        if (username === validUsername && password === validPassword) {
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Redirect to chat page
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Invalid username or password';
            passwordInput.value = '';
        }
    }

    // Event listeners
    loginButton.addEventListener('click', attemptLogin);

    // Allow login with Enter key
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            attemptLogin();
        }
    });

    // Register link (for demonstration)
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Registration functionality would be implemented here. For now, use username: admin, password: admin');
    });
});
