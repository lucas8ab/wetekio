import {bind, /* inject, */ BindingScope} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import jwt_decode = require('jwt-decode');
import {repository} from '@loopback/repository';
import {TramitesRepository} from '../repositories';
import {Tramite} from '../models';
import {inject} from '@loopback/context';
import {RestApiService} from './rest-api.service';
import {toUpper} from 'lodash';
import moment = require('moment');

@bind({scope: BindingScope.TRANSIENT})
export class TramiteService {
  constructor(
    @repository(TramitesRepository)
    private tramitesRepository: TramitesRepository,
    @inject('services.RestApi')
    private restApiService: RestApiService,
  ) {}

  async getTareas(userId: string, grupo: string[], all?: boolean) {
    let tareas = await this.tramitesRepository.find({
      fields: {
        id: true,
        estado: true,
        fechaInicio: true,
        datos_adicionales: true,
        tipo: true,
        workflowInstanceKey: true,
      },
    });

    const parseGroup = grupo.map((g: string) => toUpper(g));
    return tareas.filter(
      (t: any) =>
        //@ts-ignore
        (all &&
          t.datos_adicionales &&
          t.datos_adicionales.grupo &&
          parseGroup.includes(toUpper(t.datos_adicionales.grupo))) ||
        //@ts-ignore
        (!all &&
          t.datos_adicionales &&
          t.datos_adicionales.asignado &&
          t.datos_adicionales.asignado == String(userId)),
    );
  }

  async asignarTarea(id: string, userId: string) {
    let tramite = new Tramite({
      datos_adicionales: {
        asignado: String(userId),
      },
    });
    return this.tramitesRepository.updateTramite(id, tramite);
  }

  async completarTarea(id: string, body: any, userId: string, token: string) {
    console.log('acceso a completarTarea - tramite.service- param body: ', body)
    const tramite = await this.tramitesRepository.findById(id);
    console.log('acceso a completarTarea - tramite.service- param tramite: ', tramite)
//@ts-ignore
    if (
      (tramite.datos_adicionales as any).asignado &&
      //@ts-ignore
      tramite.datos_adicionales.asignado != String(userId)
    ) {
      throw new HttpErrors.Unauthorized(`Tramite asginado para otro usuario.`);
    }
    //@ts-ignore
    const tarea = await this.restApiService.call(
      `${process.env.TRAMITEBFF_URL}/tareas/${
        (tramite.datos_adicionales as any).jobKey
      }/completar`,
      body,
      token,
    );
    //@ts-ignore
    if (tramite.datos_adicionales.ultimaTarea == 'true') {
      let estado = JSON.stringify({
        proceso: 'Finalizado',
        fecha: moment(),
      });
      const datos_adicionales = {
        asignado: undefined,
        grupo: undefined,
      };
      return this.tramitesRepository.updateTramiteByWorkflowInstanceKey(
        tramite.workflowInstanceKey,
        new Tramite({
          estado,
          datos_adicionales,
          descripcion: JSON.stringify(body),
        }),
      );
    } else {
      return this.tramitesRepository.updateTramiteByWorkflowInstanceKey(
        tramite.workflowInstanceKey,
        new Tramite({
          datos_adicionales: {
            asignado: undefined,
          },
          descripcion: JSON.stringify(body),
        }),
      );
    }
  }
}
