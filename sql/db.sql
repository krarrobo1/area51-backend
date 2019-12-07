
CREATE TABLE IF NOT EXISTS empresas
(
id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
nombre VARCHAR NOT NULL UNIQUE,
latitud NUMERIC(9,6) NOT NULL,
longitud NUMERIC(9,6) NOT NULL,
radio NUMERIC(5,2) NOT NULL,
estado BOOLEAN DEFAULT true NOT NULL,
direccion VARCHAR DEFAULT ''
);

INSERT INTO EMPRESAS(nombre, latitud, longitud, radio, direccion) VALUES('UTPL', -3.9869567, -79.2015254, 30.0, 'San Cayetano Alto');

CREATE TABLE IF NOT EXISTS cargos(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    empresaid integer references empresas(id) ON DELETE CASCADE,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO CARGOS(empresaid, nombre) VALUES (1, 'Docente'),(1, 'Director de Area');

SELECT * FROM EMPRESAS;

CREATE TABLE IF NOT EXISTS dias(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    nombre VARCHAR(10)
);

INSERT INTO dias(nombre) VALUES('Lunes');
INSERT INTO dias(nombre) VALUES('Martes');
INSERT INTO dias(nombre) VALUES('Miercoles');
INSERT INTO dias(nombre) VALUES('Jueves');
INSERT INTO dias(nombre) VALUES('Viernes');
INSERT INTO dias(nombre) VALUES('Sabado');
INSERT INTO dias(nombre) VALUES('Domingo');


CREATE TABLE IF NOT EXISTS roles
(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    nombre varchar(10)
);

INSERT INTO ROLES(nombre) VALUES ('superadmin');
INSERT INTO ROLES(nombre) VALUES ('admin');
INSERT INTO ROLES(nombre) VALUES ('user');

CREATE TABLE IF NOT EXISTS periodos(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    cargoid integer references cargos(id) ON DELETE CASCADE NOT NULL,
    diaid integer references dias(id) NOT NULL,
    horainicio TIME NOT NULL,
    horafin TIME NOT NULL
);


CREATE TABLE IF NOT EXISTS empleados
(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
	empresaid integer references empresas(id) ON DELETE CASCADE,
    cargoid integer references cargos(id) NOT NULL,
    rolid integer references roles(id) NOT NULL,
    nombres VARCHAR(80) NOT NULL CHECK(nombres <> ''),
    apellidos VARCHAR(80) NOT NULL CHECK(apellidos <> ''),
    ci VARCHAR(10) NOT NULL UNIQUE,
    email VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR
);

ALTER TABLE empleados ADD passresetkey VARCHAR;

INSERT INTO EMPLEADOS(empresaid, cargoid, rolid, nombres, apellidos, ci, email, password)
VALUES(1,1,1,'SUPER', 'ADMIN', '1102266192', 'admin@email.com', '')


/* Cambiar estructura dispositivos 
CREATE TABLE IF NOT EXISTS dispositivos
(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    empleadoid integer references empleados(id) NOT NULL ON DELETE CASCADE,
    nombre varchar,
    ip CIDR NOT NULL,
    mac MACADDR NOT NULL,
    modelo VARCHAR NOT NULL,
    estado boolean default true
);
*/
CREATE TABLE IF NOT EXISTS dispositivos
(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
	empleadoid integer references empleados(id) ON DELETE CASCADE NOT NULL,
    nombre varchar NOT NULL,
    modelo varchar NOT NULL,
    imei text NOT NULL,
    estado boolean default true
);

CREATE TABLE IF NOT EXISTS eventos
(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    nombre VARCHAR
);

INSERT INTO EVENTOS(nombre) VALUES ('Entrada');
INSERT INTO EVENTOS(nombre) VALUES ('Salida');

CREATE TABLE IF NOT EXISTS asistencias
(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    dispositivoid integer references dispositivos(id) ON DELETE CASCADE NOT NULL,
    empleadoid integer references empleados(id) ON DELETE CASCADE NOT NULL
    hora TIMESTAMP NOT NULL,
    latitud NUMERIC(9,6),
    longitud NUMERIC(9,6),
    eventoid integer references eventos(id) 
);




CREATE TABLE IF NOT EXISTS PERMISOS
(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    nombre VARCHAR
);

INSERT INTO PERMISOS(nombre) values ('Vacaciones');
INSERT INTO PERMISOS(nombre) values ('Intempestivo');


/*CREATE TABLE IF NOT EXISTS ESTADOPERMISOS(
	id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
	nombre VARCHAR(15)
);*/

CREATE TYPE estadopermiso AS ENUM ('aprobado', 'rechazado', 'enrevision');


INSERT INTO ESTADOPERMISOS(nombre) values ('Aprobado'),('Rechazado'),('En revision');

select * from ESTADOPERMISOS;

CREATE TABLE IF NOT EXISTS DETALLEPERMISOS(
    id integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    empleadoid integer references empleados(id) ON DELETE CASCADE,
    fechainicio TIMESTAMP NOT NULL,
    fechafin TIMESTAMP NOT NULL,
    permisoid integer references permisos(id) NOT NULL,
    estado estadopermiso default 'enrevision'
);
