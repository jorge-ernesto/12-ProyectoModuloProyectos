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

            // Siempre se ejecuta, ya sea a nivel de linea (en una sublista) o a nivel de cabecera
            // console.log('fieldChanged', scriptContext);

            // Esta función setValueSubList se encarga de manejar la lógica para establecer el valor "1" en el campo "unitcost" de la sublista "assignee" cuando se agrega información en el campo "resource". Verifica si el cambio se realizó a nivel de línea en la sublista "assignee" y, si se agregó información en el campo "resource", establece automáticamente el valor "1" en el campo "unitcost".
            // Esta funcion no se utiliza, porque hay un campo en "Empleado", subficha "Recursos Humanos", campo "Costo de trabajo" id "laborcost", que carga el campo "unitcost" de la sublista "assignee" de forma estandar por Netsuite
            // setValueSubList(scriptContext);
        }

        function setValueSubList(scriptContext) {

            // Esto se ejecuta cuando se hacen cambios en el campo resource de la sublista assignee
            if (scriptContext.fieldId == 'resource') {

                // Siempre se ejecuta, ya sea a nivel de linea (en una sublista) o a nivel de cabecera
                console.log('fieldChanged', scriptContext);
                console.log('sublistId', scriptContext.sublistId);
                console.log('line', scriptContext.line);

                // Obtener el current record
                let recordContext = scriptContext.currentRecord;

                // Validar que sea la sublista "assignee"
                if (scriptContext.sublistId == 'assignee') {
                    // Obtener el índice de la línea modificada
                    const line = scriptContext.line;

                    // Verificar si se agregó información en el campo "resource"
                    const resourceValue = recordContext.getCurrentSublistValue({
                        sublistId: 'assignee',
                        fieldId: 'resource',
                        line: line
                    });
                    console.log('resourceValue', resourceValue);

                    if (resourceValue) {
                        // Establecer el valor "1" en el campo "unitprice"
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
