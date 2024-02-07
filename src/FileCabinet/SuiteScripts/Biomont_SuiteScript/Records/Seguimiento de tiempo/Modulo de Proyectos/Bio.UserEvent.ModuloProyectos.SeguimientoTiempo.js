// Notas del archivo:
// - Secuencia de comando:
//      - Biomont UE Mod. Proy. Tiempo (customscript_bio_ue_mod_proy_tiempo)
// - Registro:
//      - Tiempo (timebill)

// Validación como la usa LatamReady:
// - ClientScript ----> Se ejecuta en modo crear, copiar o editar. No se ejecuta en modo ver.
// - En modo crear o editar ----> Validamos por el formulario.
// - En modo ver ----> Validamos por el pais de la subsidiaria.

/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['./../../Proyecto/Modulo de Proyectos/lib/Bio.Library.Helper', 'N'],

    function (objHelper, N) {

        const { log, record, runtime } = N;

        /******************/

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
            let projectTaskId = newRecord.getValue('casetaskevent');
            let projectId = newRecord.getValue('customer');
            log.debug('projectTaskId', projectTaskId);
            log.debug('projectId', projectId);

            // Obtener el record de la Tarea del proyecto
            var projectTaskRecord = record.load({
                type: record.Type.PROJECT_TASK,
                id: projectTaskId
            });

            // Obtener el record del proyecto
            var projectRecord = record.load({
                type: record.Type.JOB,
                id: projectId
            });

            // Obtener el usuario logueado
            let user = runtime.getCurrentUser();

            // Obtener datos de la tarea del proyecto
            var percenttimecomplete = projectTaskRecord.getValue('percenttimecomplete');
            log.debug('percenttimecomplete', percenttimecomplete);

            // Enviar correo si la tarea esta completa al 100%
            if (percenttimecomplete == 100) {

                objHelper.sendEmail_NotificarCulminacionTarea(projectRecord, user, projectTaskRecord)
            }
        }

        return { afterSubmit };

    });
