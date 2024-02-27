import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {Sujeto} from '../models';
import {SujetoRepository} from '../repositories';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';
import { inject } from '@loopback/core';

export class SujetoRepresentadosController {
  constructor(
    @repository(SujetoRepository)
    public sujetoRepository : SujetoRepository,
    @inject('cuitRepresentado') private cuitRepresentado: string
  ) {}

  @get('/sujetos/{id}/representados', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Lista de representados del sujeto.',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Sujeto, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<any> {
    const respuestaAFIP = {"cuit":"55-12389329-2","userName":null,"representados":["55-12389329-2", "23-13848439-4"],"body":"<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<sso version=\"2.0\">\n<id dst=\"afip-gobcba\" exp_time=\"1589709684\" gen_time=\"1589709384\" src=\"cn=Authserver, ou=DESEIN, o=AFIP, c=AR\" unique_id=\"2105267459\"/>\n<operation type=\"login\" value=\"granted\">\n<login authmethod=\"passphrase\" entity=\"33693450239\" regmethod=\"3\" service=\"afip-gobcba\" uid=\"20223841946\">\n<relations>\n<relation key=\"20223841946\" reltype=\"12\"/>\n</relations>\n</login>\n</operation>\n</sso>\n","origen":"AFIP"};
    var sujetos = await this.sujetoRepository.find({
      where: {
        id: {inq: respuestaAFIP.representados},
      }
  });
  return await this.sujetoRepresentados(sujetos);
  }

  sujetoRepresentados(sujetos: any) {
    return sujetos.map((sujeto: any) => {
      return Object.assign({}, {
        denominacion: sujeto.denominacion,
        username: sujeto.id.replace(/-/g, ''),
        cuit: sujeto.id,
      });
    });
  }
}