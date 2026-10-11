# ANODEFLEX 3 + 3 nodos · 1 inyección

Aplicación web instalable para calibrar y regular doce ramas ANODEFLEX distribuidas en seis nodos.

## Mediciones de campo

- Lado A: fuente `VA` → `Rc1` → nodo 1 → `Rc2` → nodo 2 → `Rc3` → nodo 3. Ramas `R11`, `R12`, `R21`, `R22`, `R31` y `R32`.
- Lado B: fuente `VB` → `Rc4` → nodo 4 → `Rc5` → nodo 5 → `Rc6` → nodo 6. Ramas `R41`, `R42`, `R51`, `R52`, `R61` y `R62`.

Cada lado se calibra de forma independiente con sus seis corrientes medidas y los reóstatos en `0 Ω`. La app calcula las doce resistencias fijas después de descontar las caídas de tensión en los cables.

## Regulación

Una sola fuente `V` alimenta los seis nodos desde el nodo 1. La corriente pasa por `Rc1` a `Rc6` en secuencia, con dos ramas en paralelo en cada nodo. `V` es una entrada independiente de `VA` y `VB`.

La app calcula la tensión mínima y los reóstatos a partir de las doce corrientes objetivo, dejando al menos un reóstato en 0 Ω. La tensión y los reóstatos también pueden editarse manualmente. Indica cuando el ajuste supera el reóstato máximo y muestra corrientes, caídas, potencias y balances. Permite exportar e importar casos JSON e imprimir un informe.

## Pruebas y publicación

Desde la raíz del proyecto, ejecute `node tests/model.test.js` y `node tests/static.test.js`. GitHub Pages sirve los archivos de `docs/`. Después de la primera carga, la app puede instalarse y usar los archivos esenciales sin conexión.
