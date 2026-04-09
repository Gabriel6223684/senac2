import { SellingPriceCalculator } from "../components/SellingPriceCalculator.js";

//import { SellingPriceCalculator } from "../components/SellingPriceCalculator.js";
const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action');
const Id = document.getElementById('id');
const inputTotalTax = document.getElementById('total_imposto');
const inputProfitMargin = document.getElementById('margem_lucro');
const inputOperatingCost = document.getElementById('custo_operacional');
const inputPurchasePrice = document.getElementById('preco_compra');

Inputmask("currency", {
    radixPoint: ',',
    inputtype: "text",
    prefix: 'R$ ',
    autoGroup: true,
    groupSeparator: '.',
    rightAlign: false,
    onBeforeMask: function (value) {
        return String(value).replace('.', ',');
    }
}).mask("#preco_venda, #preco_compra");
Inputmask("currency", {
    radixPoint: ',',
    inputtype: "text",
    prefix: '% ',
    autoGroup: true,
    groupSeparator: '.',
    rightAlign: false,
    onBeforeMask: function (value) {
        return String(value).replace('.', ',');
    }
}).mask("#total_imposto, #margem_lucro, #custo_operacional");

function determineSalePrice() {
    const purchasePrice = parseFloat(String(inputPurchasePrice.value).replace('R$', '').replace('.', '').replace(',', '.')) || 0;
    const tax = parseFloat(String(inputTotalTax.value).replace('%', '').replace(',', '.')) || 0;
    const profitMargin = parseFloat(String(inputProfitMargin.value).replace('%', '').replace(',', '.')) || 0;
    const operatingCost = parseFloat(String(inputOperatingCost.value).replace('%', '').replace(',', '.')) || 0;
    if (profitMargin <= 0 && purchasePrice <= 0) {
        document.getElementById('resultado-row').className = 'resultado-row mb-2 d-none';
        return;
    }
    const result = SellingPriceCalculator.create()
        .addTotalTax(tax)
        .addProfitMargin(profitMargin)
        .addOperatingCost(operatingCost)
        .addPurchasePrice(purchasePrice)
        .getData();
    document.getElementById('val-venda').innerHTML = `${result.valor_venda_sugerido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    document.getElementById('val-margem').innerHTML = `${result.valor_margem_lucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    document.getElementById('val-custo').innerHTML = `${result.valor_custo_operacional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    document.getElementById('val-imposto').innerHTML = `${result.valor_total_imposto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    document.getElementById('resultado-row').className = 'resultado-row mb-2';
}

inputTotalTax.addEventListener('input', () => {
    determineSalePrice();
});

inputProfitMargin.addEventListener('input', () => {
    determineSalePrice();
});

inputOperatingCost.addEventListener('input', () => {
    determineSalePrice();
});
inputPurchasePrice.addEventListener('input', () => {
    determineSalePrice();
});

//  CARREGA DADOS DE EDIÇÃO (se existirem)
(async () => {
    const editData = await api.temp.get('product:edit');
    if (editData) {
        // Modo edição
        Action.value = editData.action || 'e';
        Id.value = editData.id || '';
        // Preenche todos os campos pelo atributo name
        for (const [key, value] of Object.entries(editData)) {
            const field = form.querySelector(`[name="${key}"]`);
            if (!field) continue;

            if (field.type === 'checkbox') {
                field.checked = value === true || value === 'true';
            } else {
                field.value = value || '';
            }
        }
    } else {
        // Modo cadastro novo
        Action.value = 'c';
        Id.value = '';
    }
})();

InsertButton.addEventListener('click', async () => {
    let timer = 3000;
    $('#insert').prop('disabled', true);

    // Pega valores do formulário como customer.js
    const nome = document.getElementById('nome').value.trim();
    const codigo_barra = document.getElementById('codigo_barra')?.value || '';
    const preco_compra_str = document.getElementById('preco_compra')?.value || '';
    const preco_venda_str = document.getElementById('preco_venda').value;
    const unidade = document.getElementById('unidade')?.value || '';
    const descricao = document.getElementById('descricao')?.value || '';
    const ativo = document.getElementById('ativo')?.checked || false;

    // Parse prices
    const cleanCompra = preco_compra_str.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    const cleanVenda = preco_venda_str.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
    const preco_compra = parseFloat(cleanCompra) || 0;
    const preco_venda = parseFloat(cleanVenda) || 0;

    const data = {
        nome,
        codigo_barra,
        preco_compra,
        preco_venda,
        unidade,
        descricao,
        ativo
    };

    const id = Action.value !== 'c' ? Id.value : null;

    try {
        const response = Action.value === 'c'
            ? await api.product.insert(data)
            : await api.product.update(id, data);

        if (!response.status) {
            toast('error', 'Erro', response.msg, timer);
            return;
        }

        toast('success', 'Sucesso', response.msg, timer);
        form.reset();
        api.temp.set('product:edit', null);
        setTimeout(() => api.window.close(), timer);
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message, timer);
    } finally {
        $('#insert').prop('disabled', false);
    }
});