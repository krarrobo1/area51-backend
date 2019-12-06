Select CONCAT(emp.nombres,' ', emp.apellidos) nombres, 
        emp.ci,
        CONCAT(asis.latitud,',',asis.longitud) ubicacion,
        EXTRACT(day FROM asis.hora) dia, 
        EXTRACT (month FROM asis.hora) mes,
        EXTRACT (year FROM asis.hora) anio,
        CONCAT(EXTRACT (HOUR from asis.hora),':',EXTRACT(MINUTE from asis.hora),':',EXTRACT(SECOND from asis.hora))hora,
        asis.hora timest,
        disp.nombre dispositivo, 
        evt.nombre evento
        FROM asistencias asis
        INNER JOIN dispositivos disp ON asis.dispositivoid = disp.id
        INNER JOIN empleados emp ON disp.empleadoid = emp.id
        INNER JOIN eventos evt ON asis.eventoid = evt.id
        WHERE emp.id = 1
        ORDER BY timest;

SELECT CONCAT (emp.nombres,' ',emp.apellidos) nombres , emp.ci,  CONCAT(asis.latitud,',', asis.longitud) ubicacion, asis.hora timest,disp.nombre dispositivo, evt.nombre evento 
FROM asistencias asis
INNER JOIN dispositivos disp ON asis.dispositivoid = disp.id
INNER JOIN empleados emp ON disp.empleadoid = emp.id
INNER JOIN eventos evt ON asis.eventoid = evt.id
WHERE emp.id = 1
ORDER BY timest;
