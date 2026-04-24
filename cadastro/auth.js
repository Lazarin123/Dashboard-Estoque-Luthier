// // --- FUNÇÃO DE CADASTRO ---
// function handleRegister(event) {
//     event.preventDefault();

//     const name = document.getElementById('reg-name').value;
//     const user = document.getElementById('reg-user').value;
//     const email = document.getElementById('reg-email').value;
//     const pass = document.getElementById('reg-pass').value;

//     if (!name || !user || !email || !pass) {
//         alert("Preencha todos os campos.");
//         return;
//     }

//     const userData = {
//         name: name,
//         username: user,
//         email: email,
//         password: pass // Salvando como 'password'
//     };

//     // Salva no navegador
//     localStorage.setItem(`user_${user}`, JSON.stringify(userData));

//     alert("Conta criada com sucesso!");
//     window.location.href = "../index.html";
// }

// // --- FUNÇÃO DE LOGIN ---
// function handleLogin(event) {
//     event.preventDefault();
    
//     // Pegando os IDs que você usou no seu login.html (l-user e l-pass)
//     const user = document.getElementById('l-user').value;
//     const pass = document.getElementById('l-pass').value;

//     const storedData = localStorage.getItem(`user_${user}`);

//     if (storedData) {
//         const userObj = JSON.parse(storedData);
        
//         // AQUI ESTAVA O ERRO: Verificando se userObj.password bate com o que foi digitado
//         if (userObj.password === pass) {
//             alert(`Bem-vindo de volta, ${userObj.name}!`);
//             window.location.href = "../dashboard/dashboard.html"; 
//         } else {
//             alert("Senha incorreta. Tente novamente.");
//         }
//     } else {
//         alert("Usuário não encontrado.");
//     }
// }

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
        password: pass // Salvando como 'password'
    };

    // Salva no navegador
    localStorage.setItem(`user_${user}`, JSON.stringify(userData));

    alert("Conta criada com sucesso!");
    // Mantido conforme sua estrutura de pastas para voltar ao login
    window.location.href = "../login.html";
}

// --- FUNÇÃO DE LOGIN ---
function handleLogin(event) {
    event.preventDefault();
    
    // Pegando os IDs que você usou no seu login.html (l-user e l-pass)
    const user = document.getElementById('l-user').value;
    const pass = document.getElementById('l-pass').value;

    const storedData = localStorage.getItem(`user_${user}`);

    if (storedData) {
        const userObj = JSON.parse(storedData);
        
        // Verificando se userObj.password bate com o que foi digitado
        if (userObj.password === pass) {
            alert(`Bem-vindo de volta, ${userObj.name}!`);
            
            // AJUSTE REALIZADO: Caminho definido como solicitado
            window.location.href = "dashboard.html"; 
            
        } else {
            alert("Senha incorreta. Tente novamente.");
        }
    } else {
        alert("Usuário não encontrado.");
    }
}
