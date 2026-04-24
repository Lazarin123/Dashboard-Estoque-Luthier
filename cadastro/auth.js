// --- FUNÇÃO DE CADASTRO ---
function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('reg-name').value;
    const user = document.getElementById('reg-user').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;

    if (!name || !user || !email || !pass) {
        alert("Preencha todos os campos.");
        return;
    }

    const userData = {
        name: name,
        username: user,
        email: email,
        password: pass 
    };

    localStorage.setItem(`user_${user}`, JSON.stringify(userData));

    alert("Conta criada com sucesso!");
    // Tenta voltar um nível e encontrar o login
    window.location.href = "../index.html";
}

// --- FUNÇÃO DE LOGIN ---
function handleLogin(event) {
    event.preventDefault();
    
    const user = document.getElementById('l-user').value;
    const pass = document.getElementById('l-pass').value;

    const storedData = localStorage.getItem(`user_${user}`);

    if (storedData) {
        const userObj = JSON.parse(storedData);
        
        if (userObj.password === pass) {
            alert(`Bem-vindo de volta, ${userObj.name}!`);
            
            const base = window.location.origin; 
            
            // Redireciona de forma absoluta
            window.location.href = `${base}/dashboard/dashboard.html`;
            // ------------------------------
            
        } else {
            alert("Senha incorreta. Tente novamente.");
        }
    } else {
        alert("Usuário não encontrado.");
    }
}
