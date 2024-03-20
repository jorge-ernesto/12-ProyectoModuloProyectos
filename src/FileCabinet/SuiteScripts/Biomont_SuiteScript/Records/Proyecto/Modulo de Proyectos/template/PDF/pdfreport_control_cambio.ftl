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
                    <th colspan="3" class="cabecera-head" align="center" style="vertical-align: middle; font-size: 18px;">
                        CONTROL DE CAMBIOS
                    </th>
                    <th colspan="1" width="56" class="cabecera-head" style="vertical-align: middle;">
                        Código: F-AC.009<br />
                        Versión: 10<br />
                        Vigente desde: <br />27/12/2023
                    </th>
                </tr>
                <tr>
                    <th colspan="4" class="celda-head celda-separador">&nbsp;</th>
                    <th colspan="1" class="celda-head celda-separador">N° ${params.project_data.codigo}</th>
                </tr>
            </thead>
            <tbody>
                <!-- CUADRO N. 1 -->
                <tr>
                    <td class="celda-body" width="140"><b>Solicitado por:</b></td>
                    <td class="celda-body"><b>Area:</b></td>
                    <td class="celda-body"><b>Fecha de solicitud:</b></td>
                    <td class="celda-body" colspan="2"></td>
                </tr>
                <tr>
                    <td class="celda-body">${params.project_data.usuario_firma_solicitado_por}</td>
                    <td class="celda-body">${params.project_data.area}</td>
                    <td class="celda-body">${params.project_data.fecha_firma_solicitado_por}</td>
                    <td class="celda-body" colspan="2"></td>
                </tr>

                <!-- Objeto del cambio -->
                <tr>
                    <td class="cabecera-body" colspan="5">Objeto del cambio</td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">&nbsp;${params.project_data.obj_cambio}</td>
                </tr>

                <!-- Producto/proceso relacionado al cambio -->
                <tr>
                    <td class="cabecera-body" colspan="5">Producto/proceso relacionado al cambio</td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">&nbsp;${params.project_data.prod_proc_rela}</td>
                </tr>

                <!-- Justificación -->
                <tr>
                    <td class="cabecera-body" colspan="5">Justificación</td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">&nbsp;${params.project_data.justificacion}</td>
                </tr>

                <!-- Propuesta de cambio (descripción) -->
                <tr>
                    <td class="cabecera-body" colspan="5">Propuesta de cambio (descripción)</td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">&nbsp;${params.project_data.descripcion}</td>
                </tr>

                <!-- Aprobado por: -->
                <tr>
                    <td class="cabecera-body" colspan="5">Aprobado por:</td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">&nbsp;${params.project_data.usuario_firma_aprobado_por}<br />&nbsp;${params.project_data.fecha_firma_aprobado_por}</td>
                </tr>

                <!-- SEPARADOR -->
                <tr>
                    <td colspan="5" class="celda-separador">&nbsp;</td>
                </tr>

                <!-- CUADRO N. 2 -->
                <tr>
                    <td class="cabecera-body" colspan="5">Factibilidad del cambio</td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="1"><b>Autorizado por:</b></td>
                    <td class="celda-body" colspan="4"><b>Comentarios:</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="1">${params.project_data.usuario_firma_autorizado_por}<br />${params.project_data.fecha_firma_autorizado_por}</td>
                    <td class="celda-body" colspan="4">${params.project_data.comentarios_autorizado_por}</td>
                </tr>

                <!-- SEPARADOR -->
                <tr>
                    <td colspan="5" class="celda-separador">&nbsp;</td>
                </tr>

                <!-- CUADRO N. 3 -->
                <tr>
                    <td class="cabecera-body" colspan="5">Acciones por ejecutar</td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="2"><b>ACTIVIDAD</b></td>
                    <td class="celda-body"><b>Responsable de la actividad</b></td>
                    <td class="celda-body"><b>Fecha de entrega</b></td>
                    <td class="celda-body"><b>Estatus</b></td>
                </tr>
                <#list params.project_data.dataTareas as tareas>
                <tr>
                    <td class="celda-body" colspan="2">${tareas.tarea.nombre}</td>
                    <td class="celda-body">${tareas.recursos_nombres}</td>
                    <td class="celda-body">${tareas.fecha_finalizacion}</td>
                    <td class="celda-body">${tareas.porcentaje_completado}</td>
                </tr>
                </#list>

                <!-- SEPARADOR -->
                <tr>
                    <td colspan="5" class="celda-separador">&nbsp;</td>
                </tr>

                <!-- CUADRO N. 4 -->
                <tr>
                    <td class="cabecera-body" colspan="5">Cierre del cambio</td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="1"><b>Aprobado por:</b></td>
                    <td class="celda-body" colspan="4"><b>Comentarios:</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="1">${params.project_data.usu_firma_cierre_aprobado_por}<br />${params.project_data.fec_firma_cierre_aprobado_por}</td>
                    <td class="celda-body" colspan="4">${params.project_data.coment_cierre_aprobado_por}</td>
                </tr>

                <!-- SEPARADOR -->
                <tr>
                    <td colspan="5" class="celda-separador">&nbsp;</td>
                </tr>

                <!-- CUADRO N. 5 -->
                <tr>
                    <td class="cabecera-body" colspan="5">Divulgación del cambio</td>
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