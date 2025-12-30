#!/bin/bash
# Batch fix IIFE patterns in sector files

fix_file() {
  local file="$1"
  local namespace="$2"
  
  if ! grep -q "}(window\.${namespace}" "$file" 2>/dev/null; then
    return 0
  fi
  
  # Get class name
  local classname=$(grep "^class " "$file" | head -1 | awk '{print $2}')
  if [ -z "$classname" ]; then
    return 0
  fi
  
  # Add export to class
  sed -i "s/^class ${classname}/export class ${classname}/" "$file"
  
  # Remove namespace assignment
  sed -i "/^${namespace}\\.${classname} = ${classname};/d" "$file"
  
  # Remove closing IIFE
  sed -i "s/}(window\\.${namespace} = window\\.${namespace} || {}));//" "$file"
  
  # Add backward compat if not present
  if ! grep -q "// Backward compatibility" "$file"; then
    {
      echo ""
      echo "// Backward compatibility"
      echo "if (typeof window !== 'undefined') {"
      echo "  window.${namespace} = window.${namespace} || {};"
      echo "  window.${namespace}.${classname} = ${classname};"
      echo "}"
    } >> "$file"
  fi
  
  echo "✓ Fixed: $file"
}

# Fix hr directory (namespace: hr)
for file in app/sectors/hr/*.js; do
  [ -f "$file" ] && fix_file "$file" "hr"
done

# Fix community directory (namespace: cmut)
for file in app/sectors/community/*.js; do
  [ -f "$file" ] && fix_file "$file" "cmut"
done

# Fix cart directory (namespace: cart)
for file in app/sectors/cart/*.js; do
  [ -f "$file" ] && fix_file "$file" "cart"
done

# Fix hosting directory (namespace: host)
for file in app/sectors/hosting/*.js; do
  [ -f "$file" ] && fix_file "$file" "host"
done

# Fix messenger directory (namespace: msgr)
for file in app/sectors/messenger/*.js; do
  [ -f "$file" ] && fix_file "$file" "msgr"
done

# Fix school directory (namespace: schl)
for file in app/sectors/school/*.js; do
  [ -f "$file" ] && fix_file "$file" "schl"
done

# Fix exchange directory (namespace: exch)
for file in app/sectors/exchange/*.js; do
  [ -f "$file" ] && fix_file "$file" "exch"
done

# Fix frontpage directory (namespace: fp)
for file in app/sectors/frontpage/*.js; do
  [ -f "$file" ] && fix_file "$file" "fp"
done

# Fix pseudo directory (namespace: pseudo)
for file in app/sectors/pseudo/*.js; do
  [ -f "$file" ] && fix_file "$file" "pseudo"
done

# Fix blog directory (namespace: blog) - remaining files
for file in app/sectors/blog/*.js; do
  [ -f "$file" ] && fix_file "$file" "blog"
done

# Fix workshop directory (namespace: wksp)
for file in app/sectors/workshop/*.js; do
  [ -f "$file" ] && fix_file "$file" "wksp"
done

# Fix shop directory (namespace: shop)
for file in app/sectors/shop/*.js; do
  [ -f "$file" ] && fix_file "$file" "shop"
done

# Fix hosting directory - check namespace (might be hstn or host)
for file in app/sectors/hosting/*.js; do
  if grep -q "}(window\.hstn" "$file" 2>/dev/null; then
    fix_file "$file" "hstn"
  fi
done

# Fix frontpage directory (namespace: ftpg)
for file in app/sectors/frontpage/*.js; do
  [ -f "$file" ] && fix_file "$file" "ftpg"
done

# Fix pseudo directory (namespace: psud)
for file in app/sectors/pseudo/*.js; do
  [ -f "$file" ] && fix_file "$file" "psud"
done

# Fix school directory (namespace: scol)
for file in app/sectors/school/*.js; do
  [ -f "$file" ] && fix_file "$file" "scol"
done

# Fix exchange directory (namespace: xchg)
for file in app/sectors/exchange/*.js; do
  [ -f "$file" ] && fix_file "$file" "xchg"
done

echo "Batch fix complete!"
