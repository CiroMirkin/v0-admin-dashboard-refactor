# Guía de Deploy y Gestión de Dependencias

## 🚨 Problemas Comunes de Deploy

### Lockfile Desactualizado

**Error típico en Vercel:**
```
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json
```

**Causa:** El `package.json` fue modificado pero el lockfile no se actualizó.

## ✅ Solución

### 1. Actualizar Lockfile

```bash
# Usar pnpm (recomendado para este proyecto)
npx pnpm@latest install

# O usar npm si pnpm no está disponible
npm install
```

### 2. Verificar y Commitear

```bash
git status
git add pnpm-lock.yaml
git commit -m "fix: actualizar lockfile para deploy"
```

## 🛡️ Prevención

### Regla de Oro: **Siempre actualizar lockfile después de modificar package.json**

**Flujo correcto:**
1. Modificar `package.json` (agregar/eliminar dependencias)
2. **Inmediatamente después**: Ejecutar `pnpm install`
3. Verificar cambios en lockfile
4. Commitear ambos archivos juntos

### Comandos Esenciales

```bash
# Después de cualquier cambio en package.json
pnpm install

# Verificar qué dependencias cambiaron
git diff package.json

# Verificar cambios en lockfile
git diff pnpm-lock.yaml
```

## 🔄 Gestión de Paquetes

### Estructura del Proyecto

```
📁 Raíz del proyecto
├── package.json           # Dependencias y scripts
├── pnpm-lock.yaml        # Lockfile de pnpm (usado por Vercel)
├── package-lock.json     # Lockfile de npm (backup/local)
└── node_modules/        # Dependencias instaladas
```

### Gestores de Paquetes

- **Vercel**: Usa `pnpm` por defecto
- **Desarrollo local**: Puede usar `npm` o `pnpm`
- **Importante**: Mantener `pnpm-lock.yaml` actualizado

## 📋 Checklist Antes de Deploy

### ✅ Verificación de Dependencias

```bash
# 1. Verificar que package.json esté limpio
git status

# 2. Actualizar lockfile si es necesario
pnpm install

# 3. Verificar que no haya cambios pendientes
git status

# 4. Probar build localmente
pnpm run build
```

### ✅ Comandos de Verificación

```bash
# Verificar dependencias desactualizadas
pnpm outdated

# Verificar vulnerabilidades
pnpm audit

# Limpiar e instalar desde cero
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 🔧 Configuración de Vercel

### Variables de Entorno Requeridas

```bash
# Supabase Cliente
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase Servidor
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Administración
NEXT_PUBLIC_ADMIN_EMAIL=
```

### Build Command

Vercel usa automáticamente:
```bash
pnpm install
pnpm run build
```

## 🚨 Errores Comunes y Soluciones

### Error: "frozen-lockfile"

**Causa:** Lockfile desactualizado
**Solución:** `pnpm install` y commitear lockfile

### Error: "dependency not found"

**Causa:** Dependencia faltante en package.json
**Solución:** Agregar dependencia y actualizar lockfile

### Error: "build failed"

**Causa:** Error de compilación
**Solución:** Probar build localmente primero

## 📝 Mejores Prácticas

### 1. Commits Atómicos

```bash
# ✅ Correcto: Cambio de dependencias en un commit
git add package.json pnpm-lock.yaml
git commit -m "feat: agregar TanStack Query"

# ❌ Incorrecto: Separar los cambios
git add package.json
git commit -m "feat: agregar TanStack Query"
# (olvidando el lockfile)
```

### 2. Verificación Pre-Deploy

```bash
# Siempre probar build antes de push
pnpm run build

# Verificar que no haya cambios sin commitear
git status
```

### 3. Manejo de Versiones

```bash
# Para actualizar dependencias
pnpm update

# Para agregar nueva dependencia
pnpm add nombre-del-paquete

# Para agregar dev dependency
pnpm add -D nombre-del-paquete
```

## 🆘 Soporte

### Si el deploy falla:

1. **Verificar logs de Vercel** para identificar el error exacto
2. **Revisar este documento** para soluciones comunes
3. **Probar localmente** con los mismos comandos que Vercel
4. **Verificar variables de entorno** en el dashboard de Vercel

### Comandos de Debug

```bash
# Verificar instalación de dependencias
pnpm list

# Verificar scripts disponibles
pnpm run

# Verificar configuración
pnpm config list
```

---

**Recordatorio:** Esta guía debe actualizarse cuando se realicen cambios en la configuración del proyecto o en los procesos de deploy.