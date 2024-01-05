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

        /******************/

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
            if (searchResult.length > 0) {
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

        /******************/

        function getUrlRecord(projectId) {

            let urlRecord = url.resolveRecord({
                recordType: 'job',
                recordId: projectId,
            })

            return { urlRecord };
        }

        function getComite() {

            // Crear un array para almacenar los valores
            var empleadoArray = [];

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
                empleadoArray.push(Number(empleadoValue));
                return true;
            });

            return empleadoArray;
        }

        function getPartesInteresadas(projectId) {

            // Crear un array para almacenar los valores
            var empleadoArray = [];

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
                        name: 'internalid',
                        operator: search.Operator.ANYOF,
                        values: projectId
                    })
                ]
            });

            // Ejecutar la búsqueda y recorrer los resultados
            searchObj.run().each(function (result) {
                var empleadoValue = result.getValue('custrecord_bio_empleado_confproyemp');
                empleadoArray.push(Number(empleadoValue));
                return true;
            });

            return empleadoArray;
        }

        function getRecursos(projectId) {

            // Crear un array para almacenar los valores
            var empleadoArray = [];

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
                empleadoArray.push(Number(empleadoValue));
                return true;
            });

            return empleadoArray;
        }

        function getProjectManager(proyectoRecord) {

            return Number(proyectoRecord.getValue('projectmanager'));
        }

        function getSolicitadoPor(proyectoRecord) {

            return Number(proyectoRecord.getValue('custentity_bio_solicitado_por'));
        }

        /******************/

        function sendEmail_SolicitarAprobacion(proyectoRecord, user) {

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let projectManager = getProjectManager(proyectoRecord);
            recipients = recipients.concat(projectManager);
            recipients = [...new Set(recipients)];

            // Enviar email
            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                recipients: recipients,
                subject: `Notificación para aprobar Proyecto/Control de Cambio`,
                body: `
                    El usuario <b>"${user.name}"</b> ha creado el proyecto/control de cambio "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                    Concepto: Aprobación de proyecto.<br /><br />
                    Nombre Proyecto: ${proyectoRecord.getValue('companyname')}<br /><br />
                    Link: <a href="${urlRecord}">${urlRecord}</a>
                `
            });
        }

        function sendEmail_AprobarProyecto(proyectoRecord, user) {

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let solicitadoPor = getSolicitadoPor(proyectoRecord);
            recipients = recipients.concat(solicitadoPor);
            recipients = [...new Set(recipients)];

            // Enviar email
            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                recipients: recipients,
                subject: `Notificación de aprobación del proyecto`,
                body: `
                    El usuario <b>"${user.name}"</b> ha aprobado el proyecto/control de cambio "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                    Concepto: Aprobación de proyecto.<br /><br />
                    Nombre Proyecto: ${proyectoRecord.getValue('companyname')}<br /><br />
                    Link: <a href="${urlRecord}">${urlRecord}</a>
                `
            });
        }

        function sendEmail_NoAprobarProyecto(proyectoRecord, user) {

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let solicitadoPor = getSolicitadoPor(proyectoRecord);
            recipients = recipients.concat(solicitadoPor);
            recipients = [...new Set(recipients)];

            // Enviar email
            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                recipients: recipients,
                subject: `Notificación de no aprobación del proyecto`,
                body: `
                    El usuario <b>"${user.name}"</b> ha rechazado el proyecto/control de cambio "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                    Concepto: Aprobación de proyecto.<br /><br />
                    Nombre Proyecto: ${proyectoRecord.getValue('companyname')}<br /><br />
                    Link: <a href="${urlRecord}">${urlRecord}</a>
                `
            });
        }

        function sendEmail_SolicitarAutorizacion(proyectoRecord, user) {

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let comiteArray = getComite();
            log.debug('data', comiteArray);
            recipients = recipients.concat(comiteArray);
            recipients = [...new Set(recipients)];

            // Enviar email
            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                recipients: recipients,
                subject: `Notificación para autorizar proyecto`,
                body: `
                    El usuario <b>"${user.name}"</b> ha aprobado el proyecto/control de cambio "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                    Revisar la autorización.<br /><br />
                    Concepto: Autorización de proyecto.<br /><br />
                    Nombre Proyecto: ${proyectoRecord.getValue('companyname')}<br /><br />
                    Link: <a href="${urlRecord}">${urlRecord}</a>
                `
            });
        }

        function sendEmail_AutorizarProyecto(proyectoRecord, user) {

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
            } else if (proyectoRecord.getValue('custentity_bio_tipo_proyecto') == 2) { // Si es control de cambio

                let recursosArray = getRecursos(proyectoRecord.getValue('id'));
                let projectManager = getProjectManager(proyectoRecord);
                let solicitadoPor = getSolicitadoPor(proyectoRecord);
                let partesInteresadasArray = getPartesInteresadas(proyectoRecord.getValue('id'));
                log.debug('data', { recursosArray, projectManager, solicitadoPor, partesInteresadasArray });
                recipients = recipients.concat(recursosArray).concat(projectManager).concat(solicitadoPor).concat(partesInteresadasArray);
                recipients = [...new Set(recipients)];
            }

            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                recipients: recipients,
                subject: `Notificación de autorización del proyecto`,
                body: `
                    El usuario <b>"${user.name}"</b> ha autorizado el proyecto/control de cambio "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                    Concepto: Autorización de proyecto.<br /><br />
                    Nombre Proyecto: ${proyectoRecord.getValue('companyname')}<br /><br />
                    Link: <a href="${urlRecord}">${urlRecord}</a>
                `
            });
        }

        function sendEmail_NoAutorizarProyecto(proyectoRecord, user) {

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let projectManager = getProjectManager(proyectoRecord);
            let solicitadoPor = getSolicitadoPor(proyectoRecord);
            recipients = recipients.concat(projectManager).concat(solicitadoPor);
            recipients = [...new Set(recipients)];

            // Enviar email
            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                recipients: recipients,
                subject: `Notificación de no autorizacion del proyecto`,
                body: `
                    El usuario <b>"${user.name}"</b> ha rechazado el proyecto/control de cambio "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                    Concepto: Autorizacion de proyecto.<br /><br />
                    Nombre Proyecto: ${proyectoRecord.getValue('companyname')}<br /><br />
                    Link: <a href="${urlRecord}">${urlRecord}</a>
                `
            });
        }

        function sendEmail_ActualizarEnCurso(proyectoRecord, user) {

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

            // Enviar email
            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                recipients: recipients,
                subject: `Notificación de inicio de proyecto`,
                body: `
                    El usuario <b>"${user.name}"</b> ha iniciado el proyecto/control de cambio "${proyectoRecord.getValue('companyname')}".<br /><br />
                    Link: <a href="${urlRecord}">${urlRecord}</a>
                `
            });
        }

        function sendEmail_NotificarCulminacionTarea(proyectoRecord, user) {

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

            // Enviar email
            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                recipients: recipients,
                subject: `Notificación para continuar el proyecto`,
                body: `
                    El usuario <b>"${user.name}"</b> ha culminado con la actividad predecesora, revise y continue el proyecto/control de cambio "${proyectoRecord.getValue('companyname')}".<br /><br />
                    Link: <a href="${urlRecord}">${urlRecord}</a>
                `
            });
        }

        function sendEmail_SolicitarCierre(proyectoRecord, user) {

            // Obtener url
            let { urlRecord } = getUrlRecord(proyectoRecord.getValue('id'));

            // Obtener empleados
            let recipients = [];
            let projectManager = getProjectManager(proyectoRecord);
            recipients = recipients.concat(projectManager);
            recipients = [...new Set(recipients)];

            // Enviar email
            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                recipients: recipients,
                subject: `Notificación para cerrar el proyecto`,
                body: `
                    El usuario <b>"${user.name}"</b> ha cerrado el proyecto/control de cambio "${proyectoRecord.getValue('companyname')}" en el Sistema Oracle.<br /><br />
                    Concepto: Aprobación de cierre.<br /><br />
                    Nombre Proyecto: ${proyectoRecord.getValue('companyname')}<br /><br />
                    Link: <a href="${urlRecord}">${urlRecord}</a>
                `
            });
        }

        function sendEmail_AprobarCierre(proyectoRecord, user) {

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

            // Enviar email
            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                recipients: recipients,
                subject: `Notificación de culminación del proyecto`,
                body: `
                    El usuario <b>"${user.name}"</b> ha cerrado el proyecto/control de cambio "${proyectoRecord.getValue('companyname')}".<br /><br />
                    Link: <a href="${urlRecord}">${urlRecord}</a>
                `
            });
        }

        function sendEmail_NotificarCierre(proyectoRecord, user) {

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

            // Enviar email
            email.send({
                author: 22147, // Usuario 'NOTIFICACIONES NETSUITE'
                recipients: recipients,
                subject: `Notificación de culminación del proyecto (Partes interesadas)`,
                body: `
                    El usuario <b>"${user.name}"</b> ha cerrado el proyecto/control de cambio "${proyectoRecord.getValue('companyname')}".<br /><br />
                    Link: <a href="${urlRecord}">${urlRecord}</a>
                `
            });
        }

        return {
            getUser,
            error_log,
            // Modulo Proyectos
            getDataUser,
            getCountrySubsidiary,
            getCorrelativo,
            getCorrelativoFormato,
            actualizarCorrelativo,
            getComite,
            getPartesInteresadas,
            getRecursos,
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
