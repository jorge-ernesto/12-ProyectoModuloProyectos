// Notas del archivo:
// - Secuencia de comando:
//      - Biomont SL Mod. Proy. Descargar Archivo (customscript_bio_sl_mod_proy_des_arc)

/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['./lib/Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        const { log, file, render, encode, record } = N;

        /******************/

        // Crear PDF
        function createPDF(project_id, project_data) {
            // Nombre del archivo
            let typeRep = 'reporteModuloProyectos';
            let titleDocument = 'Reporte Modulo de Proyectos'

            // Crear PDF - Contenido dinamico
            let pdfContent = file.load('./template/PDF/pdfreport_applying_stylesheets_richard.ftl').getContents();
            let rendererPDF = render.create();
            rendererPDF.templateContent = pdfContent;

            // Enviar datos a PDF
            rendererPDF.addCustomDataSource({
                format: render.DataSource.OBJECT,
                alias: "input",
                data: {
                    data: JSON.stringify({
                        name: titleDocument,
                        project_id: project_id,
                        project_data: project_data,
                        img: 'https://www.biomont.com.pe/storage/img/logo.png'
                    })
                }
            });

            // Crear PDF
            let pdfFile = rendererPDF.renderAsPdf();

            // Reescribir datos de PDF
            pdfFile.name = `biomont_${typeRep}.pdf`;

            return { pdfFile };
        }

        function getData(project_id) {
            // Obtener el record del proyecto
            var projectRecord = record.load({
                type: record.Type.JOB,
                id: project_id
            });

            // Obtener data
            let data = {
                codigo: projectRecord.getValue('custentity_bio_codigo_proyecto'),
                solicitado_por: projectRecord.getText('custentity_usuario_firma_solicitado_por'),
                area: projectRecord.getText('custentity_bio_area_proyecto'),
                fecha_inicio: projectRecord.getValue('startdate'),
                obj_cambio: projectRecord.getText('custentity_bio_obj_cambio_proyecto'),
                prod_proc_rela: projectRecord.getText('custentity_prod_proc_rela_proyecto'),
                justificacion: projectRecord.getText('custentity_bio_justificacion_proyecto'),
                descripcion: projectRecord.getValue('custentity_bio_descripcion_proyecto'),
                aprobado_por: projectRecord.getText('custentity_usuario_firma_aprobado_por'),
                autorizado_por: projectRecord.getText('custentity_usuario_firma_autorizado_por'),
                comentarios_autorizado_por: projectRecord.getValue('custentity_comentarios_autorizado_por'),
                cierre_aprobado_por: projectRecord.getText('custentity_usu_firma_cierre_aprobado_por'),
                coment_cierre_aprobado_por: projectRecord.getValue('custentity_coment_cierre_aprobado_por'),
            }

            return data;
        }

        /******************/

        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(scriptContext) {
            // log.debug('method', scriptContext.request.method);
            // log.debug('parameteres', scriptContext.request.parameters);

            if (scriptContext.request.method == 'GET') {
                // Obtener datos por url
                let button = scriptContext.request.parameters['_button'];
                let project_id = scriptContext.request.parameters['_project_id'];

                if (button == 'pdf') {

                    // Obtener datos
                    let project_data = getData(project_id);

                    // Crear PDF
                    let { pdfFile } = createPDF(project_id, project_data);

                    // Descargar PDF
                    scriptContext.response.writeFile({
                        file: pdfFile
                    });
                }
            }
        }

        return { onRequest }

    });
