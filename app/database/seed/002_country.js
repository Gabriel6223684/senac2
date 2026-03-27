// Usa o fetch nativo do Node.js 18+ — sem necessidade de instalar node-fetch
const URL_PAISES = 'https://restcountries.com/v3.1/all?fields=name,cca2,region,subregion,languages,currencies';
export async function seed(knex) {

  // 1. BUSCA OS DADOS DO JSON VIA FETCH NATIVO DO NODE.JS
  const resposta = await fetch(URL_PAISES);

  if (!resposta.ok) {
    throw new Error(`Falha ao buscar os dados dos países: ${resposta.statusText}`);
  }
  const paises = await resposta.json();

  // 2. LIMPA A TABELA ANTES DE INSERIR OS DADOS
  await knex('country').del();

  // 3. MAPEIA O JSON PARA O FORMATO DA TABELA country
  const dados = paises
    .map((pais) => {
      const codigo = pais.cca2 ?? null;
      const nome = pais.name?.common ?? null;

      if (!codigo || !nome) return null;

      const localizacao = [pais.region, pais.subregion].filter(Boolean).join(' - ') || null;

      const lingua = pais.languages
        ? Object.values(pais.languages).join(', ')
        : null;

      const moeda = pais.currencies
        ? Object.values(pais.currencies).map((m) => m.name).join(', ')
        : null;

      return { codigo, nome, localizacao, lingua, moeda };
    })
    .filter(Boolean);

  // 4. INSERE EM LOTES DE 100 PARA MELHOR PERFORMANCE
  const batchSize = 100;
  for (let i = 0; i < dados.length; i += batchSize) {
    const lote = dados.slice(i, i + batchSize);
    await knex('country').insert(lote);
    console.log(`Inseridos ${Math.min(i + batchSize, dados.length)} de ${dados.length} países`);
  }
  console.log('Seed de países concluída com sucesso!');
}