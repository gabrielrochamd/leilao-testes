import { adicionaLance, obtemLancesDoLeilao } from "../../src/repositorio/lance";
import apiLeiloes from '../../src/servicos/apiLeiloes';

jest.mock('../../src/servicos/apiLeiloes');

const mockLances = [
  { id: 1, valor: 10 },
  { id: 2, valor: 20 }
];

function mockRequisicao(retorno) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: retorno }), 200);
  });
}

function mockRequisicaoErro() {
  return new Promise((_, reject) => {
    setTimeout(() => reject(), 200);
  });
}

describe('repositorio/lance', () => {
  beforeEach(() => {
    apiLeiloes.get.mockClear();
    apiLeiloes.post.mockClear();
  });

  describe(obtemLancesDoLeilao.name, () => {
    it('deve retornar uma lista de lances', async () => {
      apiLeiloes.get.mockImplementation(() => mockRequisicao(mockLances));
      const lances = await obtemLancesDoLeilao(1);
      expect(apiLeiloes.get).toHaveBeenCalledWith('/lances?leilaoId=1&_sort=valor&_order=desc');
      expect(apiLeiloes.get).toHaveBeenCalledTimes(1);
      expect(lances).toEqual(mockLances);
    });

    it('deve retornar uma lista vazia caso ocorra erro na requisição', async () => {
      apiLeiloes.get.mockImplementation(() => mockRequisicaoErro());
      const lances = await obtemLancesDoLeilao(1);
      expect(apiLeiloes.get).toHaveBeenCalledWith('/lances?leilaoId=1&_sort=valor&_order=desc');
      expect(apiLeiloes.get).toHaveBeenCalledTimes(1);
      expect(lances).toEqual([]);
    });
  });

  describe(adicionaLance.name, () => {
    it('deve retornar true caso a requisição tenha sucesso', async () => {
      apiLeiloes.post.mockImplementation(() => mockRequisicao());
      const sucesso = await adicionaLance(mockLances[0]);
      expect(apiLeiloes.post).toHaveBeenCalledWith('/lances', mockLances[0]);
      expect(apiLeiloes.post).toHaveBeenCalledTimes(1);
      expect(sucesso).toBe(true);
    });

    it('deve retornar false caso ocorra erro na requisição', async () => {
      apiLeiloes.post.mockImplementation(() => mockRequisicaoErro());
      const sucesso = await adicionaLance(mockLances[0]);
      expect(apiLeiloes.post).toHaveBeenCalledWith('/lances', mockLances[0]);
      expect(apiLeiloes.post).toHaveBeenCalledTimes(1);
      expect(sucesso).toBe(false);
    });
  });
});