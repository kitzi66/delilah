# Api - Delilah Resto

Api que nos permite la gestión de un Restaurant, que se realizó como parte de la evaluación de la carrera de Desarrollo Web Full Stack en Acamica.

## Características
- Login
- CRUD - Usuarios
- CRUD - Productos (platillos)
- Gestión de Pedidos
> **Documentación del API**
> Ingresar a la pagina de [Swagger  Editor](https://editor.swagger.io/) e importar el archivo `openapi.yaml`

## Detalle del API

Actividades según el rol del usuario, que se pueden ejecutar con esta API

|                |Todos (sin token)              |Administrador                         | Usuario|
|----------------|-------------------------------|-----------------------------|-------------|
|Usuarios          |Crear (rol usuario)          |Crear, Consultar, Editar, Borrar (CRUD)            |CRUD (solo su usuario)
|Productos          |No|CRUD|No
|Pedidos | No |CRUD| Consulta, Crear (solo los propios)



# Recursos y Tecnologías

- Nodejs
- Base de datos **Mysql**
- Git
- Express
- JWT - Json Web Token
- Open Api - Documentación
- Postman

# Instalación

## Pre-requisitos
- Tener instalado [NodeJS](https://nodejs.org/es/download/)
> La instalacion varia segun el Sistema Operativo que este utilizando.
- Tener instalado [Mysql](https://dev.mysql.com/downloads/)
> La instalacion varia segun el Sistema Operativo que este utilizando.

## Instalación

- Clonar el repositorio
	> git clone https://github.com/kitzi66/delilah.git `nombreCarpeta`
- Configuración de la Base de Datos (BD)
Se generará la estructura de la Base de Datos, y se cargaran por default, uno con rol de administrador (`admon`) y otro de usuario (`usuario`), el password de ambos es `pass123`.
	> Importación de la estructura de la BD **bd_delilah.sql**
		- Puede importar el archivo mediante un programa como MySQL Workbench o phpMyAdmin
		- O por línea de comando, *Considere que si tiene una base de datos con nombre delilah_bd, será eliminada.*
		>mysql -u `<usuario_BD>` -p `<password_BD>` < bd_delilah.sql

- Ingresar a la carpeta `nombreCarpeta`, y correr en línea de comando
	> npm install
- Editar el archivo .env y establecer el usuario y password de la base de datos, según su configuración actual.
	> BD_HOST=localhost
	> **BD_USER=usuario_BD**
	> **BD_PASSWORD=password_BD**
	> BD_BASE_DATOS=delilah_bd
- Levantar el servidor, ejecutando en la carpeta del proyecto
	> node index
- Se anexa archivo de pruebas en Postman
	> Importar el archivo **delilah.postman_collection.json**

# Link del proyecto
- **[Proyecto GitHub](https://github.com/kitzi66/delilah)**