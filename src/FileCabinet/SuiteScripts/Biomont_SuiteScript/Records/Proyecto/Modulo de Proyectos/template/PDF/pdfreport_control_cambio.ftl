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
                font-weight: bold;
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

            /****************** Tabla sin bordes ******************/

            .tabla-sin-bordes {
                border-collapse: collapse; /* Asegura que los bordes de las celdas se fusionen correctamente */
            }

            .tabla-sin-bordes th,
            .tabla-sin-bordes td {
                border: none;
            }
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
                        Versión: 11<br />
                        Vigente desde: <br />22/04/2024
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
                    <td class="celda-body" colspan="1"><b>Solicitado por:</b></td>
                    <td class="celda-body" colspan="4"><b>Area:</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="1">${params.project_data.usuario_firma_solicitado_por}<br />${params.project_data.fecha_firma_solicitado_por}</td>
                    <td class="celda-body" colspan="4">${params.project_data.area}</td>
                </tr>

                <!-- Tipo de cambio -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Tipo de cambio</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">${params.project_data.tipo_cambio}</td>
                </tr>

                <!-- Objeto del cambio -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Objeto del cambio</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">${params.project_data.objeto_cambio}</td>
                </tr>

                <!-- Producto/proceso relacionado al cambio -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Producto/proceso relacionado al cambio</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">${params.project_data.prod_proc_rela?replace("\n", "<br/>")}</td>
                </tr>

                <!-- Justificación -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Justificación</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">${params.project_data.justificacion?replace("\n", "<br/>")}</td>
                </tr>

                <!-- Propuesta de cambio (descripción) -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Propuesta de cambio (descripción)</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">${params.project_data.descripcion?replace("\n", "<br/>")}</td>
                </tr>

                <!-- Proposito de cambio -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Proposito de cambio</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">${params.project_data.proposito_cambio?replace("\n", "<br/>")}</td>
                </tr>

                <!-- Beneficio esperado -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Beneficio esperado</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">${params.project_data.benef_esper?replace("\n", "<br/>")}</td>
                </tr>

                <!-- Consecuencias potenciales -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Consecuencias potenciales</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">${params.project_data.consec_potenc?replace("\n", "<br/>")}</td>
                </tr>

                <!-- Recursos -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Recursos</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">${params.project_data.recursos?replace("\n", "<br/>")}</td>
                </tr>

                <!-- Aprobado por: -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Aprobado por (Jefe Inmediato):</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">${params.project_data.usuario_firma_aprobado_por}<br />${params.project_data.fecha_firma_aprobado_por}</td>
                </tr>

                <!-- Identificación de riesgos y oportunidades -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Identificación de riesgos y oportunidades</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">Adjuntar formato F-AC.089 Identificación y evaluación  riesgos y oportunidades</td>
                </tr>

                <!-- Identificación y evaluación de peligros -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Identificación y evaluación de peligros</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="5">
                        <table class="tabla-sin-bordes" width="100%">
                            <tr>
                                <td width="20%">
                                    IPERC
                                    <input type="checkbox" id="iperc" name="iperc" readonly="true" <#if params.project_data.iperc = true>checked="true"</#if> />
                                </td>
                                <td width="20%">
                                    ATS
                                    <input type="checkbox" id="ats" name="ats" readonly="true" <#if params.project_data.ats = true>checked="true"</#if> />
                                </td>
                                <td width="20%">
                                    PETAR
                                    <input type="checkbox" id="petar" name="petar" readonly="true" <#if params.project_data.petar = true>checked="true"</#if> />
                                </td>
                                <td width="20%">
                                    NO APLICA
                                    <input type="checkbox" id="no_aplica" name="no_aplica" readonly="true" <#if params.project_data.no_aplica = true>checked="true"</#if> />
                                </td>
                                <td width="20%">
                                    OTROS<#if params.project_data.otros_det?has_content>: ${params.project_data.otros_det}</#if>
                                    <input type="checkbox" id="otros" name="otros" readonly="true" <#if params.project_data.otros = true>checked="true"</#if> />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- SEPARADOR -->
                <tr>
                    <td colspan="5" class="celda-separador">&nbsp;</td>
                </tr>

                <!-- CUADRO N. 2 -->
                <tr>
                    <td class="cabecera-body" colspan="5"><b>Factibilidad del cambio</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="1">Autorizado por (Representante del comité):</td>
                    <td class="celda-body" colspan="4">Comentarios:</td>
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
                    <td class="cabecera-body" colspan="5"><b>Plan de ejecución y seguimiento</b></td>
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
                    <td class="cabecera-body" colspan="5"><b>Cierre del cambio</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="1">Representante del comité:</td>
                    <td class="celda-body" colspan="4">Comentarios:</td>
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
                    <td class="cabecera-body" colspan="5"><b>Divulgación del cambio</b></td>
                </tr>
                <tr>
                    <td class="celda-body" colspan="1">Notificado a</td>
                    <td class="celda-body" colspan="2">E-mail</td>
                    <td class="celda-body" colspan="2">Área</td>
                </tr>
                <#list params.project_data.dataDivulgacionDeCambio as divulgacion>
                <tr>
                    <td class="celda-body" colspan="1">${divulgacion.entityid}</td>
                    <td class="celda-body" colspan="2">${divulgacion.email}</td>
                    <td class="celda-body" colspan="2">${divulgacion.department}</td>
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