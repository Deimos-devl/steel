document.addEventListener("DOMContentLoaded", () => {
    const produtos = {
        injetaveis: {
            "Enantato de testosterona 250mg 10ml": 150,
            "Durateston 250mg 10ml": 150,
            "Propionato de testosterona 200mg 10ml": 150,
            "Cipionato de testosterona 200mg 10ml": 150,
            "Deca 200mg 10ml": 150,
            "Boldenona 200mg 10ml": 150,
            "Trembolona acetato 100mg 10ml": 150,
            "Trembolona enantato 100mg 10ml": 150,
            "Masteron 100mg 10ml": 150,
            "NPP 100mg 10ml": 150,
            "Stanozolol 100mg 10ml": 150,
            "Cutstack 200mg 10ml": 200
        },
        orais: {
            "Stanozolol 10mg 100 caps": 140,
            "Hemogenin 50mg 30 caps": 140,
            "Dianabol 10mg 100 caps": 140,
            "Oxandrolona 10mg 100 caps": 140,
            "Oxandrolona 20mg 100 caps": 200
        }
    };

    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });

    function formatarMoeda(valor) {
        return formatter.format(valor).replace(/\s/g, "");
    }

    const combos = [];

    function preencherProdutos() {
        const injetaveisContainer = document.getElementById("injetaveis");
        const oraisContainer = document.getElementById("orais");

        function criarProduto(nome, preco, container) {
            const div = document.createElement("div");
            div.classList.add("produto");
            div.innerHTML = `
                <span>${nome}</span>
                <span>${formatarMoeda(preco)}</span>
                <div class="produto-controls">
                    <button class="btn-ajustar" onclick="ajustarQuantidade(this, -1)">-</button>
                    <input type="number" min="0" value="0">
                    <button class="btn-ajustar" onclick="ajustarQuantidade(this, 1)">+</button>
                </div>`;
            container.appendChild(div);
        }

        Object.entries(produtos.injetaveis).forEach(([nome, preco]) => {
            criarProduto(nome, preco, injetaveisContainer);
        });

        Object.entries(produtos.orais).forEach(([nome, preco]) => {
            criarProduto(nome, preco, oraisContainer);
        });
    }

    window.ajustarQuantidade = function (button, delta) {
        const input = button.parentElement.querySelector("input");
        input.value = Math.max(0, parseInt(input.value) + delta);
    }

    document.getElementById("aplicar-desconto").addEventListener("change", function () {
        const descontoInput = document.getElementById("porcentagem-desconto");
        descontoInput.disabled = !this.checked;
        if (!this.checked) descontoInput.value = 0;
    });

    document.getElementById("gerar-orcamento").addEventListener("click", () => {
        let total = 0;
        const produtosSelecionados = [];
        const modoCombo = false;
        const desconto = parseFloat(document.getElementById("porcentagem-desconto").value) || 0;
        const valorFreteManual = parseFloat(document.getElementById("valor-frete").value) || 0;

        document.querySelectorAll("#injetaveis .produto, #orais .produto").forEach((div) => {
            const quantidade = parseInt(div.querySelector("input").value);
            if (quantidade > 0) {
                const nome = div.querySelector("span:first-child").textContent;
                const preco = parseFloat(div.querySelector("span:nth-child(2)").textContent.replace("R$", "").replace(",", "."));
                produtosSelecionados.push({ nome, quantidade, preco });
            }
        });

        produtosSelecionados.forEach(p => {
            total += p.quantidade * p.preco;
        });

        if (desconto > 0) {
            total -= total * (desconto / 100);
        }

        total += valorFreteManual;

        const mensagem = [
            desconto > 0 ? `DESCONTO DE ${desconto}%! 🎁` : null,
            `Total de ${formatarMoeda(total)} já com o frete incluso (Transportadora)`,
            `🔥 Nossa garantia é 100% gratuita! 🔥`,
            `Seu novo pedido será 📦:`,
            produtosSelecionados.map(p => `${p.quantidade}x ${p.nome} ${formatarMoeda(p.quantidade * p.preco)}`).join("\n"),
            "",
            `Podemos fechar o seu pedido?`
        ].filter(line => line !== null).join("\n");

        navigator.clipboard.writeText(mensagem).then(() => {
            alert("Orçamento copiado!");
            resetarQuantidades();
        });
    });

    function resetarQuantidades() {
        document.querySelectorAll("input[type='number']").forEach(input => {
            if (!input.id.includes("frete") && !input.id.includes("desconto")) {
                input.value = 0;
            }
        });
    }

    preencherProdutos();
});
