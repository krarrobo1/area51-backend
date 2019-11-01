import * as dt from 'date-fns';
import { es } from 'date-fns/locale';

import ExcelJS from 'exceljs';
let wb = new ExcelJS.Workbook();

import path from 'path';
var appDir = path.dirname(require.main.filename);


export async function makeFile(data) {
    let formato = await formatData(data);
    console.log(formato);
    //console.log(appDir);
    //return true
    try {
        await wb.xlsx.readFile(`${appDir}/assets/Template.xlsx`);

        // Numero de meses de reporte.
        let limite = formato.length + 1;
        // Se eliminan ws innecesarias.
        for (let i = limite; i <= 12; i++) {
            wb.removeWorksheet(i);
        }

        formato.forEach((mn, i) => {
            let { month, employee, reportDate, days } = mn;
            let ws = wb.getWorksheet(i + 1);
            ws.name = month.toUpperCase();
            ws.getCell('A1').value = `REGISTRO DE ASISTENCIA- ${month.toUpperCase()}`;
            ws.getCell('C2').value = `${employee.names}`;
            ws.getCell('C3').value = `${employee.ci}`;
            ws.getCell('C4').value = `${reportDate}`;

            // 5 son las cabeceras

            let ifilas = 6;
            let sumaHoras = 0;
            days.forEach(element => {
                let { day, entries } = element;
                if (ifilas !== 6) {
                    ifilas++;
                }
                ws.getCell(`A${ifilas}`).value = day;
                ifilas++;

                entries.forEach(entry => {
                    let { id, hora, evento, dispositivo, ubicacion } = entry;
                    let idTag = ws.getCell(`A${ifilas}`);
                    idTag.value = id;

                    let eventTag = ws.getCell(`B${ifilas}`);
                    eventTag.value = evento;


                    let horaTag = ws.getCell(`C${ifilas}`);
                    horaTag.value = hora;

                    let dispTag = ws.getCell(`D${ifilas}`);
                    dispTag.value = dispositivo;

                    let ubTag = ws.getCell(`E${ifilas}`);
                    ubTag.value = ubicacion;


                    ifilas++;
                });

                ws.getCell(`C${ifilas}`).value = `Horas Acumuladas: ${sumaHoras}`;
            });
            ifilas++;
            ws.getCell(`A${ifilas}`).value = 'TOTAL: ';
        });

        let title = new Date().getMilliseconds() * 369;
        await wb.xlsx.writeFile(`${appDir}/assets/${title}.xlsx`);
        console.log(`Archivo ${title} creado`);

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}





let formatData = function(data) {
    let str = [],
        formatedDate = 'EEEE,dd,MMMM,yyyy,HH:mm:ss',
        temp = [];
    console.log(data);

    for (let entry of data) {
        let { hora: date, id, dispositivo, evento, latitud, longitud } = entry;
        let { empleado } = dispositivo;

        let fd = dt.format(new Date(date), formatedDate, { locale: es });
        let splitedDate = fd.split(',');

        let mmyy = `${splitedDate[2]} ${splitedDate[3]}`;
        let eedd = `${splitedDate[0]} ${splitedDate[1]}`;
        let hms = `${splitedDate[4]}`;

        let objR = { id, hora: hms, evento: evento.nombre, dispositivo: dispositivo.nombre, ubicacion: `${latitud},${longitud}` };

        if (!temp.includes(mmyy)) { // Saber si el mes ya existe..
            temp.push(mmyy);
            str.push({ employee: { names: `${empleado.nombres} ${empleado.apellidos}`, ci: `${empleado.ci}` }, month: mmyy, days: [{ day: eedd, entries: [objR], th: 0 }], reportDate: dt.format(new Date(), 'dd/MM/yyyy') });
        } else {

            let objTemp = str.find(elem => elem.month === mmyy);
            let { days } = objTemp;
            let conocido = days.find(d => d.day === eedd);
            if (conocido === undefined) {
                //console.log('nuevo dia');
                objTemp.days.push({ day: eedd, entries: [objR] });
            } else {
                //console.log('lo conoce');
                conocido.entries.push(objR);
            }
        }
    }
    return str;
};