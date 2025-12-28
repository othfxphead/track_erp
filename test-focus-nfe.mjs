/**
 * Script de teste da integração Focus NFe
 * 
 * Testa a conexão com a API usando o token de homologação
 */

const TOKEN_HOMOLOG = "ePobVyoOvXYQn41yllsOxk3L3IwB9sgb";
const BASE_URL = "https://homologacao.focusnfe.com.br";

async function testarConexao() {
  console.log("🔍 Testando conexão com Focus NFe (Homologação)...\n");

  const auth = Buffer.from(`${TOKEN_HOMOLOG}:`).toString("base64");

  try {
    // Tenta consultar uma nota que não existe (apenas para testar autenticação)
    const response = await fetch(`${BASE_URL}/v2/nfe/teste123`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    console.log(`Status HTTP: ${response.status} ${response.statusText}`);

    const data = await response.json();
    console.log("Resposta da API:", JSON.stringify(data, null, 2));

    if (response.status === 404) {
      console.log("\n✅ Autenticação OK! (Nota não encontrada é esperado)");
      console.log("✅ Token de homologação está funcionando!");
      return true;
    } else if (response.status === 403) {
      console.log("\n❌ Erro de autenticação! Token inválido ou bloqueado.");
      return false;
    } else {
      console.log("\n⚠️ Resposta inesperada, mas conexão estabelecida.");
      return true;
    }
  } catch (error) {
    console.error("\n❌ Erro ao conectar com a API:");
    console.error(error);
    return false;
  }
}

testarConexao()
  .then((sucesso) => {
    process.exit(sucesso ? 0 : 1);
  })
  .catch((error) => {
    console.error("Erro fatal:", error);
    process.exit(1);
  });
