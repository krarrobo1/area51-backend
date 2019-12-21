import * as dt from 'date-fns';
import { es } from 'date-fns/locale';

import ExcelJS from 'exceljs';
let wb = new ExcelJS.Workbook();

import path from 'path';


let appDir = path.dirname(require.main.filename);



export async function createReport(data, employee) {
    // Consultar datos empleado
    let { nombres, ci, empresa } = employee;
    if (data.length === 0) return null;

    await wb.xlsx.readFile(`${appDir}/../assets/Template.xlsx`);

    let knowMonths = [],
        knowDays = [],
        row = 6,
        entradas = [],
        salidas = [],
        totalTemp = 0,
        totalMonth = [];

    for (let i = 0; i < data.length; i++) {
        const registry = data[i];
        let { timest, evento, hora } = registry;

        // if (evento === 'Entrada') entradas.push(hora)
        // else salidas.push(hora);

        let monthYear = dt.format(new Date(timest), `MMMM yyyy`, { locale: es });
        let dayNumber = dt.format(new Date(timest), 'EEEE dd MMMM', { locale: es });
        let monthTitle = monthYear.toUpperCase();
        // Si el mes es nuevo crea una nueva Worksheet.
        if (!knowMonths.includes(monthYear)) {
            totalTemp = getDailyTotal(entradas, salidas);
            totalMonth.push(totalTemp);

            let indexAnterior = (knowMonths.length + 12) - (wb.worksheets.length);

            if (indexAnterior > 0) {
                let wsAnterior = wb.getWorksheet(indexAnterior);
                wsAnterior.getCell(`C${row}`).value = `${totalTemp}`;
                wsAnterior.getCell(`A${row}`).value = 'TOTAL:'
                row++;

                let totalMes = getMonthlyTotal(totalMonth);
                wsAnterior.getCell(`A${row}`).value = 'TOTAL MENSUAL:'
                wsAnterior.getCell(`C${row}`).value = `${totalMes}`;
            }


            totalMonth = [];
            row = 6;
            knowMonths.push(monthYear);

            // Se incrementa con cada mes nuevo.
            let ws = wb.getWorksheet(`Hoja ${knowMonths.length}`);
            ws.name = monthTitle;

            ws.getCell('A1').value = `REGISTRO DE ASISTENCIA - ${monthTitle}`;
            ws.getCell('C2').value = `${nombres}`;
            ws.getCell('C3').value = `${ci}`;
            ws.getCell('C4').value = `${dt.format(new Date(), 'dd/MM/yyyy')}`;

            ws.getCell(`A${row}`).value = dayNumber;

            // Siguiente linea
            row++;

            // Primer dia del mes
            writeRow(ws, row, i, registry, empresa);
            knowDays.push(dayNumber);

            entradas = [];
            salidas = [];


            if (evento === 'Entrada') entradas.push(hora)
            else salidas.push(hora);
            // Next row
            row++;
        } else {
            // Mes conocido
            let ws = wb.getWorksheet(monthTitle);
            //last = false;
            // Dia no conocido
            if (!knowDays.includes(dayNumber)) {


                let totalTag = ws.getCell(`A${row}`);
                totalTag.value = 'TOTAL:';


                totalTemp = getDailyTotal(entradas, salidas);
                totalMonth.push(totalTemp);

                let total = ws.getCell(`C${row}`);
                total.value = `${totalTemp}`;



                //Reset
                entradas = [];
                salidas = [];
                totalTemp = 0;


                row++;

                let dayTag = ws.getCell(`E${row}`);
                dayTag.merge(ws.getCell(`A${row}`));

                dayTag.value = `${dayNumber}`;
                dayTag.style.fill = diaStyle;
                dayTag.alignment = { vertical: 'middle', horizontal: 'center' };
                dayTag.font = font;

                row++;

                writeRow(ws, row, i, registry, empresa);
                knowDays.push(dayNumber);

                if (evento === 'Entrada') entradas.push(hora)
                else salidas.push(hora);

                // Next row
                row++;
            }
            // Dia conocido
            else {
                writeRow(ws, row, i, registry, empresa);
                if (evento === 'Entrada') entradas.push(hora);
                else salidas.push(hora);
                row++;
            }
        }

    }

    // Ultimo total
    let last = getDailyTotal(entradas, salidas);
    let lws = wb.getWorksheet((knowMonths.length + 12) - wb.worksheets.length);

    let totalTag = lws.getCell(`A${row}`);
    totalTag.value = 'TOTAL:';
    totalTag.style.fill = totalStyle;

    let totalN = lws.getCell(`C${row}`);
    totalN.value = `${last}`;
    totalN.style.fill = totalStyle;

    row++;
    totalMonth.push(last);
    let totalMes = getMonthlyTotal(totalMonth);
    lws.getCell(`A${row}`).value = 'TOTAL MENSUAL:'
    lws.getCell(`C${row}`).value = `${totalMes}`;


    // Limpiar wb
    wb.eachSheet(ws => {
        let name = ws.name;
        if (name.charAt(0) === 'H') {
            wb.removeWorksheet(name);
        }
    });
    let bf = await wb.xlsx.writeBuffer();
    return bf;
}


function writeRow(ws, row, i, registry, empresa) {
    let { hora, dispositivo, evento } = registry;
    let id = ws.getCell(`A${row}`)
    id.value = i;

    let eventoTag = ws.getCell(`B${row}`);
    eventoTag.value = evento;

    let horaTag = ws.getCell(`C${row}`);
    horaTag.value = hora;

    let dispTag = ws.getCell(`D${row}`);
    dispTag.value = dispositivo;

    let ubTag = ws.getCell(`E${row}`);
    ubTag.value = `${empresa}`;

    setStyle(id, eventoTag, horaTag, dispTag, ubTag);
}

function getDailyTotal(entradas, salidas) {
    let total = 0;
    if (entradas.length === salidas.length) {
        const mockDate = '01/01/2020';
        let total = '';
        for (let i = 0; i < entradas.length; i++) {
            let entrada = new Date(`${mockDate} ${entradas[i]}`),
                salida = new Date(`${mockDate} ${salidas[i]}`);
            let result = dt.differenceInMilliseconds(salida, entrada);
            let utcDate = new Date(result);
            let totalTemp = `${utcDate.getUTCHours()}:${utcDate.getUTCMinutes()}:${utcDate.getUTCSeconds()}`;
            if (total === '') total = totalTemp;
            else {
                let lastTotal = new Date(`${mockDate} ${total}`);
                let sum = dt.addMilliseconds(lastTotal, result);
                let newTotal = sum.toLocaleTimeString();
                total = newTotal;
            }
        }
        return total;
    } else {
        return 0;
    }
}

function getMonthlyTotal(totales) {
    let total = '';
    const mockDate = '01/01/2020';
    for (let i = 0; i < totales.length; i++) {
        const temp = totales[i];
        let ms = new Date(`${mockDate} ${temp}`);

        console.log(ms.getUTCMilliseconds());


        if (total === '') {
            total = temp;
        } else {
            let lastTotal = new Date(`${mockDate} ${total}`);
            let sum = dt.addMilliseconds(lastTotal, ms);
            console.log(sum);
            let newTotal = sum.toLocaleTimeString();
            total = newTotal;
        }

        //let dateTemp = new Date(`${mockDate} ${temp}`);
    }
    return total;
}

function setStyle(id, eventoTag, horaTag, dispTag, ubTag) {
    if (eventoTag.value === 'Entrada') {
        id.style.fill = entradaStyle;
        eventoTag.style.fill = entradaStyle;
        horaTag.style.fill = entradaStyle;
        dispTag.style.fill = entradaStyle;
        ubTag.style.fill = entradaStyle;
    } else {
        id.style.fill = salidaStyle;
        eventoTag.style.fill = salidaStyle;
        horaTag.style.fill = salidaStyle;
        dispTag.style.fill = salidaStyle;
        ubTag.style.fill = salidaStyle;
    }
    eventoTag.alignment = { vertical: 'middle', horizontal: 'center' };
}

function setTotalStyle() {

}


const entradaStyle = {
    type: 'pattern',
    pattern: 'darkVertical',
    fgColor: { argb: 'b6d7a8' },
    bgColor: { argb: 'b6d7a8' }
}

const salidaStyle = {
    type: 'pattern',
    pattern: 'darkVertical',
    fgColor: { argb: 'f8cb9c' },
    bgColor: { argb: 'f8cb9c' }
}

const diaStyle = {
    type: 'pattern',
    pattern: 'darkVertical',
    fgColor: { argb: 'd5dbd6' },
    bgColor: { argb: '3c78d8' }
}

const totalStyle = {
    type: 'pattern',
    pattern: 'darkVertical',
    fgColor: { argb: 'f2ee7b' },
    bgColor: { argb: 'f2ee7b' }
}

let font = { name: 'Arial', size: 12, bold: true };