import * as dt from 'date-fns';
import { es } from 'date-fns/locale';

import ExcelJS from 'exceljs';
let wb = new ExcelJS.Workbook();

import path from 'path';
var appDir = path.dirname(require.main.filename);
//let dir = path.dirname(require.main.);

let fill1 = { //cell filling proprerty
    type: 'pattern',
    pattern: 'darkVertical',
    fgColor: { argb: 'b6d7a8' },
    bgColor: { argb: 'b6d7a8' }
}

let fill2 = {
    type: 'pattern',
    pattern: 'darkVertical',
    fgColor: { argb: 'f8cb9c' },
    bgColor: { argb: 'f8cb9c' }
}

let fill3 = {
    type: 'pattern',
    pattern: 'darkVertical',
    fgColor: { argb: 'd5dbd6' },
    bgColor: { argb: '3c78d8' }
}

let font = { name: 'Arial', size: 12, bold: true };
export async function crearPDF() {

}


/*

{
            "nombres": "Empleado2 Apellido2",
            "ci": "1105587131",
            "ubicacion": "192.100000,-59.340000",
            "dia": 3,
            "mes": 1,
            "anio": 2019,
            "hora": "7:5:0.123",
            "timest": "2019-01-03T12:05:00.123Z",
            "dispositivo": "Tablet de Empleado",
            "evento": "Entrada"
        }
 */
export async function crearExcel(data) {
    if (data.length === 0) return null;
    await wb.xlsx.readFile(`${appDir}/../assets/Template.xlsx`);
    //console.log('Leido');
    let meses = [];
    let dias = [];
    let ifilas = 6;
    data.forEach((reg, index) => {
        let { nombres, ci, ubicacion, timest, dispositivo, evento } = reg;
        let fecha = dt.format(new Date(timest), `EEEE,dd,MMMM,yyyy,HH:mm:ss`, { locale: es }).split(',');
        let mmyy = `${fecha[2]} ${fecha[3]}`;
        let eedd = `${fecha[0]} ${fecha[1]} ${fecha[2]}`;
        let hms = `${fecha[4]}`;

        if (!meses.includes(mmyy)) {
            meses.push(mmyy);
            ifilas = 6;
            let ws = wb.getWorksheet(`Hoja ${meses.length}`);
            ws.name = `${mmyy.toUpperCase()}`
            ws.getCell('A1').value = `REGISTRO DE ASISTENCIA- ${mmyy.toUpperCase()}`;
            ws.getCell('C2').value = `${nombres}`;
            ws.getCell('C3').value = `${ci}`;
            ws.getCell('C4').value = `${dt.format(new Date(), 'dd/MM/yyyy')}`;

            ws.getCell(`A${ifilas}`).value = `${eedd}`;

            ifilas++;
            let idTag = ws.getCell(`A${ifilas}`);
            idTag.value = `${index}`;

            let eventTag = ws.getCell(`B${ifilas}`);
            eventTag.value = evento;



            let horaTag = ws.getCell(`C${ifilas}`);
            horaTag.value = hms;

            let dispTag = ws.getCell(`D${ifilas}`);
            dispTag.value = dispositivo;

            let ubTag = ws.getCell(`E${ifilas}`);
            ubTag.value = ubicacion;
            if (evento === 'Entrada') {
                idTag.style.fill = fill1;
                eventTag.style.fill = fill1;
                horaTag.style.fill = fill1;
                dispTag.style.fill = fill1;
                ubTag.style.fill = fill1;
            } else {
                idTag.style.fill = fill2;
                eventTag.style.fill = fill2;
                horaTag.style.fill = fill2;
                dispTag.style.fill = fill2;
                ubTag.style.fill = fill2;
            }
            eventTag.alignment = { vertical: 'middle', horizontal: 'center' };
            dias.push(eedd);
            ifilas++;
        } else {
            let ws = wb.getWorksheet(`${mmyy.toUpperCase()}`);
            //console.log(ws);
            if (!dias.includes(eedd)) {
                //console.log('nuevo');
                let dayTag = ws.getCell(`E${ifilas}`);
                dayTag.merge(ws.getCell(`A${ifilas}`));

                dayTag.value = `${eedd}`;
                dayTag.style.fill = fill3;
                dayTag.alignment = { vertical: 'middle', horizontal: 'center' };
                dayTag.font = font;



                ifilas++;
                let idTag = ws.getCell(`A${ifilas}`);
                idTag.value = `${index}`;

                let eventTag = ws.getCell(`B${ifilas}`);
                eventTag.value = evento;



                let horaTag = ws.getCell(`C${ifilas}`);
                horaTag.value = hms;

                let dispTag = ws.getCell(`D${ifilas}`);
                dispTag.value = dispositivo;

                let ubTag = ws.getCell(`E${ifilas}`);
                ubTag.value = ubicacion;
                if (evento === 'Entrada') {
                    idTag.style.fill = fill1;
                    eventTag.style.fill = fill1;
                    horaTag.style.fill = fill1;
                    dispTag.style.fill = fill1;
                    ubTag.style.fill = fill1;
                } else if (evento === 'Salida') {
                    idTag.style.fill = fill2;
                    eventTag.style.fill = fill2;
                    horaTag.style.fill = fill2;
                    dispTag.style.fill = fill2;
                    ubTag.style.fill = fill2;
                }
                eventTag.alignment = { vertical: 'middle', horizontal: 'center' };
                dias.push(eedd);
                ifilas++;
            } else {
                //console.log('conocido');
                let idTag = ws.getCell(`A${ifilas}`);
                idTag.value = `${index}`;

                let eventTag = ws.getCell(`B${ifilas}`);
                eventTag.value = evento;


                let horaTag = ws.getCell(`C${ifilas}`);
                horaTag.value = hms;

                let dispTag = ws.getCell(`D${ifilas}`);
                dispTag.value = dispositivo;

                let ubTag = ws.getCell(`E${ifilas}`);
                ubTag.value = ubicacion;

                if (evento === 'Entrada') {
                    idTag.style.fill = fill1;
                    eventTag.style.fill = fill1;
                    horaTag.style.fill = fill1;
                    dispTag.style.fill = fill1;
                    ubTag.style.fill = fill1;

                } else {
                    idTag.style.fill = fill2;
                    eventTag.style.fill = fill2;
                    horaTag.style.fill = fill2;
                    dispTag.style.fill = fill2;
                    ubTag.style.fill = fill2;
                }
                eventTag.alignment = { vertical: 'middle', horizontal: 'center' };
                ifilas++;
            }
        }
    });


    // Limpia hojas vacias...
    wb.eachSheet(ws => {
        let name = ws.name;
        console.log(name);
        if (name.charAt(0) === 'H') {
            wb.removeWorksheet(name);
        }
    });

    // Envia al buffer
    let bf = await wb.xlsx.writeBuffer();
    return bf;
}

/*
function styleRow(event) {
    if (event === 'Entrada') {

    } else if (event === 'Salida') {

    }
}*/