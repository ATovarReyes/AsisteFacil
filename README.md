# AsisteFácil — Sistema web de control de asistencia

Proyecto académico para demostrar la característica **usabilidad** del modelo de calidad ISO/IEC 25010.

## Funciones
- Registrar el nombre, fecha y estado de asistencia de una persona.
- Validar que el nombre no esté vacío.
- Mostrar mensajes claros al guardar.
- Consultar y buscar registros.
- Eliminar registros con confirmación.
- Ver un resumen de presentes y ausentes del día.
- Diseño adaptable a computadores y celulares.
- Guardar los registros en `localStorage` del navegador.

## Cómo ejecutarlo
1. Descarga y descomprime la carpeta del proyecto.
2. Abre `index.html` en Chrome, Edge o Firefox.
3. También puedes abrir la carpeta en Visual Studio Code e iniciar **Live Server**.
4. No requiere instalar paquetes ni configurar una base de datos.

## Pruebas sugeridas
1. Abre **Asistencia** e intenta guardar con el nombre vacío. Debe aparecer un mensaje de validación y no se debe crear el registro.
2. Escribe `María Fernanda López`, selecciona una fecha y el estado `Presente`; pulsa **Guardar registro**. Debe aparecer en el listado.
3. Cambia el estado a `Ausente` para otro nombre y comprueba el resumen del día.
4. Escribe parte de un nombre en el buscador y comprueba que se filtre la tabla.
5. Recarga la página y comprueba que los datos siguen disponibles en el mismo navegador.
6. Elimina un registro y comprueba que desaparece del listado.

## Requisito comprobable
**RF-01 — Registro de asistencia:** el sistema debe permitir registrar una persona con nombre, fecha y estado. Si el nombre está vacío, debe impedir el registro y mostrar un mensaje de validación.

**Criterio de aceptación:** al intentar guardar con el nombre vacío, el listado debe permanecer sin ese registro y el mensaje de validación debe ser visible. Con un nombre válido, el registro debe aparecer en el listado.

## Relación con ISO/IEC 25010
**Característica elegida: usabilidad.** La interfaz usa etiquetas visibles, acciones claras, validación de campos y confirmaciones para ayudar al usuario a completar las tareas.

## Alcance y limitaciones
- Es un prototipo académico; no usa cuentas ni sincroniza datos entre dispositivos.
- Los datos quedan guardados únicamente en el navegador y perfil donde se usa la aplicación.
- `localStorage` no es una base de datos central ni es apropiado para información sensible.
- Para compartir registros entre usuarios sería necesario añadir un backend y autenticación.

## Qué entregar
- El enlace público si lo publicas con GitHub Pages, o esta carpeta con el código fuente.
- Capturas de pantalla de la interfaz y de las pruebas.
- La descripción de la idea, característica de calidad, implementación y requisito comprobable.
