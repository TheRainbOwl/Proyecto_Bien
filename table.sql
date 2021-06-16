
// QUERIES PARA LA BASE DE DATOS DE RESPALDO (POR SI BORRAMOS ALGO)

INSERT INTO medico VALUES
(DEFAULT,'Antonio', 'Becerra', 'Villa', '8248469550', 'ANCV980229MHJTCL12', 'Estrella Polar #4496, La Calma, 45070 Zapopan, Jal.', 'M', '1998-03-29', '2014-10-19', 'Pediatra', true),
(DEFAULT,'Francisco', 'Chavolla', 'Gonzáles', '7493950315', 'FRCG941020MHJAAN04', 'Diagonal Manuel Cambre 2010, Chapultepec Country, 44620 Guadalajara, Jal.', 'M', '1994-10-20', '2012-01-25', 'Cardiología', true),
(DEFAULT,'Alejandro', 'Gallegos', 'Rodriguez', '1441342948', 'ALGR961222MHJELD01', 'José Enrique Rodó 2903, Prados Providencia, 44670 Guadalajara, Jal.', 'M', '1996-12-22', '2014-09-14', 'Dermatología', true),
(DEFAULT,'Roberto', 'Cuitláhuac', 'Torres', '5450744729', 'ROCT980604MHJBIR16', 'Consultorio 503 en, Av. Empresarios 150, Torre Elite, 45116 Zapopan, Jal.', 'M', '1998-06-04', '2016-05-07', 'Neurología', true),
(DEFAULT,'Antonio', 'Lomelí', 'Rivera', '2861065842', 'ANLR810702MHJTMV15', 'Médica San Francisco, Jardines del Bosque, 44520 Guadalajara, Jal.', 'M', '1981-07-02', '2009-12-03', 'Otorrinolaringología', true),
(DEFAULT,'Rosa', 'Estela', 'Romero', '9231884504', 'ROER930315FHJSTM02', 'Torre de especialidades del Hospital Angeles del carmen Tarascos 3473, Monraz, 44670 Guadalajara, Jal.', 'F', '1993-03-15', '2011-11-10', 'Urología', true),
(DEFAULT,'Mayra', 'Pérez', 'Aguayo', '0434390259', 'MAPA820826FHJYRU18', 'Eulogio Parra 2979, Prados Providencia, 44670 Guadalajara, Jal.', 'F', '1982-08-26', '2010-04-25', 'Ginecología', true),
(DEFAULT,'Ana', 'Rivera', 'Azpe', '3951687676', 'ANRA790912FHJAVP03', 'Av. Adolfo López Mateos Sur No. 1401, Amapas, 45640 Tlajomulco de Zúñiga, Jal.', 'F', '1979-09-12', '2015-05-14', 'Gastroenterología', true),
(DEFAULT,'Patricia', 'Sanin', 'Rivera', '6075265507', 'PASR791108FHJTNV07', 'Ignacio Herrera y Cairo 2811, Terranova, 44689 Guadalajara, Jal.', 'F', '1979-11-08', '2020-07-24', 'Odontología', true),
(DEFAULT,'Cinthya', 'Ramos', 'Castellón', '4811828048', 'CIRC960429FHJNMS19', 'Av. Nicolás Copérnico No. 3817-Interior 17, Arboledas, 45070 Guadalajara, Jal.', 'F', '1996-04-29', '2021-04-23', 'Oftalmología', true);


INSERT INTO medico_usuarios VALUES
(DEFAULT, 'ANCV980229MHJTCL12', 'Antonio'),
(DEFAULT, 'ANCV980229MHJTCL12', 'Francisco'),
(DEFAULT, 'ANCV980229MHJTCL12', 'Alejandro'),
(DEFAULT, 'ANCV980229MHJTCL12', 'Roberto'),
(DEFAULT, 'ANCV980229MHJTCL12', 'Antonio'),
(DEFAULT, 'ANCV980229MHJTCL12', 'Rosa'),
(DEFAULT, 'ANCV980229MHJTCL12', 'Mayra'),
(DEFAULT, 'ANCV980229MHJTCL12', 'Ana'),
(DEFAULT, 'ANCV980229MHJTCL12', 'Patricia'),
(DEFAULT, 'ANCV980229MHJTCL12', 'Cinthya');

CREATE TABLE medico(
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(50),
	apellido1 VARCHAR(60),
	apellido2 VARCHAR(60),
	nss TEXT,
	curp VARCHAR(18),
	domicilio VARCHAR(200),
	sexo CHAR,
	fecha_nac DATE,
	fecha_ingreso DATE,
	especialidad VARCHAR(60),
	habilitado bool
);

CREATE TABLE paciente(
	id SERIAL,
	nombre VARCHAR(50),
	apellido1 VARCHAR(50),
	apellido2 VARCHAR(50),
	nss TEXT,
	curp VARCHAR(18),
	sexo CHAR,
	fecha_nac DATE,
	telefono VARCHAR(20),
	habilitado BOOL
)

CREATE TABLE medico_usuarios(
	id SERIAL,
	usuario VARCHAR(18),
	contrasenia VARCHAR(50),
	FOREIGN KEY(id) REFERENCES medico(id)
)

CREATE TABLE cita(
	id SERIAL,
	doctorNombre VARCHAR(50),
	doctorApellido1 VARCHAR(50),
	doctorCurp VARCHAR(18),
	pacienteNombre VARCHAR(50),
	pacienteApellido1 VARCHAR(50),
	pacienteCurp VARCHAR(18),
	dia DATE,
	hora TIME
);