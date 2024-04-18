<#assign params = input.data?eval>
<?xml version="1.0"?>
<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">
<pdf>
    <head>
        <style>
            body {
                font-family: sans-serif;
                font-size: 10pt;
            }

            p {
                margin: 0pt;
            }

            table.items {
                border: 0.1mm solid #000000;
            }

            td {
                vertical-align: top;
            }

            .items td {
                border-left: 0.1mm solid #000000;
                border-right: 0.1mm solid #000000;
            }

            table thead td {
                background-color: #EEEEEE;
                text-align: center;
                border: 0.1mm solid #000000;
                font-variant: small-caps;
            }

            .items td.blanktotal {
                background-color: #EEEEEE;
                border: 0.1mm solid #000000;
                background-color: #FFFFFF;
                border: 0mm none #000000;
                border-top: 0.1mm solid #000000;
                border-right: 0.1mm solid #000000;
            }

            .items td.totals {
                text-align: right;
                border: 0.1mm solid #000000;
            }

            .items td.cost {
                text-align: "." center;
            }

            /****************** Personalizado ******************/

            /****************** Head ******************/

            .cabecera-head {
                font-weight: normal;
                border-bottom: 0.1mm solid #000000;
            }

            .celda-head {
                font-weight: normal;
                border-bottom: 0.1mm solid #000000;
            }

            img {
                width: 120px;
                height: 40px;
            }

            /****************** Body ******************/

            .cabecera-body {
                font-weight: normal;
                background-color: #EEEEEE;
                border: 0.1mm solid #000000;
            }

            .celda-body {
                font-weight: normal;
                border: 0.1mm solid #000000;
            }

            /*
            .celda-separador {
                height: 30px;
            }
            */
        </style>
    </head>

    <body>

        <!-- <img src='https://www.biomont.com.pe/storage/img/logo.png'></img> -->

        <table class="items" width="100%" style="font-size: 7pt; border-collapse: collapse;" cellpadding="4">
            <thead>
                <tr>
                    <th colspan="1" class="cabecera-head" align="center" style="vertical-align: middle;">
                        <img src='https://www.biomont.com.pe/storage/img/logo.png'></img><br />
                        Laboratorios Biomont S.A.
                    </th>
                    <th colspan="3" class="cabecera-head" align="center" style="vertical-align: middle; font-size: 14px;">
                        ${params.project_data.codigo} ${params.project_data.nombre}
                    </th>
                    <th colspan="1" width="56" class="cabecera-head" style="vertical-align: middle;"></th>
                </tr>
            </thead>
            <tbody>
                <!-- Gestión del Proyecto -->
                <tr>
                    <td class="cabecera-body" colspan="5">Gestión del Proyecto</td>
                </tr>
                <tr>
                    <td class="celda-body" width="140"><b>Manager del Proyecto</b></td>
                    <td class="celda-body"><b>Lider del Proyecto</b></td>
                    <td class="celda-body"><b>Area</b></td>
                    <td class="celda-body" colspan="2"></td>
                </tr>
                <tr>
                    <td class="celda-body">${params.project_data.usuario_firma_aprobado_por}<br />${params.project_data.fecha_firma_aprobado_por}</td>
                    <td class="celda-body">${params.project_data.usuario_firma_solicitado_por}<br />${params.project_data.fecha_firma_solicitado_por}</td>
                    <td class="celda-body">${params.project_data.area}</td>
                    <td class="celda-body" colspan="2"></td>
                </tr>

                <!-- Descripción -->
                <tr>
                    <td class="cabecera-body" colspan="5">Descripción</td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">${params.project_data.descripcion?replace("\n", "<br/>")}</td>
                </tr>

                <!-- Justificación -->
                <tr>
                    <td class="cabecera-body" colspan="5">Justificación</td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">${params.project_data.justificacion?replace("\n", "<br/>")}</td>
                </tr>

                <!-- Autorización -->
                <tr>
                    <td class="cabecera-body" colspan="5">Autorización</td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="1"><b>Autorizado por:</b></td>
                    <td class="celda-body" colspan="4"><b>Comentarios:</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="1">${params.project_data.usuario_firma_autorizado_por}<br />${params.project_data.fecha_firma_autorizado_por}</td>
                    <td class="celda-body" colspan="4">${params.project_data.comentarios_autorizado_por}</td>
                </tr>

                <!-- Acciones por ejecutar -->
                <tr>
                    <td class="cabecera-body" colspan="5">Acciones por ejecutar</td>
                </tr>
                <tr>
                    <td class="celda-body"><b>Actividades</b></td>
                    <td class="celda-body"><b>Responsable</b></td>
                    <td class="celda-body"><b>Fecha Final Planificada</b></td>
                    <td class="celda-body"><b>Fecha Final Real</b></td>
                    <td class="celda-body"><b>Estatus</b></td>
                </tr>
                <#list params.project_data.dataTareas as tareas>
                <tr>
                    <td class="celda-body">${tareas.tarea.nombre}</td>
                    <td class="celda-body">${tareas.recursos_nombres}</td>
                    <td class="celda-body">${tareas.fecha_finalizacion}</td>
                    <td class="celda-body">${tareas.fecha_finalizacion_real}</td>
                    <td class="celda-body">${tareas.porcentaje_completado}</td>
                </tr>
                </#list>

                <!-- Cierre del proyecto -->
                <tr>
                    <td class="cabecera-body" colspan="5">Cierre del proyecto</td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="1"><b>Aprobado por:</b></td>
                    <td class="celda-body" colspan="4"><b>Comentarios:</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="1">${params.project_data.usu_firma_cierre_aprobado_por}<br />${params.project_data.fec_firma_cierre_aprobado_por}</td>
                    <td class="celda-body" colspan="4">${params.project_data.coment_cierre_aprobado_por}</td>
                </tr>

                <!-- Resumen del proyecto -->
                <tr>
                    <td class="cabecera-body" colspan="5">Resumen del proyecto</td>
                </tr>
                <tr>
                    <td class="celda-body"><b>Cantidad de actividades realizadas</b></td>
                    <td class="celda-body"><b>Horas totales</b></td>
                    <td class="celda-body"><b>Eficiencia promedio</b></td>
                    <td class="celda-body"><b>Fecha de Inicio de actividades</b></td>
                    <td class="celda-body"><b>Fecha de ultima actividad</b></td>
                </tr>
                <tr>
                    <td class="celda-body">${params.project_data.dataResumenProyecto.cantidad_actividades_realizadas}</td>
                    <td class="celda-body">${params.project_data.dataResumenProyecto.horas_totales}</td>
                    <td class="celda-body">${params.project_data.dataResumenProyecto.eficiencia}</td>
                    <td class="celda-body">${params.project_data.dataResumenProyecto.fecha_inicio}</td>
                    <td class="celda-body">${params.project_data.dataResumenProyecto.fecha_finalizacion}</td>
                </tr>

                <!-- Partes Interesadas -->
                <tr>
                    <td class="cabecera-body" colspan="5">Partes Interesadas</td>
                </tr>
                <tr>
                    <td class="celda-body"><b>Notificado a</b></td>
                    <td class="celda-body"><b>E-mail</b></td>
                    <td class="celda-body"><b>Área</b></td>
                    <td class="celda-body">&nbsp;</td>
                    <td class="celda-body">&nbsp;</td>
                </tr>
                <#list params.project_data.dataDivulgacionDeCambio as divulgacion>
                <tr>
                    <td class="celda-body">${divulgacion.entityid}</td>
                    <td class="celda-body">${divulgacion.email}</td>
                    <td class="celda-body">${divulgacion.department}</td>
                    <td class="celda-body">&nbsp;</td>
                    <td class="celda-body">&nbsp;</td>
                </tr>
                </#list>
            </tbody>
        </table>

    </body>

    <!--
    <head>
        <style>
            body { background-color:yellow; font-size:18 }
        </style>
    </head>
    <body>
        Hello, World! - Applying Applying Stylesheets
        ${params.name}
        ${params.project_id}
    </body>
    -->
</pdf>