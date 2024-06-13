// Notas del archivo:
// - Secuencia de comando:
//      - Biomont UE Modulo Proyectos (customscript_bio_ue_modulo_proyectos)
// - Registro:
//      - Trabajo (job)

// Validación como la usa LatamReady:
// - ClientScript                   : No se ejecuta en modo ver. Solo se ejecuta en modo crear, copiar o editar.
// - En modo crear, copiar o editar : Validamos por el formulario.
// - En modo ver                    : Validamos por el pais de la subsidiaria.

/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['./lib/Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        const { log } = N;
        const { serverWidget, message } = N.ui;

        /******************/

        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        function beforeLoad(scriptContext) {

            // Obtener el newRecord y type
            let { newRecord, type } = scriptContext;

            // Obtener datos
            let form_id = newRecord.getValue('customform') || null;
            let subsidiary_id = newRecord.getValue('subsidiary') || null;
            let country_subsidiary_id = subsidiary_id ? objHelper.getCountrySubsidiary(subsidiary_id) : null;

            // Modo ver y pais de subsidiaria "PE"
            if (type == 'view' && country_subsidiary_id == 'PE') {

                cargarPagina(scriptContext);
                validarPermiso(scriptContext);
                calcularEficiencia(scriptContext);
            }

            // Modo editar y formulario "BIO_FRM_PROYECTO"
            if (type == 'edit' && form_id == 384) {

                validarPermiso(scriptContext);
                calcularEficiencia(scriptContext);
            }
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        function beforeSubmit(scriptContext) {

            // Obtener el newRecord y type
            let { newRecord, type } = scriptContext;

            // Obtener datos
            let form_id = newRecord.getValue('customform') || null;
            let tipo = newRecord.getValue('custentity_bio_tipo_proyecto') || null;

            // Modo crear y formulario "BIO_FRM_PROYECTO"
            if (type == 'create' && form_id == 384) {

                // Si es tipo "Proyecto"
                if (tipo == 1) {

                    // Obtener correlativo con formato "OP0001"
                    newRecord.setValue('custentity_bio_codigo_proyecto', objHelper.getCorrelativoFormato());
                }
            }
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        function afterSubmit(scriptContext) {

            // Obtener el newRecord y type
            let { newRecord, type } = scriptContext;

            // Obtener datos
            let form_id = newRecord.getValue('customform') || null;
            let tipo = newRecord.getValue('custentity_bio_tipo_proyecto') || null;

            // Modo crear y formulario "BIO_FRM_PROYECTO"
            if (type == 'create' && form_id == 384) {

                // Si es tipo "Proyecto"
                if (tipo == 1) {

                    // Actualizar correlativo
                    objHelper.actualizarCorrelativo();
                }
            }
        }

        function cargarPagina(scriptContext) {

            // Obtener el newRecord y type
            let { newRecord, type, form } = scriptContext;

            // Asociar ClientScript al formulario
            form.clientScriptModulePath = './Bio.Client.ModuloProyectos.js';

            // Obtener datos
            let solicitado_por_id = newRecord.getValue('custentity_bio_solicitado_por');
            let projectmanager_id = newRecord.getValue('projectmanager');
            let project_id = newRecord.getValue('id');
            let status_id = newRecord.getValue('entitystatus');

            // Obtener datos
            let status = scriptContext.request.parameters['_status'];
            let { user } = objHelper.getUser();
            let comite_array = objHelper.getComite();
            let recursos_array = objHelper.getRecursos(project_id);
            let partes_interesadas_array = objHelper.getPartesInteresadas(project_id);

            /****************** Mostrar mensajes ******************/
            if (status?.includes('PROCESS_REQUEST')) {
                form.addPageInitMessage({
                    type: message.Type.INFORMATION,
                    message: `Se envio la solicitud correctamente`,
                    duration: 25000 // 25 segundos
                });
            }

            if (status?.includes('PROCESS_SIGNATURE')) {
                form.addPageInitMessage({
                    type: message.Type.INFORMATION,
                    message: `Se firmo correctamente`,
                    duration: 25000 // 25 segundos
                });
            }

            if (status?.includes('PROCESS_CHANGE_STATUS_EN_CURSO')) {
                form.addPageInitMessage({
                    type: message.Type.INFORMATION,
                    message: `Se actualizo el estado a "En curso". Se inicio el proyecto.`,
                    duration: 25000 // 25 segundos
                })
            }

            /****************** Mostrar botones ******************/
            // Estado diferente de "Cerrado"
            if (status_id != 1) {

                // BOTON SOLICITAR APROBACION - Si es usuario que creo el proyecto
                if (user.id == solicitado_por_id) {
                    if (status_id == 17) { // Estado "Planificado"
                        form.addButton({
                            id: 'custpage_button_solicitar_aprovacion',
                            label: 'Solicitar aprobación',
                            functionName: 'solicitarAprobacion()'
                        });
                    }
                }

                // BOTON APROBAR PROYECTO - Si es jefe directo - Debe disparar un email para solicitar la autorizacion
                if (user.id == projectmanager_id) {
                    if (status_id == 17) { // Estado "Planificado"
                        form.addButton({
                            id: 'custpage_button_aprobar_proyecto',
                            label: 'Aprobar proyecto',
                            functionName: 'aprobarProyecto()'
                        });
                    }
                }

                /******************/

                // BOTON AUTORIZAR PROYECTO - Si es comite - Debe tener alert de tipo prompt para ingresar comentarios
                if (comite_array.includes(user.id)) {
                    if (status_id == 18) { // Estado "Aprobado"
                        form.addButton({
                            id: 'custpage_button_autorizar_proyecto',
                            label: 'Autorizar proyecto',
                            functionName: 'autorizarProyecto()'
                        });
                    }
                }

                /******************/

                // BOTON ESTADO EN CURSO - Si son miembros del proyecto y si el estado del proyecto es "Autorizado"
                if (user.id == solicitado_por_id || user.id == projectmanager_id || comite_array.includes(user.id) || recursos_array.includes(user.id) || partes_interesadas_array.includes(user.id)) {
                    if (status_id == 19) { // Estado "Autorizado"
                        form.addButton({
                            id: 'custpage_button_estado_en_curso',
                            label: 'Actualizar a "En curso"',
                            functionName: 'actualizarEnCurso()'
                        });
                    }
                }

                /******************/

                // BOTON SOLICITAR CIERRE - Si es usuario que creo el proyecto
                if (user.id == solicitado_por_id) {
                    if (status_id == 2) { // Estado "En curso"
                        form.addButton({
                            id: 'custpage_button_solicitar_cierre',
                            label: 'Solicitar cierre',
                            functionName: 'solicitarCierre()'
                        });
                    }
                }

                // BOTON CERRAR PROYECTO - Si es jefe directo o comite - Debe tener alert de tipo prompt para ingresar comentarios
                if (user.id == projectmanager_id || comite_array.includes(user.id)) {
                    if (status_id == 2) { // Estado "En curso"
                        form.addButton({
                            id: 'custpage_button_cerrar_proyecto',
                            label: 'Cerrar proyecto',
                            functionName: 'cerrarProyecto()'
                        });
                    }
                }
            } else if (status_id == 1) { // Estado "Cerrado"

                // BOTON NOTIFICAR PARTES INTERESADAS - Si es usuario que creo el proyecto, jefe directo o comite
                if (user.id == solicitado_por_id || user.id == projectmanager_id || comite_array.includes(user.id)) {
                    form.addButton({
                        id: 'custpage_button_notificar_cierre',
                        label: 'Notificar cierre',
                        functionName: 'notificarCierre()'
                    });
                }
            }

            // BOTON ELIMINAR FIRMAS
            if (comite_array.includes(user.id) || user.role == '3') {
                form.addButton({
                    id: 'custpage_button_eliminar_firmas',
                    label: 'Eliminar firmas',
                    functionName: 'eliminarFirmas()'
                });
            }

            form.addButton({
                id: 'custpage_button_descargar_pdf',
                label: 'PDF',
                functionName: 'descargarPDF()'
            });

            /*
            for (let i = 0; i < 5; i++) {
                form.addButton({
                    id: 'custpage_button_test_boton_dinamico_' + i + '()',
                    label: 'Test Button ' + i,
                    functionName: 'dynamicFunction_' + i + '()'
                });
            }
            */
        }

        function validarPermiso(scriptContext) {

            // Obtener el newRecord y type
            let { newRecord, type, form } = scriptContext;

            // Obtener datos
            let solicitado_por_id = newRecord.getValue('custentity_bio_solicitado_por');
            let projectmanager_id = newRecord.getValue('projectmanager');
            let project_id = newRecord.getValue('id');

            // Obtener datos
            let { user } = objHelper.getUser();
            let comite_array = objHelper.getComite();
            let recursos_array = objHelper.getRecursos(project_id);
            let partes_interesadas_array = objHelper.getPartesInteresadas(project_id);

            /****************** Validar permiso ******************/
            // Validar usuario que puede ver el proyecto
            if (!(user.id == solicitado_por_id || user.id == projectmanager_id || comite_array.includes(user.id) || recursos_array.includes(user.id) || partes_interesadas_array.includes(user.id) || user.role == '3')) {

                objHelper.error_log('Mensaje', 'No esta autorizado');
            }
        }

        function calcularEficiencia(scriptContext) {

            // Obtener el newRecord y type
            let { newRecord, type, form } = scriptContext;

            /****************** Calcular eficiencia ******************/
            // Campo eficiencia
            let fieldEficiencia = form.addField({
                id: 'custpage_field_eficiencia_proyecto',
                label: 'Eficiencia',
                type: 'text'
            });
            fieldEficiencia.updateDisplayType({ displayType: 'INLINE' });

            form.insertField({
                field: fieldEficiencia,
                nextfield: 'custentity_bio_efi_proyecto_hidden' // Ver campo en Netsuite ----> Eficiencia Proyecto Hidden (custentity_bio_efi_proyecto_hidden) ----> https://6462530.app.netsuite.com/app/common/custom/entitycustfield.nl?id=8586
            });

            // Lo realizamos de este modo, ya que esto permitira ver la eficiencia calculada, en el modo ver y editar
            fieldEficiencia.defaultValue = objHelper.getEficiencia(newRecord);
        }

        return { beforeLoad, beforeSubmit, afterSubmit };

    });
