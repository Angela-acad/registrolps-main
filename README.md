# Proyecto Login y Registro

Aplicación web full stack con frontend en React y backend en Spring Boot para autenticación de usuarios con validaciones básicas.

## Tecnologías

- Frontend: React + Vite
- Backend: Java + Spring Boot + JPA
- Base de datos: MySQL

## Estructura del proyecto

```text
drive/
├── first-project/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
├── registrolps/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── ...
├── README.md
└── .git/
```

## Requisitos previos

- Node.js 18+
- Java 21
- MySQL
- Git

## 1) Frontend

Desde la carpeta `first-project`:

```bash
npm install
npm run dev
```

La aplicación normalmente se abre en:

```text
http://localhost:5173
```

## 2) Backend

Asegúrate de tener MySQL corriendo y crear la base de datos `registro`.

Luego configura la conexión en:

```yaml
registrolps/src/main/resources/application.yaml
```

Ejemplo:

```yaml
spring.datasource.url: jdbc:mysql://localhost:3306/registro
spring.datasource.username: root
spring.datasource.password:
spring.datasource.driver-class-name: com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto: update
```

Ahora ejecuta el backend:

```bash
cd registrolps
./mvnw spring-boot:run
```

La API queda disponible en:

```text
http://localhost:8080
```

## 3) Flujo de login y registro

El sistema permite:

- Registro de usuario con tipo de usuario
- Validación de campos obligatorios
- Verificación de usuario duplicado
- Login con validación por usuario, contraseña y tipo
- Mensaje de error si las credenciales no son correctas
- Redirección a `/inicio` si el login es exitoso

## 4) Endpoints principales

### Registro

```http
POST /api/usuario/registro
```

### Login

```http
POST /api/usuario/login
```

Payload esperado:

```json
{
  "usuario": "nat123",
  "ctrs": "123456",
  "tipo": "Usuario_estandar"
}
```

## 5) Validaciones esperadas

- Usuario obligatorio
- Contraseña obligatoria
- Tipo de usuario obligatorio
- Usuario duplicado no permitido
- Contraseña incorrecta: muestra error
- Datos correctos: redirige a la pantalla de inicio

## GitHub

Repositorio del proyecto:

```text
https://github.com/nathSD/first-proyect.git
```
