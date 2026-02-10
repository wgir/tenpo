# Manual Técnico - Tenpo Personnel Services Frontend

Este documento proporciona una visión técnica detallada de la arquitectura, estructura de archivos e interacciones entre los componentes del frontend de Tenpo.

## 🏗️ Arquitectura: Feature-Sliced Design (FSD)

El proyecto sigue una versión pragmática de **Feature-Sliced Design**. Esto significa que la lógica está organizada por "capacidades de negocio" (features) en lugar de solo por tipos de archivos técnicos.

### Capas Principales:
1.  **Core/API**: Configuración global de comunicación.
2.  **UI Components (Atomic)**: Componentes básicos reutilizables.
3.  **Features**: Módulos independientes que contienen lógica de negocio.
4.  **Layouts**: Estructura visual de la aplicación.
5.  **Pages**: Ensamblaje de features en vistas completas.

---

## 📂 Estructura de Directorios y Componentes

### 1. `src/api`
- **`axiosInstance.ts`**: Configura la instancia global de Axios con la URL base (`VITE_API_URL`) y headers comunes. Es el único punto de entrada para peticiones HTTP.

### 2. `src/components/ui`
Componentes atómicos sin lógica de negocio, diseñados para ser altamente reutilizables y consistentes visualmente.
- **`Button.tsx`**: Soporta múltiples variantes (primary, secondary, danger) y estados de carga.
- **`Input.tsx` / `Select.tsx`**: Integrados con `react-hook-form` para manejo de errores y labels.
- **`Modal.tsx`**: Maneja backdrops, cierre con ESC y scroll-locking.

### 3. `src/features/`
Cada feature (`tenpistas`, `transactions`) es autónoma y sigue este patrón interno:
- **`api/`**: Funciones asíncronas que usan `axiosInstance` para interactuar con los endpoints específicos.
- **`types/`**: Interfaces de TypeScript que definen la forma de los datos y DTOs.
- **`schemas/`**: Validaciones de Zod usadas tanto en formularios como para asegurar la integridad de datos.
- **`hooks/`**: Ganchos de `react-query` (`useQuery`, `useMutation`) que gestionan el estado del servidor, caché e invalidación de datos.
- **`components/`**: UI específica de la feature (como `TransactionForm` o `ClientList`).

---

## 🔄 Interacción entre Componentes

### Flujo de Datos (Transactions -> Tenpistas)
La interacción más compleja ocurre en el módulo de **Transactions**:

1.  **Carga de Datos**: `TransactionForm` utiliza los hooks `useTenpistas` para poblar los desplegables de selección.
2.  **Relaciones Dinámicas**:
    - Si un usuario necesita registrar una transacción pero el cliente no existe, `TransactionForm` abre un **Modal anidado** con el `ClientForm`.
    - Al guardar el nuevo cliente, el "caché de React Query" se invalida automáticamente.
    - El hook `useClients` detecta el cambio y actualiza el select de la transacción sin recargar la página.
3.  **Gestión de Estado**: `react-hook-form` coordina la validación local mediante el `transactionSchema` de Zod, asegurando que no se envíen datos inválidos al backend.

### Dashboard y Layout
1.  **`MainLayout`**: Gestiona el estado de navegación (`activeSection`) y proporciona el contenedor responsivo.
2.  **`Dashboard`**: Actúa como el orquestador principal. Dependiendo de la sección activa, renderiza el `List` correspondiente y gestiona los modales de creación/edición.

---

## 🛠️ Tecnologías Core y su Rol

| Tecnología | Propósito |
| :--- | :--- |
| **React 19** | Biblioteca base para UI y gestión de componentes. |
| **Tailwind CSS 4** | Estilizado mediante utilidades y motor de diseño moderno. |
| **React Query v5** | Gestión de estado asíncrono, sincronización con el servidor y caché. |
| **React Hook Form** | Manejo performante de formularios y validaciones complejas. |
| **Zod** | Esquemas de validación de esquemas en tiempo de ejecución y tipado estático. |
| **Lucide React** | Set de iconos consistente y ligero. |
| **Vitest** | Framework de pruebas unitarias rápido y compatible con Vite. |
| **Testing Library** | Utilidades para probar componentes desde la perspectiva del usuario. |
| **MSW** | Mock Service Worker para interceptar y simular respuestas de API. |

---

## ⚡ Calidad y Optimización

- **Tipado Estricto**: Se evitan los tipos `any`. Todos los DTOs e interfaces están definidos para prevenir errores en tiempo de desarrollo.
- **Performance**: Uso intensivo de la caché de React Query para minimizar peticiones redundantes.
- **Responsive Design**: Mobile-first usando las variantes de Tailwind (`sm:`, `md:`, `lg:`).

---

## 🧪 Estrategia de Pruebas (Testing)

El proyecto cuenta con una infraestructura de pruebas automatizadas diseñada para asegurar la estabilidad a largo plazo.

### Componentes de Testing:
1.  **Unit Tests (Vitest)**: Pruebas de lógica pura en `utils/` y validaciones en `schemas/`.
2.  **Component Tests (React Testing Library)**: Pruebas de comportamiento de UI, asegurando que los formularios y componentes reaccionen correctamente a las interacciones.
3.  **Hooks / API Integration (MSW)**: Uso de **Mock Service Worker** para simular el backend. Esto permite probar los ganchos de `react-query` sin necesidad de un servidor real funcionando.

### Comandos de Ejecución:
- `npm test`: Inicia el corredor de pruebas en modo interactivo (watch).
- `npm test -- --run`: Ejecuta las pruebas una sola vez (ideal para CI/CD).

---
*Este manual es una guía viva para desarrolladores que deseen extender o mantener la plataforma Tenpo.*
