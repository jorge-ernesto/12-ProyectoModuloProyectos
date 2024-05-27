/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 */
define(['N'],

    function (N) {

        const { log, runtime, record, search, url, email } = N;

        function getUser() {
            let user = runtime.getCurrentUser();
            return { user };
        }

        function error_log(title, data) {
            throw `${title} -- ${JSON.stringify(data)}`;
        }

        function error_message(message) {
            throw new Error(`${message}`);
        }

        /****************** Validación ******************/

        function getCountrySubsidiary(subsidiaryId) {
            // Cargar el registro de la subsidiaria
            var subsidiaryRecord = record.load({
                type: record.Type.SUBSIDIARY,
                id: subsidiaryId
            });

            // Obtener el pais del registro de la subsidiaria
            var countrySubsidiary = subsidiaryRecord.getValue('country');

            return countrySubsidiary;
        }

        function getDataUser(projectManagerId) {
            // Cargar el registro del empleado
            var employeeRecord = record.load({
                type: record.Type.EMPLOYEE,
                id: projectManagerId
            });

            // Obtener datos del empleado
            var area = employeeRecord.getValue('department');

            return { area };
        }

        /****************** Records personalizados ******************/

        function getCorrelativo() {
            // Buscar el registro de correlativos por la abreviatura
            var searchObj = search.create({
                type: 'customrecord_bio_conf_correlativos',
                columns: ['custrecord_bio_nro_correlativo_confcorr'],
                filters: [
                    search.createFilter({
                        name: 'custrecord_bio_abreviatura_confcorr',
                        operator: search.Operator.IS,
                        values: 'MOD_PROY' // Reemplazar con el valor de la abreviatura
                    })
                ]
            });

            var searchResult = searchObj.run().getRange(0, 1);
            if (searchResult && searchResult.length > 0) {
                // Obtener el valor actual del correlativo del primer resultado
                var recordId = searchResult[0].id;
                var currentCorrelativo = Number(searchResult[0].getValue('custrecord_bio_nro_correlativo_confcorr'));

                // Debug
                // error_log('getCorrelativo', { recordId, currentCorrelativo });

                return { recordId, currentCorrelativo };
            } else {
                // Manejar el caso en el que no se encuentre el registro
                throw new Error('No se encontro correlativo.');
                return null;
            }
        }

        function getCorrelativoFormato() {
            // Buscar el registro de correlativos por la abreviatura
            var { currentCorrelativo } = getCorrelativo();

            // Aumentar el correlativo en 1 y completar con ceros a la izquierda
            var newCorrelativo = 'OP' + (currentCorrelativo + 1).toString().padStart(4, '0');

            return newCorrelativo;
        }

        function actualizarCorrelativo(currentCorrelativo) {
            // Buscar el registro de correlativos por la abreviatura
            var { recordId, currentCorrelativo } = getCorrelativo();

            // Actualizar el valor del correlativo en el registro encontrado
            record.submitFields({
                type: 'customrecord_bio_conf_correlativos',
                id: recordId,
                values: {
                    'custrecord_bio_nro_correlativo_confcorr': currentCorrelativo + 1
                }
            });
        }

        /****************** Data - Usuarios ******************/

        function getUrlRecord(projectId) {

            let urlRecord = url.resolveRecord({
                recordType: 'job',
                recordId: projectId,
            })

            return { urlRecord };
        }

        function getProjectManager(proyectoRecord) {

            return Number(proyectoRecord.getValue('projectmanager'));
        }

        function getSolicitadoPor(proyectoRecord) {

            return Number(proyectoRecord.getValue('custentity_bio_solicitado_por'));
        }

        function getComite() {

            // Crear un array para almacenar los valores
            var empleadosArray = [];

            // Crear una búsqueda para obtener los registros
            var searchObj = search.create({
                type: 'customrecord_bio_conf_proy_com',
                columns: ['custrecord_bio_empleado_confproycom'],
                filters: [
                    search.createFilter({
                        name: 'isinactive',
                        operator: search.Operator.IS,
                        values: 'F' // F para registros activos
                    })
                ]
            });

            // Ejecutar la búsqueda y recorrer los resultados
            searchObj.run().each(function (result) {
                var empleadoValue = result.getValue('custrecord_bio_empleado_confproycom');
                empleadosArray.push(Number(empleadoValue));
                return true;
            });

            return empleadosArray;
        }

        function getPartesInteresadas(projectId) {

            // Crear un array para almacenar los valores
            var empleadosArray = [];

            // Crear una búsqueda para obtener los registros
            var searchObj = search.create({
                type: 'customrecord_bio_conf_proy_emp',
                columns: ['custrecord_bio_empleado_confproyemp'],
                filters: [
                    search.createFilter({
                        name: 'isinactive',
                        operator: search.Operator.IS,
                        values: 'F' // F para registros activos
                    }),
                    search.createFilter({
                        name: 'custrecord_bio_proyecto_confproyemp',
                        operator: search.Operator.ANYOF,
                        values: projectId
                    })
                ]
            });

            // Ejecutar la búsqueda y recorrer los resultados
            searchObj.run().each(function (result) {
                var empleadoValue = result.getValue('custrecord_bio_empleado_confproyemp');
                empleadosArray.push(Number(empleadoValue));
                return true;
            });

            return empleadosArray;
        }

        function getRecursos(projectId) {

            // Crear un array para almacenar los valores
            var empleadosArray = [];

            // Crear una búsqueda para obtener los registros
            var searchObj = search.create({
                type: 'job',
                columns: [
                    search.createColumn({
                        name: "entityid",
                        sort: search.Sort.ASC,
                        label: "ID"
                    }),
                    search.createColumn({ name: "altname", label: "Nombre" }),
                    search.createColumn({ name: "jobresource", label: "Recurso de trabajo" }),
                    search.createColumn({ name: "jobresourcerole", label: "Rol de recurso de trabajo" })
                ],
                filters: [
                    search.createFilter({
                        name: 'internalid',
                        operator: search.Operator.ANYOF,
                        values: projectId
                    })
                ]
            });

            // Ejecutar la búsqueda y recorrer los resultados
            searchObj.run().each(function (result) {
                var empleadoValue = result.getValue('jobresource');
                empleadosArray.push(Number(empleadoValue));
                return true;
            });

            return empleadosArray;
        }

        function getRecursosProximaTarea(projectId, projectTaskId) {

            // Obtener tareas
            let dataTareas = getTareas(projectId);
            let filterDataTareas = dataTareas.filter(item => item.es_tarea_resumen == false);

            // Debug
            // error_log('dataTareas', dataTareas);
            // error_log('filterDataTareas', filterDataTareas);

            // Obtener recursos de la proxima tarea
            let recursos = [];
            let recursosId = [];
            let nextIndex = filterDataTareas.findIndex(item => item.tarea.id_interno == projectTaskId); // Encontrar indice de la tarea actual, findIndex, si no encuentra indice retorna -1
            if (nextIndex >= 0) { // Validar que encontro indice de la tarea actual
                nextIndex = nextIndex + 1; // Obtener indice de la tarea siguiente
                if (nextIndex < filterDataTareas.length) { // Validar que exista indice de la tarea siguiente
                    recursos = filterDataTareas[nextIndex]['recursos'];
                    recursosId = recursos.map(item => Number(item.recurso.id));
                }
            }

            // Debug
            // error_log('debug', { nextIndex, recursosId });

            return recursosId;
        }

        /****************** Data - PDF ******************/

        function getTareas(projectId) {

            // Crear un array para almacenar los valores
            let tareasArray = [];

            // Crear una búsqueda para obtener los registros
            let searchObj = search.create({
                type: 'job',
                columns: [
                    search.createColumn({
                        name: "internalid",
                        sort: search.Sort.ASC,
                        label: "ID interno"
                    }),
                    search.createColumn({ name: "companyname", label: "Nombre del trabajo" }),
                    search.createColumn({
                        name: "internalid",
                        join: "projectTask",
                        label: "ID interno"
                    }),
                    search.createColumn({
                        name: "id",
                        join: "projectTask",
                        sort: search.Sort.ASC,
                        label: "ID"
                    }),
                    search.createColumn({
                        name: "title",
                        join: "projectTask",
                        label: "Nombre"
                    }),
                    search.createColumn({
                        name: "startdate",
                        join: "projectTask",
                        label: "Fecha de inicio"
                    }),
                    search.createColumn({
                        name: "enddate",
                        join: "projectTask",
                        label: "Fecha de finalización"
                    }),
                    search.createColumn({
                        name: "plannedwork",
                        join: "projectTask",
                        label: "Trabajo planificado"
                    }),
                    search.createColumn({
                        name: "calculatedwork",
                        join: "projectTask",
                        label: "Trabajo calculado"
                    }),
                    search.createColumn({
                        name: "percentworkcomplete",
                        join: "projectTask",
                        label: "Porcentaje de trabajo completado"
                    }),
                    search.createColumn({
                        name: "issummarytask",
                        join: "projectTask",
                        label: "Es tarea resumen"
                    })
                ],
                filters: [
                    search.createFilter({
                        name: 'internalid',
                        operator: search.Operator.ANYOF,
                        values: projectId
                    })
                ]
            });

            // Ejecutar la búsqueda y recorrer los resultados
            searchObj.run().each(function (result) {
                // Obtener informacion
                let { columns } = result;
                let proyecto_id_interno = result.getValue(columns[0])
                let proyecto_nombre = result.getValue(columns[1]);
                let tarea_id_interno = result.getValue(columns[2]);
                let tarea_id = result.getValue(columns[3]);
                let tarea_nombre = result.getValue(columns[4]);
                let fecha_inicio = result.getValue(columns[5]); // Fecha de inicio - planificada
                let fecha_finalizacion = result.getValue(columns[6]); // Fecha de finalizacion - planificada
                let trabajo_planificado = result.getValue(columns[7]);
                let trabajo_calculado = result.getValue(columns[8]);
                let porcentaje_completado = result.getValue(columns[9]);
                let es_tarea_resumen = result.getValue(columns[10]);

                // Procesar informacion
                // Obtener nombre de las tareas y eliminar texto antes del separador ' : ' para obtener un nombre limpio.
                let index = tarea_nombre.indexOf(' : ');
                if (index > 0) {
                    tarea_nombre = tarea_nombre.substring(index + 3);
                }

                // Obtener recursos de las tareas
                let tareasPersonasAsignadasArray = getTareasPersonasAsignadas(projectId);
                let tareasPersonasAsignadasArray_ = agruparTareasPersonasAsignadas(tareasPersonasAsignadasArray);
                // error_log('tareasPersonasAsignadasArray', tareasPersonasAsignadasArray);
                // error_log('tareasPersonasAsignadasArray_', tareasPersonasAsignadasArray_);
                let recursos = tareasPersonasAsignadasArray_[proyecto_id_interno]?.[tarea_id];
                let recursos_nombres = tareasPersonasAsignadasArray_[proyecto_id_interno]?.[tarea_id]?.[0]?.['recursos_nombres'];
                let recursos_cantidad = tareasPersonasAsignadasArray_[proyecto_id_interno]?.[tarea_id].length;

                // Obtener horas del calendario predeterminado
                let dataCalendarioPredeterminado = getDataCalendarioPredeterminado() || { 'horas_calendario_predeterminado': 24 }; // Por defecto 24 horas, es decir no hay limite de horas por dia

                // Obtener fecha finalizacion - real
                let fecha_finalizacion_real = getFechaFinalizacionRealByTareas(fecha_inicio, trabajo_calculado, recursos_cantidad, dataCalendarioPredeterminado);

                // Validacion en consola del navegador
                // let prueba = {};
                // prueba['a']; // No genera error
                // prueba['a']['b']; // Generar error
                // prueba[1]; // No generar error
                // prueba[1][2]; // Generar error

                // Insertar informacion en array
                tareasArray.push({
                    proyecto: { id_interno: proyecto_id_interno, nombre: proyecto_nombre },
                    tarea: { id_interno: tarea_id_interno, id: tarea_id, nombre: tarea_nombre },
                    fecha_inicio: fecha_inicio,
                    fecha_finalizacion: fecha_finalizacion,
                    trabajo_planificado: trabajo_planificado,
                    trabajo_calculado: trabajo_calculado,
                    porcentaje_completado: porcentaje_completado,
                    es_tarea_resumen: es_tarea_resumen,
                    recursos: recursos,
                    recursos_nombres: recursos_nombres,
                    recursos_cantidad: recursos_cantidad,
                    horas_calendario_predeterminado: dataCalendarioPredeterminado.horas_calendario_predeterminado,
                    fecha_finalizacion_real: fecha_finalizacion_real
                });
                return true;
            });

            // error_log('getTareas', tareasArray);
            return tareasArray;
        }

        function getTareasPersonasAsignadas(projectId) {

            // Crear un array para almacenar los valores
            let tareasPersonasAsignadasArray = [];

            // Crear una búsqueda para obtener los registros
            let searchObj = search.create({
                type: 'projecttask',
                columns: [
                    search.createColumn({
                        name: "internalid",
                        join: "job",
                        sort: search.Sort.ASC,
                        label: "ID interno"
                    }),
                    search.createColumn({
                        name: "companyname",
                        join: "job",
                        label: "Nombre del trabajo"
                    }),
                    search.createColumn({ name: "internalid", label: "ID interno" }),
                    search.createColumn({
                        name: "id",
                        sort: search.Sort.ASC,
                        label: "ID"
                    }),
                    search.createColumn({ name: "title", label: "Nombre" }),
                    search.createColumn({
                        name: "resourcename",
                        join: "projectTaskAssignment",
                        label: "Nombre del recurso"
                    }),
                    search.createColumn({
                        name: "formulatext",
                        formula: "LISTAGG ( DISTINCT {projecttaskassignment.resourcename} , ', ' ) OVER (PARTITION BY {job.internalid}, {id})",
                        label: "Fórmula (texto)"
                    })
                ],
                filters: [
                    ["job.internalid", "anyof", projectId]
                    // search.createFilter({
                    //     name: 'job.internalid',
                    //     operator: search.Operator.ANYOF,
                    //     values: projectId
                    // })
                ]
            });

            // Ejecutar la búsqueda y recorrer los resultados
            searchObj.run().each(function (result) {
                // Obtener informacion
                let { columns } = result;
                let proyecto_id_interno = result.getValue(columns[0]);
                let proyecto_nombre = result.getValue(columns[1]);
                let tarea_id_interno = result.getValue(columns[2]);
                let tarea_id = result.getValue(columns[3]);
                let tarea_nombre = result.getValue(columns[4]);
                let recurso_id_interno = result.getValue(columns[5]);
                let recurso_nombre = result.getText(columns[5]);
                let recursos_nombres = result.getValue(columns[6])

                // Insertar informacion en array
                tareasPersonasAsignadasArray.push({
                    proyecto: { id_interno: proyecto_id_interno, nombre: proyecto_nombre },
                    tarea: { id_interno: tarea_id_interno, id: tarea_id, nombre: tarea_nombre },
                    recurso: { id: recurso_id_interno, nombre: recurso_nombre },
                    recursos_nombres: recursos_nombres,
                });
                return true;
            });

            return tareasPersonasAsignadasArray;
        }

        function agruparTareasPersonasAsignadas(tareasPersonasAsignadasArray) {

            // Obtener data en formato agrupado
            let dataAgrupada = {}; // * Audit: Util, manejo de JSON

            tareasPersonasAsignadasArray.forEach(element => {

                // Obtener variables
                let proyecto_id_interno = element.proyecto.id_interno;
                let tarea_id = element.tarea.id;

                // Agrupar data
                dataAgrupada[proyecto_id_interno] = dataAgrupada[proyecto_id_interno] || {};
                dataAgrupada[proyecto_id_interno][tarea_id] = dataAgrupada[proyecto_id_interno][tarea_id] || []; // * Audit, manejo de Array
                dataAgrupada[proyecto_id_interno][tarea_id].push(element);

                // Otra forma
                // dataAgrupada[proyecto_id_interno] ??= {};
                // dataAgrupada[proyecto_id_interno][tarea_id] ??= [];
                // dataAgrupada[proyecto_id_interno][tarea_id].push(element);
            });

            return dataAgrupada;
        }

        function getDataCalendarioPredeterminado() {

            // Crear un json para almacenar los valores
            var dataCalendarioPredeterminado = {};

            // Crear una búsqueda para obtener los registros
            var searchObj = search.create({
                type: 'workcalendar',
                columns: ['workhoursperday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
                filters: [
                    search.createFilter({
                        name: 'isdefault',
                        operator: search.Operator.IS,
                        values: 'T' // T para registro predeterminado
                    })
                ]
            });

            // Ejecutar la búsqueda y recorrer los resultados
            searchObj.run().each(function (result) {
                // Obtener informacion
                let { columns } = result;
                let horas_calendario_predeterminado = result.getValue(columns[0]);
                let domingo = result.getValue(columns[1]);
                let lunes = result.getValue(columns[2]);
                let martes = result.getValue(columns[3]);
                let miercoles = result.getValue(columns[4]);
                let jueves = result.getValue(columns[5]);
                let viernes = result.getValue(columns[6]);
                let sabado = result.getValue(columns[7]);

                // Insertar informacion en json
                dataCalendarioPredeterminado = {
                    'horas_calendario_predeterminado': horas_calendario_predeterminado,
                    'domingo': domingo,
                    'lunes': lunes,
                    'martes': martes,
                    'miercoles': miercoles,
                    'jueves': jueves,
                    'viernes': viernes,
                    'sabado': sabado,
                }

                // Detener la búsqueda
                return false;
            });

            // error_log('dataCalendarioPredeterminado', dataCalendarioPredeterminado);
            return dataCalendarioPredeterminado;
        }

        function getFechaFinalizacionRealByTareas(fecha_inicio, trabajo_calculado, recursos_cantidad, dataCalendarioPredeterminado) {

            // Obtener cantidad de dias
            let horasPorPersona = trabajo_calculado / recursos_cantidad;
            let diasTrabajo = Math.ceil(horasPorPersona / dataCalendarioPredeterminado.horas_calendario_predeterminado);

            // Convertir la fecha de inicio al formato de Date
            let partesFecha = fecha_inicio.split('/');
            let fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]); // El mes se resta en 1 porque en JavaScript los meses van de 0 a 11

            // Sumar los días de trabajo a la fecha de inicio
            // fecha.setDate(fecha.getDate() + diasTrabajo);

            // Sumar los días de trabajo a la fecha de inicio, incluyendo el día de inicio (restando 1 dia a los dias añadidos), excluyendo los fines de semana (sumando 1 dia si es sabado o domingo)
            // for (let i = 0; i < diasTrabajo - 1; i++) {
            //     fecha.setDate(fecha.getDate() + 1);
            //     while (fecha.getDay() === 0 || fecha.getDay() === 6) { // 0: Domingo, 6: Sábado // Se usa while porque si hay dos dias no laborables seguidos los actualiza porque sigue validandolo
            //         fecha.setDate(fecha.getDate() + 1);
            //     }
            // }

            // Sumar los días de trabajo a la fecha de inicio, incluyendo el día de inicio (restando 1 dia a los dias añadidos), excluyendo los fines de semana (sumando 1 dia si es sabado o domingo)
            for (let i = 0; i < diasTrabajo - 1; i++) {
                fecha.setDate(fecha.getDate() + 1);
                while (dataCalendarioPredeterminado[getNombreDia(fecha.getDay())] === false) { // Dias no laborables // Se usa while porque si hay dos dias no laborables seguidos los actualiza porque sigue validandolo
                    fecha.setDate(fecha.getDate() + 1);
                }
            }

            // Formatear la fecha de finalización en "DD/MM/AAAA"
            let dia = fecha.getDate().toString().padStart(2, '0');
            let mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
            let año = fecha.getFullYear();
            let fechaFinal = `${dia}/${mes}/${año}`;

            return fechaFinal;
        }

        function getNombreDia(numeroDia) {
            const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
            return diasSemana[numeroDia];
        }

        function getDivulgacionDeCambio(projectId) {

            // Obtener array de id de empleados
            let empleadosId = getPartesInteresadas(projectId);
            // error_log('empleadosId', empleadosId);

            // El array no esta definido o está vacío
            if (!empleadosId || Object.keys(empleadosId).length == 0) {
                empleadosId = '@NONE@'
            }

            // Crear un array para almacenar los valores
            var empleadosArray = [];

            // Crear una búsqueda para obtener los registros
            var searchObj = search.create({
                type: 'employee',
                columns: ['entityid', 'firstname', 'department', 'email'],
                filters: [
                    search.createFilter({
                        name: 'internalid',
                        operator: search.Operator.ANYOF,
                        values: empleadosId
                    })
                ]
            });

            // Ejecutar la búsqueda y recorrer los resultados
            searchObj.run().each(function (result) {
                // Obtener informacion
                let { columns } = result;
                let entityid = result.getValue(columns[0])
                let firstname = result.getValue(columns[1])
                let department = result.getText(columns[2]);
                let email = result.getValue(columns[3]);

                // Insertar informacion en array
                empleadosArray.push({
                    entityid: entityid,
                    firstname: firstname,
                    department: department,
                    email: email,
                });
                return true;
            });

            // error_log('empleadosArray', empleadosArray);
            return empleadosArray;
        }

        function getResumenProyecto(proyectoRecord, dataTareas) {

            // error_log('dataTareas', dataTareas);

            // Declarar variables
            let cantidad_actividades_realizadas = 0;
            let horas_totales = 0
            let eficiencia = getEficiencia(proyectoRecord);
            let fecha_inicio = proyectoRecord.getText('startdate');
            let fecha_finalizacion = proyectoRecord.getText('calculatedenddate');

            // Obtener cantidad de actividades realizadas
            dataTareas.forEach(element => {
                if (element.es_tarea_resumen == false || element.es_tarea_resumen == 0) {
                    if (element.porcentaje_completado == '100.0%' || element.porcentaje_completado == '100.00%' || element.porcentaje_completado == '100%' || element.porcentaje_completado == 100) {
                        cantidad_actividades_realizadas++;
                        horas_totales = horas_totales + Number(element.trabajo_calculado);
                    }
                }
            });

            return { cantidad_actividades_realizadas, horas_totales, eficiencia, fecha_inicio, fecha_finalizacion }
        }

        function getEficiencia(proyectoRecord) {

            // Obtener datos
            let estado = proyectoRecord.getValue('entitystatus');
            let trabajo_planificado = proyectoRecord.getValue('plannedwork') || 0;
            let trabajo_calculado = proyectoRecord.getValue('calculatedwork') || 0;

            // Validar estado
            if (estado == 1) { // Estado "Cerrado"

                // Obtener eficiencia
                let eficiencia = 0;
                if (trabajo_calculado > 0) {
                    eficiencia = ((trabajo_planificado / trabajo_calculado) * 100).toFixed(1) + '%';
                } else {
                    eficiencia = eficiencia.toFixed(1) + '%';
                }
                return eficiencia;
            }

            return "-";
        }

        /****************** Email ******************/

        function sendEmail_SolicitarAprobacion(proyectoRecord, user) {

            // Obtener datos
            let tipo = proyectoRecord.getValue('custentity_bio_tipo_proyecto');
            let descTipoMayus = (tipo == 2) ? 'Control de Cambio' : 'Proyecto';
            let descTipoMinus = (tipo == 2) ? 'control de cambio' : 'proyecto';

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let projectManager = getProjectManager(proyectoRecord);
            recipients = recipients.concat(projectManager);
            recipients = [...new Set(recipients)];
            recipients = recipients.filter(recipient => recipient != 0); // Elimina del array los 0

            // Validar regla "Se permite un máximo de 10 destinatarios ( options.recipients+ options.cc+ ).options.bcc"
            let groups_recipients = [];
            while (recipients.length > 0) {
                groups_recipients.push(recipients.splice(0, 10));
            }

            groups_recipients.forEach(recipients => {

                // Enviar email
                if (Object.keys(recipients).length > 0) {
                    email.send({
                        author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                        recipients: recipients,
                        subject: `[${descTipoMayus}] Notificación para aprobar`,
                        body: `
                            El usuario <b>"${user.name}"</b> ha creado el ${descTipoMinus} "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                            Concepto: Aprobación de ${descTipoMinus}.<br /><br />
                            Nombre ${descTipoMayus}: ${proyectoRecord.getValue('companyname')}<br /><br />
                            Link: <a href="${urlRecord}">${urlRecord}</a>
                        `
                    });
                }
            });
        }

        function sendEmail_AprobarProyecto(proyectoRecord, user) {

            // Obtener datos
            let tipo = proyectoRecord.getValue('custentity_bio_tipo_proyecto');
            let descTipoMayus = (tipo == 2) ? 'Control de Cambio' : 'Proyecto';
            let descTipoMinus = (tipo == 2) ? 'control de cambio' : 'proyecto';

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let solicitadoPor = getSolicitadoPor(proyectoRecord);
            recipients = recipients.concat(solicitadoPor);
            recipients = [...new Set(recipients)];
            recipients = recipients.filter(recipient => recipient != 0); // Elimina del array los 0

            // Validar regla "Se permite un máximo de 10 destinatarios ( options.recipients+ options.cc+ ).options.bcc"
            let groups_recipients = [];
            while (recipients.length > 0) {
                groups_recipients.push(recipients.splice(0, 10));
            }

            groups_recipients.forEach(recipients => {

                // Enviar email
                if (Object.keys(recipients).length > 0) {
                    email.send({
                        author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                        recipients: recipients,
                        subject: `[${descTipoMayus}] Notificación de aprobación`,
                        body: `
                            El usuario <b>"${user.name}"</b> ha aprobado el ${descTipoMinus} "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                            Concepto: Aprobación de ${descTipoMinus}.<br /><br />
                            Nombre ${descTipoMayus}: ${proyectoRecord.getValue('companyname')}<br /><br />
                            Link: <a href="${urlRecord}">${urlRecord}</a>
                        `
                    });
                }
            });
        }

        function sendEmail_NoAprobarProyecto(proyectoRecord, user) {

            // Obtener datos
            let tipo = proyectoRecord.getValue('custentity_bio_tipo_proyecto');
            let descTipoMayus = (tipo == 2) ? 'Control de Cambio' : 'Proyecto';
            let descTipoMinus = (tipo == 2) ? 'control de cambio' : 'proyecto';

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let solicitadoPor = getSolicitadoPor(proyectoRecord);
            recipients = recipients.concat(solicitadoPor);
            recipients = [...new Set(recipients)];
            recipients = recipients.filter(recipient => recipient != 0); // Elimina del array los 0

            // Validar regla "Se permite un máximo de 10 destinatarios ( options.recipients+ options.cc+ ).options.bcc"
            let groups_recipients = [];
            while (recipients.length > 0) {
                groups_recipients.push(recipients.splice(0, 10));
            }

            groups_recipients.forEach(recipients => {

                // Enviar email
                if (Object.keys(recipients).length > 0) {
                    email.send({
                        author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                        recipients: recipients,
                        subject: `[${descTipoMayus}] Notificación de no aprobación`,
                        body: `
                            El usuario <b>"${user.name}"</b> ha rechazado el ${descTipoMinus} "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                            Concepto: Aprobación de ${descTipoMinus}.<br /><br />
                            Nombre ${descTipoMayus}: ${proyectoRecord.getValue('companyname')}<br /><br />
                            Link: <a href="${urlRecord}">${urlRecord}</a>
                        `
                    });
                }
            });
        }

        function sendEmail_SolicitarAutorizacion(proyectoRecord, user) {

            // Obtener datos
            let tipo = proyectoRecord.getValue('custentity_bio_tipo_proyecto');
            let descTipoMayus = (tipo == 2) ? 'Control de Cambio' : 'Proyecto';
            let descTipoMinus = (tipo == 2) ? 'control de cambio' : 'proyecto';

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let comiteArray = getComite();
            log.debug('data', comiteArray);
            recipients = recipients.concat(comiteArray);
            recipients = [...new Set(recipients)];
            recipients = recipients.filter(recipient => recipient != 0); // Elimina del array los 0

            // Validar regla "Se permite un máximo de 10 destinatarios ( options.recipients+ options.cc+ ).options.bcc"
            let groups_recipients = [];
            while (recipients.length > 0) {
                groups_recipients.push(recipients.splice(0, 10));
            }

            groups_recipients.forEach(recipients => {

                // Enviar email
                if (Object.keys(recipients).length > 0) {
                    email.send({
                        author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                        recipients: recipients,
                        subject: `[${descTipoMayus}] Notificación para autorizar`,
                        body: `
                            El usuario <b>"${user.name}"</b> ha aprobado el ${descTipoMinus} "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                            Revisar la autorización.<br /><br />
                            Concepto: Autorización de ${descTipoMinus}.<br /><br />
                            Nombre ${descTipoMayus}: ${proyectoRecord.getValue('companyname')}<br /><br />
                            Link: <a href="${urlRecord}">${urlRecord}</a>
                        `
                    });
                }
            });
        }

        function sendEmail_AutorizarProyecto(proyectoRecord, user) {

            // Obtener datos
            let tipo = proyectoRecord.getValue('custentity_bio_tipo_proyecto');
            let descTipoMayus = (tipo == 2) ? 'Control de Cambio' : 'Proyecto';
            let descTipoMinus = (tipo == 2) ? 'control de cambio' : 'proyecto';

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];

            if (proyectoRecord.getValue('custentity_bio_tipo_proyecto') == 1) { // Si es proyecto

                let recursosArray = getRecursos(proyectoRecord.getValue('id'));
                let projectManager = getProjectManager(proyectoRecord);
                let solicitadoPor = getSolicitadoPor(proyectoRecord);
                log.debug('data', { recursosArray, projectManager, solicitadoPor });
                recipients = recipients.concat(recursosArray).concat(projectManager).concat(solicitadoPor);
                recipients = [...new Set(recipients)];
                recipients = recipients.filter(recipient => recipient != 0); // Elimina del array los 0
            } else if (proyectoRecord.getValue('custentity_bio_tipo_proyecto') == 2) { // Si es control de cambio

                let recursosArray = getRecursos(proyectoRecord.getValue('id'));
                let projectManager = getProjectManager(proyectoRecord);
                let solicitadoPor = getSolicitadoPor(proyectoRecord);
                let partesInteresadasArray = getPartesInteresadas(proyectoRecord.getValue('id'));
                let comiteArray = getComite();
                log.debug('data', { recursosArray, projectManager, solicitadoPor, partesInteresadasArray, comiteArray });
                recipients = recipients.concat(recursosArray).concat(projectManager).concat(solicitadoPor).concat(partesInteresadasArray).concat(comiteArray);
                recipients = [...new Set(recipients)];
                recipients = recipients.filter(recipient => recipient != 0); // Elimina del array los 0
            }

            // Validar regla "Se permite un máximo de 10 destinatarios ( options.recipients+ options.cc+ ).options.bcc"
            let groups_recipients = [];
            while (recipients.length > 0) {
                groups_recipients.push(recipients.splice(0, 10));
            }

            groups_recipients.forEach(recipients => {

                // Enviar email
                if (Object.keys(recipients).length > 0) {
                    email.send({
                        author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                        recipients: recipients,
                        subject: `[${descTipoMayus}] Notificación de autorización`,
                        body: `
                            El usuario <b>"${user.name}"</b> ha autorizado el ${descTipoMinus} "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                            Concepto: Autorización de ${descTipoMinus}.<br /><br />
                            Nombre ${descTipoMayus}: ${proyectoRecord.getValue('companyname')}<br /><br />
                            Link: <a href="${urlRecord}">${urlRecord}</a>
                        `
                    });
                }
            });
        }

        function sendEmail_NoAutorizarProyecto(proyectoRecord, user) {

            // Obtener datos
            let tipo = proyectoRecord.getValue('custentity_bio_tipo_proyecto');
            let descTipoMayus = (tipo == 2) ? 'Control de Cambio' : 'Proyecto';
            let descTipoMinus = (tipo == 2) ? 'control de cambio' : 'proyecto';

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let projectManager = getProjectManager(proyectoRecord);
            let solicitadoPor = getSolicitadoPor(proyectoRecord);
            recipients = recipients.concat(projectManager).concat(solicitadoPor);
            recipients = [...new Set(recipients)];
            recipients = recipients.filter(recipient => recipient != 0); // Elimina del array los 0

            // Validar regla "Se permite un máximo de 10 destinatarios ( options.recipients+ options.cc+ ).options.bcc"
            let groups_recipients = [];
            while (recipients.length > 0) {
                groups_recipients.push(recipients.splice(0, 10));
            }

            groups_recipients.forEach(recipients => {

                // Enviar email
                if (Object.keys(recipients).length > 0) {
                    email.send({
                        author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                        recipients: recipients,
                        subject: `[${descTipoMayus}] Notificación de no autorizacion`,
                        body: `
                            El usuario <b>"${user.name}"</b> ha rechazado el ${descTipoMinus} "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                            Concepto: Autorizacion de ${descTipoMinus}.<br /><br />
                            Nombre ${descTipoMayus}: ${proyectoRecord.getValue('companyname')}<br /><br />
                            Link: <a href="${urlRecord}">${urlRecord}</a>
                        `
                    });
                }
            });
        }

        function sendEmail_ActualizarEnCurso(proyectoRecord, user) {

            // Obtener datos
            let tipo = proyectoRecord.getValue('custentity_bio_tipo_proyecto');
            let descTipoMayus = (tipo == 2) ? 'Control de Cambio' : 'Proyecto';
            let descTipoMinus = (tipo == 2) ? 'control de cambio' : 'proyecto';

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let recursosArray = getRecursos(proyectoRecord.getValue('id'));
            let projectManager = getProjectManager(proyectoRecord);
            let solicitadoPor = getSolicitadoPor(proyectoRecord);
            let comiteArray = getComite();
            recipients = recipients.concat(recursosArray).concat(projectManager).concat(solicitadoPor).concat(comiteArray);
            recipients = [...new Set(recipients)];
            recipients = recipients.filter(recipient => recipient != 0); // Elimina del array los 0

            // Validar regla "Se permite un máximo de 10 destinatarios ( options.recipients+ options.cc+ ).options.bcc"
            let groups_recipients = [];
            while (recipients.length > 0) {
                groups_recipients.push(recipients.splice(0, 10));
            }

            groups_recipients.forEach(recipients => {

                // Enviar email
                if (Object.keys(recipients).length > 0) {
                    email.send({
                        author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                        recipients: recipients,
                        subject: `[${descTipoMayus}] Notificación de inicio`,
                        body: `
                            El usuario <b>"${user.name}"</b> ha iniciado el ${descTipoMinus} "${proyectoRecord.getValue('companyname')}".<br /><br />
                            Link: <a href="${urlRecord}">${urlRecord}</a>
                        `
                    });
                }
            });
        }

        function sendEmail_NotificarCulminacionTarea(proyectoRecord, user, proyectoTareaRecord) {

            // Obtener datos
            let tipo = proyectoRecord.getValue('custentity_bio_tipo_proyecto');
            let descTipoMayus = (tipo == 2) ? 'Control de Cambio' : 'Proyecto';
            let descTipoMinus = (tipo == 2) ? 'control de cambio' : 'proyecto';

            // Obtener datos
            let tarea_titulo = proyectoTareaRecord.getValue('title');

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            if (tipo == 1) { // Proyecto

                // Obtener empleados
                let recursosArray = getRecursos(proyectoRecord.getValue('id'));
                let projectManager = getProjectManager(proyectoRecord);
                let solicitadoPor = getSolicitadoPor(proyectoRecord);
                let partesInteresadasArray = getPartesInteresadas(proyectoRecord.getValue('id'));
                let comiteArray = getComite();
                recipients = recipients.concat(recursosArray).concat(projectManager).concat(solicitadoPor).concat(partesInteresadasArray).concat(comiteArray);
            } else if (tipo == 2) { // Control de Cambio

                // Obtener recursos de la proxima tarea
                let solicitadoPor = getSolicitadoPor(proyectoRecord);
                let recursosProximaTareaArray = getRecursosProximaTarea(proyectoRecord.getValue('id'), proyectoTareaRecord.getValue('id'));
                recipients = recipients.concat(solicitadoPor).concat(recursosProximaTareaArray);
            }
            recipients = [...new Set(recipients)];
            recipients = recipients.filter(recipient => recipient != 0); // Elimina del array los 0

            // Validar regla "Se permite un máximo de 10 destinatarios ( options.recipients+ options.cc+ ).options.bcc"
            let groups_recipients = [];
            while (recipients.length > 0) {
                groups_recipients.push(recipients.splice(0, 10));
            }

            groups_recipients.forEach(recipients => {

                // Enviar email
                if (Object.keys(recipients).length > 0) {
                    email.send({
                        author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                        recipients: recipients,
                        subject: `[${descTipoMayus}] Notificación para continuar`,
                        body: `
                            El usuario <b>"${user.name}"</b> ha culminado con la actividad <b>"${tarea_titulo}"</b>, revise y continue el ${descTipoMinus} "${proyectoRecord.getValue('companyname')}".<br /><br />
                            Link: <a href="${urlRecord}">${urlRecord}</a>
                        `
                    });
                }
            });
        }

        function sendEmail_SolicitarCierre(proyectoRecord, user) {

            // Obtener datos
            let tipo = proyectoRecord.getValue('custentity_bio_tipo_proyecto');
            let descTipoMayus = (tipo == 2) ? 'Control de Cambio' : 'Proyecto';
            let descTipoMinus = (tipo == 2) ? 'control de cambio' : 'proyecto';

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let projectManager = getProjectManager(proyectoRecord);
            let comiteArray = getComite();
            recipients = recipients.concat(projectManager).concat(comiteArray);
            recipients = [...new Set(recipients)];
            recipients = recipients.filter(recipient => recipient != 0); // Elimina del array los 0

            // Validar regla "Se permite un máximo de 10 destinatarios ( options.recipients+ options.cc+ ).options.bcc"
            let groups_recipients = [];
            while (recipients.length > 0) {
                groups_recipients.push(recipients.splice(0, 10));
            }

            groups_recipients.forEach(recipients => {

                // Enviar email
                if (Object.keys(recipients).length > 0) {
                    email.send({
                        author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                        recipients: recipients,
                        subject: `[${descTipoMayus}] Notificación para cerrar`,
                        body: `
                            El usuario <b>"${user.name}"</b> ha cerrado el ${descTipoMinus} "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                            Concepto: Aprobación de cierre.<br /><br />
                            Nombre ${descTipoMayus}: ${proyectoRecord.getValue('companyname')}<br /><br />
                            Link: <a href="${urlRecord}">${urlRecord}</a>
                        `
                    });
                }
            });
        }

        function sendEmail_AprobarCierre(proyectoRecord, user) {

            // Obtener datos
            let tipo = proyectoRecord.getValue('custentity_bio_tipo_proyecto');
            let descTipoMayus = (tipo == 2) ? 'Control de Cambio' : 'Proyecto';
            let descTipoMinus = (tipo == 2) ? 'control de cambio' : 'proyecto';

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let recursosArray = getRecursos(proyectoRecord.getValue('id'));
            let projectManager = getProjectManager(proyectoRecord);
            let solicitadoPor = getSolicitadoPor(proyectoRecord);
            let partesInteresadasArray = getPartesInteresadas(proyectoRecord.getValue('id'));
            let comiteArray = getComite();
            recipients = recipients.concat(recursosArray).concat(projectManager).concat(solicitadoPor).concat(partesInteresadasArray).concat(comiteArray);
            recipients = [...new Set(recipients)];
            recipients = recipients.filter(recipient => recipient != 0); // Elimina del array los 0

            // Validar regla "Se permite un máximo de 10 destinatarios ( options.recipients+ options.cc+ ).options.bcc"
            let groups_recipients = [];
            while (recipients.length > 0) {
                groups_recipients.push(recipients.splice(0, 10));
            }

            groups_recipients.forEach(recipients => {

                // Enviar email
                if (Object.keys(recipients).length > 0) {
                    email.send({
                        author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                        recipients: recipients,
                        subject: `[${descTipoMayus}] Notificación de culminación`,
                        body: `
                            El usuario <b>"${user.name}"</b> ha cerrado el ${descTipoMinus} "${proyectoRecord.getValue('companyname')}".<br /><br />
                            Link: <a href="${urlRecord}">${urlRecord}</a>
                        `
                    });
                }
            });
        }

        function sendEmail_NotificarCierre(proyectoRecord, user) {

            // Obtener datos
            let tipo = proyectoRecord.getValue('custentity_bio_tipo_proyecto');
            let descTipoMayus = (tipo == 2) ? 'Control de Cambio' : 'Proyecto';
            let descTipoMinus = (tipo == 2) ? 'control de cambio' : 'proyecto';

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let recursosArray = getRecursos(proyectoRecord.getValue('id'));
            let projectManager = getProjectManager(proyectoRecord);
            let solicitadoPor = getSolicitadoPor(proyectoRecord);
            let partesInteresadasArray = getPartesInteresadas(proyectoRecord.getValue('id'));
            let comiteArray = getComite();
            recipients = recipients.concat(recursosArray).concat(projectManager).concat(solicitadoPor).concat(partesInteresadasArray).concat(comiteArray);
            recipients = [...new Set(recipients)];
            recipients = recipients.filter(recipient => recipient != 0); // Elimina del array los 0

            // Validar regla "Se permite un máximo de 10 destinatarios ( options.recipients+ options.cc+ ).options.bcc"
            let groups_recipients = [];
            while (recipients.length > 0) {
                groups_recipients.push(recipients.splice(0, 10));
            }

            groups_recipients.forEach(recipients => {

                // Enviar email
                if (Object.keys(recipients).length > 0) {
                    email.send({
                        author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                        recipients: recipients,
                        subject: `[${descTipoMayus}] Notificación de culminación (Partes interesadas)`,
                        body: `
                            El usuario <b>"${user.name}"</b> ha cerrado el ${descTipoMinus} "${proyectoRecord.getValue('companyname')}".<br /><br />
                            Link: <a href="${urlRecord}">${urlRecord}</a>
                        `
                    });
                }
            });
        }

        return {
            getUser,
            error_log,
            error_message,
            // Modulo Proyectos - Validación
            getCountrySubsidiary,
            getDataUser,
            // Modulo Proyectos - Records personalizados
            getCorrelativo,
            getCorrelativoFormato,
            actualizarCorrelativo,
            // Modulo Proyectos - Data - Usuarios
            getComite,
            getPartesInteresadas,
            getRecursos,
            // Modulo Proyectos - Data - PDF
            getTareas,
            getDivulgacionDeCambio,
            getResumenProyecto,
            getEficiencia,
            // Modulo Proyectos - Email
            sendEmail_SolicitarAprobacion,
            sendEmail_AprobarProyecto,
            sendEmail_NoAprobarProyecto,
            sendEmail_SolicitarAutorizacion,
            sendEmail_AutorizarProyecto,
            sendEmail_NoAutorizarProyecto,
            sendEmail_ActualizarEnCurso,
            sendEmail_NotificarCulminacionTarea,
            sendEmail_SolicitarCierre,
            sendEmail_AprobarCierre,
            sendEmail_NotificarCierre
        }

    });
