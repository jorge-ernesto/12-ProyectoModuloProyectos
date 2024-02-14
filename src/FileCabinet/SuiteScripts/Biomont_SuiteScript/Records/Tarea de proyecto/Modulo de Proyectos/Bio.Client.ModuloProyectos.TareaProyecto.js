// Notas del archivo:
// - Secuencia de comando:
//      - Biomont CS Mod. Proy. Tarea de proyecto (customscript_bio_cs_mod_proy_tarea_proy)
// - Registro:
//      - Tarea de proyecto (projecttask)

// Validación como la usa LatamReady:
// - ClientScript ----> Se ejecuta en modo crear, copiar o editar. No se ejecuta en modo ver.
// - En modo crear o editar ----> Validamos por el formulario.
// - En modo ver ----> Validamos por el pais de la subsidiaria.

/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { log } = N;

        /******************/

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

            // Siempre se ejecuta, ya sea a nivel de cabecera o a nivel de linea (sublista)
            // console.log('fieldChanged', scriptContext);

            // Esta función setValueSubList se encarga de manejar valores por defecto en la sublista
            // Esta funcion no se utiliza, porque hay un campo en "Empleado", subficha "Recursos Humanos", campo "Costo de trabajo" id "laborcost", que carga el campo "unitcost" de la sublista "assignee" de forma estandar por Netsuite
            // setValueSubList(scriptContext);
        }

        function setValueSubList(scriptContext) {

            // Esto se ejecuta cuando se hacen cambios en el campo "resource" de la sublista "assignee"
            if (scriptContext.fieldId == 'resource') {

                // console.log('fieldChanged', scriptContext);
                // console.log('sublistId', scriptContext.sublistId);
                // console.log('line', scriptContext.line);

                // Obtener el currentRecord
                let recordContext = scriptContext.currentRecord;

                // Validar que sea la sublista "assignee"
                if (scriptContext.sublistId == 'assignee') {

                    // Obtener el indice de la linea modificada
                    let line = scriptContext.line;

                    // Obtener resource
                    let resourceId = recordContext.getCurrentSublistValue({
                        sublistId: 'assignee',
                        fieldId: 'resource',
                        line: line
                    });

                    // Validar resource
                    if (resourceId) {

                        // Setear costo unitario
                        recordContext.setCurrentSublistValue({
                            sublistId: 'assignee',
                            fieldId: 'unitcost',
                            line: line,
                            value: 1
                        });
                    }
                }
            }
        }

        return {
            fieldChanged: fieldChanged
        };

    });
