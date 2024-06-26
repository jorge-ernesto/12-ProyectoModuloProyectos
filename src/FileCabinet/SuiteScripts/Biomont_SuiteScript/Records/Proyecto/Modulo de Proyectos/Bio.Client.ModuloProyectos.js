// Notas del archivo:
// - Secuencia de comando:
//      - Biomont CS Modulo Proyectos (customscript_bio_cs_modulo_proyectos)
// - Registro:
//      - Trabajo (job)

// Validación como la usa LatamReady:
// - ClientScript                   : No se ejecuta en modo ver. Solo se ejecuta en modo crear, copiar o editar.
// - En modo crear, copiar o editar : Validamos por el formulario.
// - En modo ver                    : Validamos por el pais de la subsidiaria.

/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { log, currentRecord, url, https, http } = N;

        const scriptId = 'customscript_bio_sl_api_modulo_proyectos';
        const deployId = 'customdeploy_bio_sl_api_modulo_proyectos';

        const scriptDownloadId = 'customscript_bio_sl_mod_proy_des_arc';
        const deployDownloadId = 'customdeploy_bio_sl_mod_proy_des_arc';

        const CONFIG_RECORD = {
            default: {
                fields_mandatory: {
                    // Información principal
                    tipo: {
                        id: 'custentity_bio_tipo_proyecto',
                        label: 'Tipo'
                    }
                }
            },
            proyecto: {
                fields_mandatory: {
                    // Información principal
                    solicitado_por: {
                        id: 'custentity_bio_solicitado_por',
                        label: 'Solicitado por'
                    },
                    manager_proyecto: {
                        id: 'projectmanager',
                        label: 'Mánager de Proyecto'
                    },
                    tipo: {
                        id: 'custentity_bio_tipo_proyecto',
                        label: 'Tipo'
                    },
                    area: {
                        id: 'custentity_bio_area_proyecto',
                        label: 'Área'
                    },
                    codigo: {
                        id: 'custentity_bio_codigo_proyecto',
                        label: 'Código'
                    },
                    nombre: {
                        id: 'companyname',
                        label: 'Nombre'
                    },
                    justificacion: {
                        id: 'custentity_bio_justificacion_proyecto',
                        label: 'Justificación'
                    },
                    descripcion: {
                        id: 'custentity_bio_descripcion_proyecto',
                        label: 'Descripción'
                    },
                    estado: {
                        id: 'entitystatus',
                        label: 'Estado'
                    }
                }
            },
            control_cambio: {
                fields_mandatory: {
                    // Información principal
                    solicitado_por: {
                        id: 'custentity_bio_solicitado_por',
                        label: 'Solicitado por'
                    },
                    manager_proyecto: {
                        id: 'projectmanager',
                        label: 'Mánager de Proyecto'
                    },
                    tipo: {
                        id: 'custentity_bio_tipo_proyecto',
                        label: 'Tipo'
                    },
                    tipo_cambio: {
                        id: 'custentity_bio_tipo_cambio_proyecto',
                        label: 'Tipo de Cambio'
                    },
                    area: {
                        id: 'custentity_bio_area_proyecto',
                        label: 'Área'
                    },
                    // codigo: {
                    //     id: 'custentity_bio_codigo_proyecto',
                    //     label: 'Código'
                    // },
                    nombre: {
                        id: 'companyname',
                        label: 'Nombre'
                    },
                    objeto_cambio: {
                        id: 'custentity_bio_objeto_cambio_proyecto',
                        label: 'Objeto de Cambio'
                    },
                    producto_proceso_relacionado: {
                        id: 'custentity_prod_proc_rela_proyecto',
                        label: 'Producto / Proceso Relacionado'
                    },
                    justificacion: {
                        id: 'custentity_bio_justificacion_proyecto',
                        label: 'Justificación'
                    },
                    descripcion: {
                        id: 'custentity_bio_descripcion_proyecto',
                        label: 'Descripción'
                    },
                    estado: {
                        id: 'entitystatus',
                        label: 'Estado'
                    },
                    // Información adicional
                    proposito_cambio: {
                        id: 'custentity_bio_proposito_cambio_proyecto',
                        label: 'Proposito de Cambio'
                    },
                    beneficio_esperado: {
                        id: 'custentity_bio_benef_esper_proyecto',
                        label: 'Beneficio Esperado'
                    },
                    consecuencias_potenciales: {
                        id: 'custentity_bio_consec_potenc_proyecto',
                        label: 'Consecuencias Potenciales'
                    },
                    recursos: {
                        id: 'custentity_bio_recursos_proyecto',
                        label: 'Recursos'
                    }
                    /*
                    iperc: {
                        id: 'custentity_bio_iperc_proyecto',
                        label: 'IPERC'
                    },
                    ats: {
                        id: 'custentity_bio_ats_proyecto',
                        label: 'ATS'
                    },
                    petar: {
                        id: 'custentity_bio_petar_proyecto',
                        label: 'PETAR'
                    },
                    no_aplica: {
                        id: 'custentity_bio_no_aplica_proyecto',
                        label: 'NO APLICA'
                    },
                    otros: {
                        id: 'custentity_bio_otros_proyecto',
                        label: 'OTROS'
                    },
                    otros_detalle: {
                        id: 'custentity_bio_otros_det_proyecto',
                        label: 'OTROS Descripción'
                    }
                    */
                }
            }
        }

        /******************/

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {

            // Obtener el currentRecord y mode
            let recordContext = scriptContext.currentRecord;
            let mode = scriptContext.mode;

            // Obtener datos
            let form_id = recordContext.getValue('customform') || null;

            // Debug
            console.log('pageInit');
            console.log({ recordContext, mode });

            // Modo crear, editar, copiar y formulario "BIO_FRM_PROYECTO"
            if ((mode == 'create' || mode == 'edit' || mode == 'copy') && form_id == 384) {

                // Cargar campos
                cargarCampos(recordContext, mode);

                // Habilitar campos por tipo
                habilitarCamposPorTipo(recordContext, mode);
            }
        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {

            // Obtener el currentRecord y mode
            let recordContext = scriptContext.currentRecord;
            let mode = recordContext.getValue('id') ? 'edit' : 'create';

            // Obtener datos
            let form_id = recordContext.getValue('customform') || null;

            // Modo crear, editar, copiar y formulario "BIO_FRM_PROYECTO"
            if ((mode == 'create' || mode == 'edit' || mode == 'copy') && form_id == 384) {

                // SE EJECUTA SOLO CUANDO SE HACEN CAMBIOS EN EL COMBO ESTADO ACCION
                if (scriptContext.fieldId == 'custentity_bio_tipo_proyecto') {

                    // Debug
                    console.log('fieldChanged');
                    console.log({ recordContext, mode });

                    // Habilitar campos por tipo
                    habilitarCamposPorTipo(recordContext, mode);
                }
            }
        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {

            // Obtener el currentRecord y mode
            let recordContext = scriptContext.currentRecord;
            let mode = recordContext.getValue('id') ? 'edit' : 'create';

            // Obtener datos
            let form_id = recordContext.getValue('customform') || null;

            // Debug
            console.log('saveRecord');
            console.log({ recordContext, mode });

            // Modo crear, editar, copiar y formulario "BIO_FRM_PROYECTO"
            if ((mode == 'create' || mode == 'edit' || mode == 'copy') && form_id == 384) {

                // Validar campos obligatorios
                if (validarCamposObligatorios(recordContext)) {
                    return false;
                }
            }

            return true;
        }

        /****************** Funcionalidad en campos ******************/

        function cargarCampos(recordContext, mode) {

            console.log('cargarCampos');

            // Modo crear
            if (mode == 'create') {

                // Obtener datos
                let responseData = sendRequest('getDataUser');

                // Cargar campos
                recordContext.setValue('custentity_bio_area_proyecto', responseData.area); // Area del usuario que creo el proyecto
                recordContext.setValue('entitystatus', 17); // Estado "Planificado"
            }
        }

        function habilitarCamposPorTipo(recordContext, mode) {

            console.log('habilitarCamposPorTipo');

            // Deshabilitar todos los campos
            deshabilitarTodosCampos(recordContext, mode);

            /**
             * Funcionalidad para habilitar y deshabilitar campos
             * Tipo - Values.
                - Proyecto: 1
                - Control de Cambio: 2
             */
            // Obtener combo "Tipo"
            let comboTipo = recordContext.getValue('custentity_bio_tipo_proyecto');

            // Debug
            console.log('comboTipo', comboTipo);

            // Habilitar campos "Proyecto"
            if (comboTipo == 1) {
                habilitarCamposProyecto(recordContext, mode);
            }

            // Habilitar campos "Control de Cambio"
            if (comboTipo == 2) {
                habilitarCamposControlCambio(recordContext, mode);
            }
        }

        function deshabilitarTodosCampos(recordContext, mode) {

            // Obtener campo y deshabilitarlo
            // https://6462530-sb1.app.netsuite.com/app/help/helpcenter.nl?fid=section_4625600928.html

            // Deshabilitar campos
            // Información principal
            recordContext.getField('custentity_bio_solicitado_por').isDisabled = true;         // Se deshabilita
            recordContext.getField('projectmanager').isDisabled = true;                        // Se deshabilita
            // recordContext.getField('custentity_bio_tipo_proyecto').isDisabled = true;       // Se deshabilita
            recordContext.getField('custentity_bio_tipo_cambio_proyecto').isDisabled = true;   // Se deshabilita
            recordContext.getField('custentity_bio_area_proyecto').isDisabled = true;          // Se deshabilita
            recordContext.getField('custentity_bio_codigo_proyecto').isDisabled = true;        // Se deshabilita
            recordContext.getField('companyname').isDisabled = true;                           // Se deshabilita
            recordContext.getField('custentity_bio_objeto_cambio_proyecto').isDisabled = true; // Se deshabilita
            recordContext.getField('custentity_prod_proc_rela_proyecto').isDisabled = true;    // Se deshabilita
            recordContext.getField('custentity_bio_justificacion_proyecto').isDisabled = true; // Se deshabilita
            recordContext.getField('custentity_bio_descripcion_proyecto').isDisabled = true;   // Se deshabilita
            recordContext.getField('custentity_bio_notas_proyecto').isDisabled = true;         // Se deshabilita

            // Información adicional
            recordContext.getField('custentity_bio_proposito_cambio_proyecto').isDisabled = true; // Se deshabilita
            recordContext.getField('custentity_bio_benef_esper_proyecto').isDisabled = true;      // Se deshabilita
            recordContext.getField('custentity_bio_consec_potenc_proyecto').isDisabled = true;    // Se deshabilita
            recordContext.getField('custentity_bio_recursos_proyecto').isDisabled = true;         // Se deshabilita
            recordContext.getField('custentity_bio_iperc_proyecto').isDisabled = true;            // Se deshabilita
            recordContext.getField('custentity_bio_ats_proyecto').isDisabled = true;              // Se deshabilita
            recordContext.getField('custentity_bio_petar_proyecto').isDisabled = true;            // Se deshabilita
            recordContext.getField('custentity_bio_no_aplica_proyecto').isDisabled = true;        // Se deshabilita
            recordContext.getField('custentity_bio_otros_proyecto').isDisabled = true;            // Se deshabilita
            recordContext.getField('custentity_bio_otros_det_proyecto').isDisabled = true;        // Se deshabilita

            // Modo editar
            if (mode == 'edit') {
                recordContext.getField('custentity_bio_tipo_proyecto').isDisabled = true;
            }

            // Modo crear
            if (mode == 'create') {
                // Limpiar campos
                // Información principal
                recordContext.setValue('custentity_bio_tipo_cambio_proyecto', '');
                recordContext.setValue('custentity_bio_codigo_proyecto', '');
                recordContext.setValue('custentity_bio_objeto_cambio_proyecto', '');
                recordContext.setValue('custentity_prod_proc_rela_proyecto', '');

                // Información adicional
                recordContext.setValue('custentity_bio_proposito_cambio_proyecto', '');
                recordContext.setValue('custentity_bio_benef_esper_proyecto', '');
                recordContext.setValue('custentity_bio_consec_potenc_proyecto', '');
                recordContext.setValue('custentity_bio_recursos_proyecto', '');
                recordContext.setValue('custentity_bio_iperc_proyecto', false);
                recordContext.setValue('custentity_bio_ats_proyecto', false);
                recordContext.setValue('custentity_bio_petar_proyecto', false);
                recordContext.setValue('custentity_bio_no_aplica_proyecto', false);
                recordContext.setValue('custentity_bio_otros_proyecto', false);
                recordContext.setValue('custentity_bio_otros_det_proyecto', '');
            }
        }

        function habilitarCamposProyecto(recordContext, mode) {

            // Deshabilitar campos
            // Información principal
            recordContext.getField('custentity_bio_solicitado_por').isDisabled = false;         // Se habilita
            recordContext.getField('projectmanager').isDisabled = false;                        // Se habilita
            // recordContext.getField('custentity_bio_tipo_proyecto').isDisabled = false;       // Se habilita
            recordContext.getField('custentity_bio_tipo_cambio_proyecto').isDisabled = true;    // Se deshabilita
            recordContext.getField('custentity_bio_area_proyecto').isDisabled = false;          // Se habilita
            recordContext.getField('custentity_bio_codigo_proyecto').isDisabled = true;         // Se deshabilita
            recordContext.getField('companyname').isDisabled = false;                           // Se habilita
            recordContext.getField('custentity_bio_objeto_cambio_proyecto').isDisabled = true;  // Se deshabilita
            recordContext.getField('custentity_prod_proc_rela_proyecto').isDisabled = true;     // Se deshabilita
            recordContext.getField('custentity_bio_justificacion_proyecto').isDisabled = false; // Se habilita
            recordContext.getField('custentity_bio_descripcion_proyecto').isDisabled = false;   // Se habilita
            recordContext.getField('custentity_bio_notas_proyecto').isDisabled = false;         // Se habilita

            // Información adicional
            recordContext.getField('custentity_bio_proposito_cambio_proyecto').isDisabled = true; // Se deshabilita
            recordContext.getField('custentity_bio_benef_esper_proyecto').isDisabled = true;      // Se deshabilita
            recordContext.getField('custentity_bio_consec_potenc_proyecto').isDisabled = true;    // Se deshabilita
            recordContext.getField('custentity_bio_recursos_proyecto').isDisabled = true;         // Se deshabilita
            recordContext.getField('custentity_bio_iperc_proyecto').isDisabled = true;            // Se deshabilita
            recordContext.getField('custentity_bio_ats_proyecto').isDisabled = true;              // Se deshabilita
            recordContext.getField('custentity_bio_petar_proyecto').isDisabled = true;            // Se deshabilita
            recordContext.getField('custentity_bio_no_aplica_proyecto').isDisabled = true;        // Se deshabilita
            recordContext.getField('custentity_bio_otros_proyecto').isDisabled = true;            // Se deshabilita
            recordContext.getField('custentity_bio_otros_det_proyecto').isDisabled = true;        // Se deshabilita

            // Modo crear
            if (mode == 'create') {
                // Limpiar campos
                recordContext.setValue('custentity_bio_codigo_proyecto', 'A generar');
            }
        }

        function habilitarCamposControlCambio(recordContext, mode) {

            // Deshabilitar campos
            // Información principal
            recordContext.getField('custentity_bio_solicitado_por').isDisabled = false;         // Se habilita
            recordContext.getField('projectmanager').isDisabled = false;                        // Se habilita
            // recordContext.getField('custentity_bio_tipo_proyecto').isDisabled = false;       // Se habilita
            recordContext.getField('custentity_bio_tipo_cambio_proyecto').isDisabled = false;   // Se habilita
            recordContext.getField('custentity_bio_area_proyecto').isDisabled = false;          // Se habilita
            recordContext.getField('custentity_bio_codigo_proyecto').isDisabled = false;        // Se habilita
            recordContext.getField('companyname').isDisabled = false;                           // Se habilita
            recordContext.getField('custentity_bio_objeto_cambio_proyecto').isDisabled = false; // Se habilita
            recordContext.getField('custentity_prod_proc_rela_proyecto').isDisabled = false;    // Se habilita
            recordContext.getField('custentity_bio_justificacion_proyecto').isDisabled = false; // Se habilita
            recordContext.getField('custentity_bio_descripcion_proyecto').isDisabled = false;   // Se habilita
            recordContext.getField('custentity_bio_notas_proyecto').isDisabled = false;         // Se habilita

            // Información adicional
            recordContext.getField('custentity_bio_proposito_cambio_proyecto').isDisabled = false; // Se habilita
            recordContext.getField('custentity_bio_benef_esper_proyecto').isDisabled = false;      // Se habilita
            recordContext.getField('custentity_bio_consec_potenc_proyecto').isDisabled = false;    // Se habilita
            recordContext.getField('custentity_bio_recursos_proyecto').isDisabled = false;         // Se habilita
            recordContext.getField('custentity_bio_iperc_proyecto').isDisabled = false;            // Se habilita
            recordContext.getField('custentity_bio_ats_proyecto').isDisabled = false;              // Se habilita
            recordContext.getField('custentity_bio_petar_proyecto').isDisabled = false;            // Se habilita
            recordContext.getField('custentity_bio_no_aplica_proyecto').isDisabled = false;        // Se habilita
            recordContext.getField('custentity_bio_otros_proyecto').isDisabled = false;            // Se habilita
            recordContext.getField('custentity_bio_otros_det_proyecto').isDisabled = false;        // Se habilita
        }

        function validarCamposObligatorios(recordContext) {

            let mensaje = 'Introduzca valores para:';
            let errores = {};

            // Obtener combo "Tipo"
            let comboTipo = recordContext.getValue('custentity_bio_tipo_proyecto');

            if (!comboTipo) {
                for (var key in CONFIG_RECORD.default.fields_mandatory) {
                    let fieldId = CONFIG_RECORD.default.fields_mandatory[key]['id'];
                    if (!recordContext.getValue(fieldId)) {
                        errores[CONFIG_RECORD.default.fields_mandatory[key]['id']] = CONFIG_RECORD.default.fields_mandatory[key]['label'];
                    };
                }
            }

            // Proyecto
            if (comboTipo == 1) {
                for (var key in CONFIG_RECORD.proyecto.fields_mandatory) {
                    let fieldId = CONFIG_RECORD.proyecto.fields_mandatory[key]['id'];
                    if (!recordContext.getValue(fieldId)) {
                        errores[CONFIG_RECORD.proyecto.fields_mandatory[key]['id']] = CONFIG_RECORD.proyecto.fields_mandatory[key]['label'];
                    };
                }
            }

            // Control de Cambio
            if (comboTipo == 2) {
                for (var key in CONFIG_RECORD.control_cambio.fields_mandatory) {
                    let fieldId = CONFIG_RECORD.control_cambio.fields_mandatory[key]['id'];
                    if (!recordContext.getValue(fieldId)) {
                        errores[CONFIG_RECORD.control_cambio.fields_mandatory[key]['id']] = CONFIG_RECORD.control_cambio.fields_mandatory[key]['label'];
                    };
                }
            }

            if (Object.keys(errores).length > 0) {
                for (let error in errores) {
                    mensaje += ` ${errores[error]},`
                }
                mensaje = mensaje.substring(0, mensaje.length - 1);
                alert(mensaje);
                return true;
            }

            return false;
        }

        /****************** Solicitud HTTP ******************/

        function loadSweetAlertLibrary() {
            return new Promise(function (resolve, reject) {
                var sweetAlertScript = document.createElement('script');
                sweetAlertScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
                sweetAlertScript.onload = resolve;
                document.head.appendChild(sweetAlertScript);
            });
        }

        function getUrlSuitelet() {

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployId,
                scriptId: scriptId
            });

            return suitelet;
        }

        function sendRequestWrapper(method, comentarios = '') {

            // Cargar Sweet Alert
            loadSweetAlertLibrary().then(function () {

                // Ejecutar confirmacion
                Swal.fire({
                    title: "¿Está seguro?",
                    text: "¡Debe confirmar la acción!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Enviar"
                }).then((result) => {
                    if (result.isConfirmed) {

                        // Ejecutar peticion
                        let responseData = sendRequest(method, comentarios);
                        refreshPage(responseData);
                    }
                });
            });
        }

        function sendRequest(method, comentarios = '') {

            // Obtener el id interno del record proyecto
            let recordContext = currentRecord.get();
            let project_id = recordContext.getValue('id');
            let solicitado_por_id = recordContext.getValue('custentity_bio_solicitado_por'); // currentRecord.get(), en un record, en modo ver solo te permite acceder a id o type, en modo crear o editar te permite acceder a todos los campos // Este campo lo enviamos solo en el modo crear, en la funcion "cargarCampos"

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = getUrlSuitelet();

            // Solicitud HTTP
            let response = https.post({
                url: suitelet,
                body: JSON.stringify({
                    _method: method,
                    _project_id: project_id,
                    _solicitado_por_id: solicitado_por_id,
                    _comentarios: comentarios
                })
            });
            let responseData = JSON.parse(response.body);
            console.log('responseData', responseData);

            return responseData;
        }

        function refreshPage(responseData) {

            // Evitar que aparezca el mensaje 'Estas seguro que deseas salir de la pantalla'
            setWindowChanged(window, false);

            // Redirigir a la url
            window.location.href = responseData.urlRecord;
        }

        /****************** Mostrar botones ******************/

        function solicitarAprobacion() {

            sendRequestWrapper('solicitarAprobacion');
        }

        function aprobarProyecto() {

            loadSweetAlertLibrary().then(function () {

                // Aprobar Proyecto / No Aprobar Proyecto
                Swal.fire({
                    title: "Aprobar proyecto",
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Aprobar Proyecto",
                    denyButtonText: `No Aprobar Proyecto`
                }).then((result) => {
                    if (result.isConfirmed) {

                        // Ejecutar peticion
                        sendRequestWrapper('aprobarProyecto');

                    } else if (result.isDenied) {

                        // Ejecutar peticion
                        sendRequestWrapper('noAprobarProyecto');
                    }
                });
            });

        }

        function autorizarProyecto() {

            loadSweetAlertLibrary().then(function () {

                // Autorizar Proyecto / No Autorizar Proyecto
                Swal.fire({
                    title: "Autorizar proyecto",
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Autorizar Proyecto",
                    denyButtonText: `No Autorizar Proyecto`
                }).then((result) => {
                    if (result.isConfirmed) {

                        // Ingrese comentarios
                        Swal.fire({
                            title: "Ingrese comentarios",
                            input: "textarea"
                        }).then((result) => {
                            if (result.isConfirmed) {

                                // Ejecutar peticion
                                sendRequestWrapper('autorizarProyecto', result.value);
                            }
                        });
                    } else if (result.isDenied) {

                        // Ingrese comentarios
                        Swal.fire({
                            title: "Ingrese comentarios",
                            input: "textarea"
                        }).then((result) => {
                            if (result.isConfirmed) {

                                // Ejecutar peticion
                                sendRequestWrapper('noAutorizarProyecto', result.value);
                            }
                        });
                    }
                });
            });
        }

        function actualizarEnCurso() {

            sendRequestWrapper('actualizarEnCurso');
        }

        function solicitarCierre() {

            sendRequestWrapper('solicitarCierre');
        }

        function cerrarProyecto() {

            loadSweetAlertLibrary().then(function () {

                // Cerrar Proyecto
                Swal.fire({
                    title: "Cerrar Proyecto",
                    showCancelButton: true,
                    confirmButtonText: "Cerrar Proyecto",
                    confirmButtonColor: "#d33",
                }).then((result) => {
                    if (result.isConfirmed) {

                        // Ingrese comentarios
                        Swal.fire({
                            title: "Ingrese comentarios",
                            input: "textarea"
                        }).then((result) => {
                            if (result.isConfirmed) {

                                // Ejecutar peticion
                                sendRequestWrapper('cerrarProyecto', result.value);
                            }
                        });
                    }
                });
            });
        }

        function notificarCierre() {

            sendRequestWrapper('notificarCierre');
        }

        function eliminarFirmas() {

            sendRequestWrapper('eliminarFirmas');
        }

        function descargarPDF() {

            // Obtener el id interno del record proyecto
            let recordContext = currentRecord.get();
            let project_id = recordContext.getValue('id');

            // Obtener url del Suitelet mediante ID del Script y ID del Despliegue
            let suitelet = url.resolveScript({
                deploymentId: deployDownloadId,
                scriptId: scriptDownloadId,
                params: {
                    _button: 'pdf',
                    _project_id: project_id
                }
            });

            // Evitar que aparezca el mensaje 'Estas seguro que deseas salir de la pantalla'
            setWindowChanged(window, false);

            // Abrir url
            window.open(suitelet);
        }

        /*
        let dynamicFunctions = {};

        for (let i = 0; i < 5; i++) {
            dynamicFunctions['dynamicFunction_' + i] = function () {
                console.log('Función dinámica con ID: ' + i);

                // Obtener el id interno del record proyecto
                let recordContext = currentRecord.get();
                let project_id = recordContext.getValue('id');
                console.log({ recordContext, project_id });
            };
        }
        */

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            saveRecord: saveRecord,
            solicitarAprobacion: solicitarAprobacion,
            aprobarProyecto: aprobarProyecto,
            autorizarProyecto: autorizarProyecto,
            actualizarEnCurso: actualizarEnCurso,
            solicitarCierre: solicitarCierre,
            cerrarProyecto: cerrarProyecto,
            notificarCierre: notificarCierre,
            eliminarFirmas: eliminarFirmas,
            descargarPDF: descargarPDF
            /*,...dynamicFunctions*/
        };

    });
