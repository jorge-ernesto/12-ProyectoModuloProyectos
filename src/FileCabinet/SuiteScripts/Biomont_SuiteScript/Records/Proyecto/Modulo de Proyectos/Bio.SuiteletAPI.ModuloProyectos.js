// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL API Modulo Proyectos (customscript_bio_sl_api_modulo_proyectos)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        const { log, record, runtime, format, url } = N;

        /******************/

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {
            // Debug
            // scriptContext.response.setHeader('Content-type', 'application/json');
            // scriptContext.response.write(JSON.stringify(scriptContext));
            // return;

            // Debug
            // log.debug('method', scriptContext.request.method);
            // log.debug('parameters', scriptContext.request.parameters);
            // log.debug('body', scriptContext.body);
            // return;

            if (scriptContext.request.method == 'POST') {

                // Obtener datos enviados por peticion HTTP
                let data = JSON.parse(scriptContext.request.body);
                let method = data._method || null;

                if (method) {

                    // Obtener datos
                    let project_id = data._project_id || null;
                    let solicitado_por_id = data._solicitado_por_id || null;
                    let comentarios = data._comentarios || null;

                    // Obtener el record del proyecto
                    let proyectoRecord = project_id ? record.load({ type: 'job', id: project_id }) : null;

                    // Obtener el usuario logueado
                    let user = runtime.getCurrentUser();

                    // Obtener fecha y hora actual
                    var now = new Date();
                    var datetime = format.format({ value: now, type: format.Type.DATETIME });

                    // Respuesta
                    let response = {
                        code: '400',
                        status: 'error',
                        method: method
                    };

                    if (method == 'getDataUser') {

                        // Obtener area
                        let { area } = objHelper.getDataUser(solicitado_por_id);

                        // Respuesta
                        response = {
                            code: '200',
                            status: 'success',
                            method: method,
                            area: area
                        };
                    } else if (method == 'solicitarAprobacion' && proyectoRecord) {

                        // Setear datos al record
                        proyectoRecord.setValue('custentity_usuario_firma_solicitado_por', user.id);
                        proyectoRecord.setValue('custentity_fecha_firma_solicitado_por', datetime);
                        let proyectoId = proyectoRecord.save();
                        log.debug('', proyectoId);

                        if (proyectoId) {
                            // Obtener url del Record
                            let urlRecord = url.resolveRecord({
                                recordType: 'job',
                                recordId: project_id,
                                params: {
                                    _status: 'PROCESS_REQUEST'
                                }
                            })

                            // Enviar email
                            objHelper.sendEmail_SolicitarAprobacion(proyectoRecord, user);

                            // Respuesta
                            response = {
                                code: '200',
                                status: 'success',
                                method: method,
                                proyectoRecord: proyectoRecord,
                                proyectoId: proyectoId,
                                urlRecord: urlRecord
                            };
                        }
                    } else if (method == 'aprobarProyecto' && proyectoRecord) {

                        // Setear datos al record
                        proyectoRecord.setValue('custentity_usuario_firma_aprobado_por', user.id);
                        proyectoRecord.setValue('custentity_fecha_firma_aprobado_por', datetime);
                        proyectoRecord.setValue('entitystatus', 18); // Estado "Aprobado"
                        let proyectoId = proyectoRecord.save();
                        log.debug('', proyectoId);

                        if (proyectoId) {
                            // Obtener url del Record
                            let urlRecord = url.resolveRecord({
                                recordType: 'job',
                                recordId: project_id,
                                params: {
                                    _status: 'PROCESS_SIGNATURE'
                                }
                            })

                            // Enviar email
                            objHelper.sendEmail_AprobarProyecto(proyectoRecord, user);
                            objHelper.sendEmail_SolicitarAutorizacion(proyectoRecord, user);

                            // Respuesta
                            response = {
                                code: '200',
                                status: 'success',
                                method: method,
                                proyectoRecord: proyectoRecord,
                                proyectoId: proyectoId,
                                urlRecord: urlRecord
                            };
                        }
                    } else if (method == 'noAprobarProyecto' && proyectoRecord) {

                        // Obtener url del Record
                        let urlRecord = url.resolveRecord({
                            recordType: 'job',
                            recordId: project_id,
                            params: {
                                _status: 'PROCESS_REQUEST'
                            }
                        })

                        // Enviar email
                        objHelper.sendEmail_NoAprobarProyecto(proyectoRecord, user);

                        // Respuesta
                        response = {
                            code: '200',
                            status: 'success',
                            method: method,
                            urlRecord: urlRecord
                        };
                    } else if (method == 'autorizarProyecto' && proyectoRecord) {

                        // Setear datos al record
                        proyectoRecord.setValue('custentity_usuario_firma_autorizado_por', user.id);
                        proyectoRecord.setValue('custentity_fecha_firma_autorizado_por', datetime);
                        proyectoRecord.setValue('custentity_comentarios_autorizado_por', comentarios);
                        proyectoRecord.setValue('entitystatus', 19); // Estado "Autorizado"
                        let proyectoId = proyectoRecord.save();
                        log.debug('', proyectoId);

                        if (proyectoId) {
                            // Obtener url del Record
                            let urlRecord = url.resolveRecord({
                                recordType: 'job',
                                recordId: project_id,
                                params: {
                                    _status: 'PROCESS_SIGNATURE'
                                }
                            })

                            // Enviar email
                            objHelper.sendEmail_AutorizarProyecto(proyectoRecord, user);

                            // Respuesta
                            response = {
                                code: '200',
                                status: 'success',
                                method: method,
                                proyectoRecord: proyectoRecord,
                                proyectoId: proyectoId,
                                urlRecord: urlRecord
                            };
                        }
                    } else if (method == 'noAutorizarProyecto' && proyectoRecord) {

                        // Setear datos al record
                        proyectoRecord.setValue('custentity_com_rechazo_autorizado_por', comentarios);
                        let proyectoId = proyectoRecord.save();
                        log.debug('', proyectoId);

                        if (proyectoId) {
                            // Obtener url del Record
                            let urlRecord = url.resolveRecord({
                                recordType: 'job',
                                recordId: project_id,
                                params: {
                                    _status: 'PROCESS_REQUEST'
                                }
                            })

                            // Enviar email
                            objHelper.sendEmail_NoAutorizarProyecto(proyectoRecord, user);

                            // Respuesta
                            response = {
                                code: '200',
                                status: 'success',
                                method: method,
                                urlRecord: urlRecord
                            };
                        }
                    } else if (method == 'actualizarEnCurso' && proyectoRecord) {

                        // Setear datos al record
                        proyectoRecord.setValue('entitystatus', 2); // Estado "En curso"
                        let proyectoId = proyectoRecord.save();
                        log.debug('', proyectoId);

                        if (proyectoId) {
                            // Obtener url del Record
                            let urlRecord = url.resolveRecord({
                                recordType: 'job',
                                recordId: project_id,
                                params: {
                                    _status: 'PROCESS_CHANGE_STATUS_EN_CURSO'
                                }
                            })

                            // Enviar email
                            objHelper.sendEmail_ActualizarEnCurso(proyectoRecord, user);

                            // Respuesta
                            response = {
                                code: '200',
                                status: 'success',
                                method: method,
                                proyectoRecord: proyectoRecord,
                                proyectoId: proyectoId,
                                urlRecord: urlRecord
                            };
                        }
                    } else if (method == 'notificarCulminacionTarea' && proyectoRecord) {

                        // Enviar email
                        objHelper.sendEmail_NotificarCulminacionTarea(proyectoRecord, user);

                        // Respuesta
                        response = {
                            code: '200',
                            status: 'success',
                            method: method
                        };
                    } else if (method == 'solicitarCierre' && proyectoRecord) {

                        // Obtener url del Record
                        let urlRecord = url.resolveRecord({
                            recordType: 'job',
                            recordId: project_id,
                            params: {
                                _status: 'PROCESS_REQUEST'
                            }
                        })

                        // Enviar email
                        objHelper.sendEmail_SolicitarCierre(proyectoRecord, user);

                        // Respuesta
                        response = {
                            code: '200',
                            status: 'success',
                            method: method,
                            urlRecord: urlRecord
                        };
                    } else if (method == 'cerrarProyecto' && proyectoRecord) {

                        // Setear datos al record
                        proyectoRecord.setValue('custentity_usu_firma_cierre_aprobado_por', user.id);
                        proyectoRecord.setValue('custentity_fec_firma_cierre_aprobado_por', datetime);
                        proyectoRecord.setValue('custentity_coment_cierre_aprobado_por', comentarios);
                        proyectoRecord.setValue('entitystatus', 1); // Estado "Cerrado"
                        let proyectoId = proyectoRecord.save();
                        log.debug('', proyectoId);

                        if (proyectoId) {
                            // Obtener url del Record
                            let urlRecord = url.resolveRecord({
                                recordType: 'job',
                                recordId: project_id,
                                params: {
                                    _status: 'PROCESS_SIGNATURE'
                                }
                            })

                            // Enviar email
                            objHelper.sendEmail_AprobarCierre(proyectoRecord, user);

                            // Respuesta
                            response = {
                                code: '200',
                                status: 'success',
                                method: method,
                                proyectoRecord: proyectoRecord,
                                proyectoId: proyectoId,
                                urlRecord: urlRecord
                            };
                        }
                    } else if (method == 'notificarCierre' && proyectoRecord) {

                        // Obtener url del Record
                        let urlRecord = url.resolveRecord({
                            recordType: 'job',
                            recordId: project_id,
                            params: {
                                _status: 'PROCESS_REQUEST'
                            }
                        })

                        // Enviar email
                        objHelper.sendEmail_NotificarCierre(proyectoRecord, user);

                        // Respuesta
                        response = {
                            code: '200',
                            status: 'success',
                            method: method,
                            urlRecord: urlRecord
                        };
                    } else if (method == 'eliminarFirmas' && proyectoRecord) {

                        // Setear datos al record
                        // Firma (Solicitado por)
                        proyectoRecord.setValue('custentity_usuario_firma_solicitado_por', '');
                        proyectoRecord.setValue('custentity_fecha_firma_solicitado_por', '');
                        // Firma (Aprobado por)
                        proyectoRecord.setValue('custentity_usuario_firma_aprobado_por', '');
                        proyectoRecord.setValue('custentity_fecha_firma_aprobado_por', '');
                        // Firma (Autorizado por)
                        proyectoRecord.setValue('custentity_usuario_firma_autorizado_por', '');
                        proyectoRecord.setValue('custentity_fecha_firma_autorizado_por', '');
                        proyectoRecord.setValue('custentity_comentarios_autorizado_por', '');
                        proyectoRecord.setValue('custentity_com_rechazo_autorizado_por', '');
                        // Firma (Cierre aprobado por)
                        proyectoRecord.setValue('custentity_usu_firma_cierre_aprobado_por', '');
                        proyectoRecord.setValue('custentity_fec_firma_cierre_aprobado_por', '');
                        proyectoRecord.setValue('custentity_coment_cierre_aprobado_por', '');
                        // Estado
                        proyectoRecord.setValue('entitystatus', 17); // Estado "Planificado"
                        let proyectoId = proyectoRecord.save();
                        log.debug('', proyectoId);

                        if (proyectoId) {
                            // Obtener url del Record
                            let urlRecord = url.resolveRecord({
                                recordType: 'job',
                                recordId: project_id,
                                params: {
                                    _status: 'PROCESS_SIGNATURE'
                                }
                            })

                            // Respuesta
                            response = {
                                code: '200',
                                status: 'success',
                                method: method,
                                proyectoRecord: proyectoRecord,
                                proyectoId: proyectoId,
                                urlRecord: urlRecord
                            };
                        }
                    }

                    // Respuesta
                    scriptContext.response.setHeader('Content-type', 'application/json');
                    scriptContext.response.write(JSON.stringify(response));
                }
            }
        }

        return { onRequest }

    });
