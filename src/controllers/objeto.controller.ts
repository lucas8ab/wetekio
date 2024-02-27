import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,  
  put,
  requestBody,
} from '@loopback/rest';
import { Objeto } from '../models';
import { ObjetoRepository } from '../repositories';
import { ObjetoEtiquetasDTO } from '../dtos/objetoEtiquetas.dtos';
import { OPERATION_SECURITY_SPEC } from '../utils/security-spec';

export class ObjetoController {
  constructor(
    @repository(ObjetoRepository)
    public objetoRepository: ObjetoRepository,
  ) { }

  @get('/objetos', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Objeto model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(Objeto) },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Objeto)) filter?: Filter<Objeto>,
  ): Promise<Objeto[]> {
    return this.objetoRepository.find(filter);
  }

  @get('/objetos/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Modelo instancia de Objeto',
        content: { 'application/json': { schema: getModelSchemaRef(Objeto) } },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Objeto> {
    return this.objetoRepository.findById(id);
  }

  @put('/objetos/{id}/etiquetas', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Etiqueta del objeto actualizada.',
      }
    },
  })
  async actualizaEtiquetaById(
    @param.path.string('id') id: string,
    @requestBody({
      description: "Actualiza etiqueta del objeto.",
      content: {
        'application/json': {
          schema: getModelSchemaRef(ObjetoEtiquetasDTO, {
            includeRelations: true
          }),
        },
      },
    })
    objeto: ObjetoEtiquetasDTO,
  ): Promise<any> {
    return await this.objetoRepository.setEtiqueta(objeto.etiqueta,
      {
        id: id,
        sujeto_id: objeto.sujeto_id,
        tipo_objeto: objeto.tipo_objeto
      });
  }
}
